import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { horaActual } from "../utils/format.js";

const router = Router();

function mapRow(r) {
  return {
    id: r.id,
    mesa: r.mesa,
    mesero: r.mesero,
    nombreCliente: r.nombre_cliente,
    nit: r.nit,
    notas: r.notas,
    hora: r.hora,
    ts: new Date(r.ts).getTime(),
    atendida: r.atendida,
  };
}

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM solicitudes_factura ORDER BY ts DESC");
  res.json(rows.map(mapRow));
}));

router.post("/", requireAuth, asyncHandler(async (req, res) => {
  const { mesa, nombreCliente, nit, notas } = req.body || {};
  if (!mesa || !nombreCliente) {
    return res.status(400).json({ error: "mesa y nombreCliente son requeridos" });
  }
  const mesero = req.user.displayName;
  const { rows } = await query(
    `INSERT INTO solicitudes_factura (mesa, mesero, nombre_cliente, nit, notas, hora)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [mesa, mesero, nombreCliente, nit || "", notas || "", horaActual()]
  );
  res.status(201).json(mapRow(rows[0]));
}));

router.patch("/:id/atender", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    "UPDATE solicitudes_factura SET atendida = true WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Solicitud no encontrada" });
  res.json(mapRow(rows[0]));
}));

export default router;
