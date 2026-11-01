import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { SessionLib } from "../lib/session";
import type { Role } from "../types";

/** Protege una ruta según el rol de sesión — reemplaza a Session.requireRole(). */
export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const session = SessionLib.get();
  if (!session || session.role !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
