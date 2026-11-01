import { Router } from "express";
import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import { firmarToken, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/login", asyncHandler(async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son requeridos" });
  }

  const { rows } = await query(
    "SELECT * FROM usuarios WHERE lower(username) = lower($1) AND activo = true",
    [String(username).trim()]
  );
  const usuario = rows[0];
  if (!usuario) {
    return res.status(401).json({ error: "Usuario, contraseña o rol incorrectos" });
  }
  if (role && usuario.role !== role) {
    return res.status(401).json({ error: "Usuario, contraseña o rol incorrectos" });
  }

  const ok = await bcrypt.compare(password, usuario.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "Usuario, contraseña o rol incorrectos" });
  }

  const token = firmarToken(usuario);
  res.json({
    token,
    session: {
      username: usuario.username,
      displayName: usuario.display_name,
      role: usuario.role,
      roleLabel: usuario.role_label,
    },
  });
}));

router.get("/me", requireAuth, (req, res) => {
  res.json({
    session: {
      username: req.user.username,
      displayName: req.user.displayName,
      role: req.user.role,
      roleLabel: req.user.roleLabel,
    },
  });
});

export default router;
