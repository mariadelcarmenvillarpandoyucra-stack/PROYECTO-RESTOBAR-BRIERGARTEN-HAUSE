import { Router } from "express";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/resumen", requireAuth, asyncHandler(async (_req, res) => {
  const { rows: ventas } = await query("SELECT * FROM ventas");
  const { rows: items } = await query(
    `SELECT vi.nombre, SUM(vi.cant) AS cant
     FROM venta_items vi
     GROUP BY vi.nombre
     ORDER BY cant DESC
     LIMIT 1`
  );

  const ventasHoy = ventas.reduce((s, v) => s + Number(v.subtotal), 0);
  const propinasHoy = ventas.reduce((s, v) => s + Number(v.propina), 0);
  const cajaEfectivo = ventas
    .filter((v) => v.metodo_pago === "efectivo")
    .reduce((s, v) => s + Number(v.subtotal) + Number(v.propina), 0);
  const cajaQR = ventas
    .filter((v) => v.metodo_pago === "qr")
    .reduce((s, v) => s + Number(v.subtotal) + Number(v.propina), 0);
  const calificadas = ventas.filter((v) => v.calificacion > 0);
  const calificacionPromedio = calificadas.length
    ? calificadas.reduce((s, v) => s + v.calificacion, 0) / calificadas.length
    : 0;
  const numEfectivo = ventas.filter((v) => v.metodo_pago === "efectivo").length;
  const numQR = ventas.filter((v) => v.metodo_pago === "qr").length;
  const pctQR = ventas.length ? Math.round((numQR / ventas.length) * 100) : 0;

  res.json({
    ventasHoy,
    propinasHoy,
    cajaEfectivo,
    cajaQR,
    calificacionPromedio,
    numVentas: ventas.length,
    numEfectivo,
    numQR,
    pctQR,
    productoTop: items[0]?.nombre || "—",
  });
}));

router.get("/mesero/:nombre", requireAuth, asyncHandler(async (req, res) => {
  const { rows: ventas } = await query("SELECT * FROM ventas WHERE mesero = $1", [req.params.nombre]);
  const pedidosHoy = ventas.length;
  const propinasHoy = ventas.reduce((s, v) => s + Number(v.propina), 0);
  const calificadas = ventas.filter((v) => v.calificacion > 0);
  const calificacion = calificadas.length
    ? calificadas.reduce((s, v) => s + v.calificacion, 0) / calificadas.length
    : 0;
  res.json({ pedidosHoy, propinasHoy, calificacion });
}));

router.get("/ventas-semana", requireAuth, asyncHandler(async (_req, res) => {
  const { rows } = await query(
    `SELECT to_char(ts, 'YYYY-MM-DD') AS dia, SUM(subtotal) AS total
     FROM ventas
     WHERE ts >= now() - interval '7 days'
     GROUP BY dia
     ORDER BY dia`
  );
  res.json(rows.map((r) => Number(r.total)));
}));

export default router;
