import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function mapRow(r) {
  return {
    id: r.id,
    mesero: r.mesero,
    mesa: r.mesa,
    pedidoId: r.pedido_id,
    mensaje: r.mensaje,
    hora: r.hora,
    leida: r.leida,
  };
}

router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const { mesero } = req.query;
  const params = [];
  let where = "";
  if (mesero) { params.push(mesero); where = "WHERE mesero = $1"; }
  const { rows } = await query(`SELECT * FROM notificaciones ${where} ORDER BY ts DESC`, params);
  res.json(rows.map(mapRow));
}));

router.patch("/:id/leida", requireAuth, asyncHandler(async (req, res) => {
  const { rows } = await query(
    "UPDATE notificaciones SET leida = true WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Notificación no encontrada" });
  res.json(mapRow(rows[0]));
}));

export default router;
