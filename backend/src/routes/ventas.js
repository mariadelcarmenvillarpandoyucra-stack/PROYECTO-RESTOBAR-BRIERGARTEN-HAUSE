import { Router } from "express";
import { query, pool } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { horaActual } from "../utils/format.js";

const router = Router();

async function mapVenta(row) {
  const { rows: items } = await query(
    "SELECT nombre, cant FROM venta_items WHERE venta_id = $1 ORDER BY id",
    [row.id]
  );
  return {
    id: row.id,
    mesa: row.mesa,
    mesero: row.mesero,
    items: items.map((i) => ({ nombre: i.nombre, cant: i.cant })),
    subtotal: Number(row.subtotal),
    propina: Number(row.propina),
    metodoPago: row.metodo_pago,
    calificacion: row.calificacion,
    hora: row.hora,
    ts: new Date(row.ts).getTime(),
  };
}

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM ventas ORDER BY ts DESC");
  res.json(await Promise.all(rows.map(mapVenta)));
}));

router.post("/cobrar", requireAuth, asyncHandler(async (req, res) => {
  const { mesa, pedidoIds, propina = 0, metodoPago, calificacion = 0 } = req.body || {};
  if (!mesa || !Array.isArray(pedidoIds) || pedidoIds.length === 0 || !metodoPago) {
    return res.status(400).json({ error: "mesa, pedidoIds y metodoPago son requeridos" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: pedidos } = await client.query(
      `SELECT * FROM pedidos WHERE id = ANY($1::int[])`,
      [pedidoIds]
    );
    if (!pedidos.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "No se encontraron los pedidos de esta mesa" });
    }
    const subtotal = pedidos.reduce((s, p) => s + Number(p.total), 0);
    const mesero = pedidos[0].mesero;

    const { rows: ventaRows } = await client.query(
      `INSERT INTO ventas (mesa, mesero_id, mesero, subtotal, propina, metodo_pago, calificacion, hora)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [mesa, pedidos[0].mesero_id, mesero, subtotal, propina, metodoPago, calificacion, horaActual()]
    );
    const venta = ventaRows[0];

    for (const p of pedidos) {
      const { rows: items } = await client.query(
        "SELECT nombre, cant FROM pedido_items WHERE pedido_id = $1",
        [p.id]
      );
      for (const it of items) {
        await client.query(
          "INSERT INTO venta_items (venta_id, nombre, cant) VALUES ($1,$2,$3)",
          [venta.id, it.nombre, it.cant]
        );
      }
    }

    await client.query("DELETE FROM pedidos WHERE id = ANY($1::int[])", [pedidoIds]);
    await client.query("UPDATE mesas SET estado = 'libre', hora_apertura = NULL WHERE num = $1", [mesa]);

    await client.query("COMMIT");
    res.status(201).json(await mapVenta(venta));
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}));

export default router;
