import { Router } from "express";
import { query, pool } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { horaActual } from "../utils/format.js";

const router = Router();

async function mapPedido(row) {
  const { rows: items } = await query(
    "SELECT nombre, cant, precio FROM pedido_items WHERE pedido_id = $1 ORDER BY id",
    [row.id]
  );
  return {
    id: row.id,
    mesa: row.mesa,
    mesero: row.mesero,
    estado: row.estado,
    items: items.map((i) => ({ nombre: i.nombre, cant: i.cant, precio: Number(i.precio) })),
    hora: row.hora,
    ts: new Date(row.ts).getTime(),
    total: Number(row.total),
    horaListo: row.hora_listo || undefined,
  };
}

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const { estado, mesero } = req.query;
  const clauses = [];
  const params = [];
  if (estado) { params.push(estado); clauses.push(`estado = $${params.length}`); }
  if (mesero) { params.push(mesero); clauses.push(`mesero = $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await query(`SELECT * FROM pedidos ${where} ORDER BY ts DESC`, params);
  res.json(await Promise.all(rows.map(mapPedido)));
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const { mesa, items } = req.body || {};
  if (!mesa || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "mesa e items son requeridos" });
  }
  const mesero = req.user.displayName;
  const total = items.reduce((s, it) => s + Number(it.precio) * Number(it.cant), 0);
  const hora = horaActual();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO pedidos (mesa, mesero_id, mesero, estado, total, hora)
       VALUES ($1,$2,$3,'pendiente',$4,$5) RETURNING *`,
      [mesa, req.user.sub, mesero, total, hora]
    );
    const pedido = rows[0];
    for (const it of items) {
      await client.query(
        "INSERT INTO pedido_items (pedido_id, nombre, cant, precio) VALUES ($1,$2,$3,$4)",
        [pedido.id, it.nombre, it.cant, it.precio]
      );
    }
    await client.query(
      "UPDATE mesas SET estado = 'ocupada', hora_apertura = COALESCE(hora_apertura, now()) WHERE num = $1 AND estado = 'libre'",
      [mesa]
    );
    await client.query("COMMIT");
    res.status(201).json(await mapPedido(pedido));
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}));

router.patch("/:id/estado", requireAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body || {};
  const validos = ["pendiente", "preparando", "listo", "entregado"];
  if (!validos.includes(estado)) return res.status(400).json({ error: "Estado inválido" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const horaListo = estado === "listo" ? horaActual() : null;
    const { rows } = await client.query(
      `UPDATE pedidos SET estado = $2, hora_listo = COALESCE($3, hora_listo)
       WHERE id = $1 RETURNING *`,
      [id, estado, horaListo]
    );
    const pedido = rows[0];
    if (!pedido) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    if (estado === "listo") {
      await client.query(
        `INSERT INTO notificaciones (mesero, mesa, pedido_id, mensaje, hora, leida)
         VALUES ($1,$2,$3,$4,$5,false)`,
        [pedido.mesero, pedido.mesa, pedido.id, `Pedido #${pedido.id} listo para servir — Mesa ${pedido.mesa}`, horaActual()]
      );
    }
    await client.query("COMMIT");
    res.json(await mapPedido(pedido));
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}));

export default router;
