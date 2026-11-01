import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import productosRoutes from "./routes/productos.js";
import mesasRoutes from "./routes/mesas.js";
import pedidosRoutes from "./routes/pedidos.js";
import ventasRoutes from "./routes/ventas.js";
import notificacionesRoutes from "./routes/notificaciones.js";
import facturasRoutes from "./routes/facturas.js";
import barrilesRoutes from "./routes/barriles.js";
import meserosRoutes from "./routes/meseros.js";
import reportesRoutes from "./routes/reportes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "biergarten-haus-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/mesas", mesasRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/facturas", facturasRoutes);
app.use("/api/barriles", barrilesRoutes);
app.use("/api/meseros", meserosRoutes);
app.use("/api/reportes", reportesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Biergärten Haus API escuchando en http://localhost:${PORT}`);
});
