import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM barriles ORDER BY nombre");
  res.json(rows.map((r) => ({ id: r.id, nombre: r.nombre, nivel: r.nivel, capacidad: r.capacidad })));
}));

export default router;
