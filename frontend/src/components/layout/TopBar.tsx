import { useState } from "react";
import { Icon } from "../../lib/icons";
import type { Notificacion, Session } from "../../types";

interface TopBarProps {
  title: string;
  subtitle: string;
  session: Session;
  notificaciones: Notificacion[];
  onMarcarLeida: (id: number) => void;
  onOpenSidebar: () => void;
}

/* Barra superior: botón de menú (solo celular) + título de vista +
   campana de notificaciones + chip de usuario. */
export function TopBar({ title, subtitle, session, notificaciones, onMarcarLeida, onOpenSidebar }: TopBarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const pendientes = notificaciones.filter((n) => !n.leida);
  const initial = (session.displayName || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden btn-outline p-2 rounded-sm"
          onClick={onOpenSidebar}
          aria-label="Abrir menú"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl md:text-2xl text-cream">{title}</h1>
          <p className="text-sm text-cream-dim">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            className="btn-outline text-xs flex items-center gap-2 relative rounded-sm p-2"
            onClick={() => setShowNotifs((s) => !s)}
            aria-label="Notificaciones"
          >
            <Icon name="campana" className="w-5 h-5" />
            {pendientes.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[10px] font-bold bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center">
                {pendientes.length}
              </span>
            )}
          </button>
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowNotifs(false)} />
              <div className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 card p-2 z-30 max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between px-1.5 pt-0.5 pb-2 sm:hidden">
                  <span className="text-xs font-semibold text-cream">Notificaciones</span>
                  <button onClick={() => setShowNotifs(false)} className="text-cream-dim text-lg leading-none px-1" aria-label="Cerrar">×</button>
                </div>
                {notificaciones.length === 0 && (
                  <p className="text-xs text-cream-dim p-3 text-center">Sin notificaciones</p>
                )}
                {notificaciones.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onMarcarLeida(n.id)}
                    className={`w-full text-left p-2.5 rounded-sm mb-1 text-xs ${n.leida ? "text-cream-dim" : "text-cream bg-bg-card-hi"}`}
                  >
                    {n.mensaje}
                    <div className="text-[10px] text-muted mt-1">{n.hora}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 card px-3 py-1.5">
          <div className="w-7 h-7 rounded-full bg-gold-dim flex items-center justify-center text-xs font-bold text-black">
            {initial}
          </div>
          <span className="text-sm text-cream">{session.displayName}</span>
        </div>
      </div>
    </div>
  );
}