import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function mapRow(r) {
  return {
    num: r.num,
    estado: r.estado,
    horaApertura: r.hora_apertura ? new Date(r.hora_apertura).getTime() : null,
  };
}

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM mesas ORDER BY num");
  res.json(rows.map(mapRow));
}));

export default router;
