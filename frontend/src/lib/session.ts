import type { Role, Session } from "../types";
import { api } from "./api";

/* ==========================================================================
   Manejo de sesión — ahora respaldado por login real contra el backend.
   Guarda el token JWT devuelto por POST /api/auth/login junto con los
   datos de la sesión, en localStorage o sessionStorage según "recordar".
   ========================================================================== */
const SESSION_KEY = "biergarten_session";

export const SessionLib = {
  save(data: Session, remember: boolean) {
    const payload = JSON.stringify(data);
    if (remember) {
      localStorage.setItem(SESSION_KEY, payload);
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, payload);
      localStorage.removeItem(SESSION_KEY);
    }
  },

  get(): Session | null {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  },

  clear() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  hasRole(role: Role): boolean {
    const s = this.get();
    return !!s && s.role === role;
  },
};

export interface LoginResult {
  session: Session;
}

/** Llama al backend real (POST /api/auth/login) y arma la sesión con su token JWT. */
export async function loginRequest(username: string, password: string, role: Role): Promise<Session> {
  const res = await api.post<{ token: string; session: Omit<Session, "ts" | "token"> }>("/auth/login", {
    username,
    password,
    role,
  });
  return { ...res.session, token: res.token, ts: Date.now() };
}
