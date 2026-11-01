import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

function mapRow(r) {
  return {
    id: r.id,
    nombre: r.nombre,
    categoria: r.categoria,
    precio: Number(r.precio),
    icon: r.icon,
    imagen: r.imagen,
    descripcion: r.descripcion,
  };
}

router.get("/", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query("SELECT * FROM productos ORDER BY categoria, nombre");
  res.json(rows.map(mapRow));
}));

router.post("/", requireAuth, requireRole("dueno"), asyncHandler(async (req, res) => {
  const { nombre, categoria, precio, icon, imagen, descripcion } = req.body || {};
  if (!nombre || !categoria || precio == null) {
    return res.status(400).json({ error: "nombre, categoria y precio son requeridos" });
  }
  const { rows: maxRows } = await query(
    "SELECT id FROM productos WHERE id ~ '^p[0-9]+$' ORDER BY (substring(id from 2))::int DESC LIMIT 1"
  );
  let nextNum = 1;
  if (maxRows[0]) nextNum = parseInt(maxRows[0].id.slice(1), 10) + 1;
  const id = `p${nextNum}`;

  const { rows } = await query(
    `INSERT INTO productos (id, nombre, categoria, precio, icon, imagen, descripcion)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [id, nombre, categoria, precio, icon || "plate", imagen || null, descripcion || ""]
  );
  res.status(201).json(mapRow(rows[0]));
}));

router.put("/:id", requireAuth, requireRole("dueno"), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, icon, imagen, descripcion } = req.body || {};
  const { rows } = await query(
    `UPDATE productos SET
       nombre = COALESCE($2, nombre),
       categoria = COALESCE($3, categoria),
       precio = COALESCE($4, precio),
       icon = COALESCE($5, icon),
       imagen = COALESCE($6, imagen),
       descripcion = COALESCE($7, descripcion)
     WHERE id = $1 RETURNING *`,
    [id, nombre, categoria, precio, icon, imagen, descripcion]
  );
  if (!rows[0]) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(mapRow(rows[0]));
}));

router.delete("/:id", requireAuth, requireRole("dueno"), asyncHandler(async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM productos WHERE id = $1", [id]);
  res.status(204).end();
}));

export default router;
