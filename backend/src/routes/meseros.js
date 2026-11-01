import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query(
    "SELECT id, display_name AS nombre FROM usuarios WHERE role = 'mesero' AND activo = true ORDER BY display_name"
  );
  res.json(rows.map((r) => ({ id: `u${r.id}`, nombre: r.nombre })));
}));

export default router;
