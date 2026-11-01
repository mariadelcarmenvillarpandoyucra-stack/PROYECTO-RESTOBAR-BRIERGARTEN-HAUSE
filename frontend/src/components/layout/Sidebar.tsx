import { Icon, type IconName } from "../../lib/icons";
import type { Session } from "../../types";

export interface NavItem {
  view: string;
  label: string;
  icon: IconName;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  active: string;
  onNavigate: (view: string) => void;
  session: Session;
  onLogout: () => void;
  /** Controla el cajón (drawer) en pantallas de celular. */
  open: boolean;
  onClose: () => void;
}

/* ==========================================================================
   Sidebar — antes se ocultaba por completo en celular (`hidden md:flex`)
   y se reemplazaba por una barra inferior de solo íconos. Ahora es un
   cajón (drawer) desplegable: en escritorio queda fijo a la izquierda,
   y en celular se despliega sobre el contenido con un botón de menú en
   la barra superior (ver TopBar) y se cierra tocando fuera o en la X.
   ========================================================================== */
export function Sidebar({ items, active, onNavigate, session, onLogout, open, onClose }: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full py-5 px-3">
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="w-9 h-9" alt="Biergärten Haus" />
          <div>
            <p className="font-display text-sm text-cream leading-none">BIERGÄRTEN</p>
            <p className="text-[10px] tracking-[0.2em] text-gold-dim mt-1">SISTEMA DE GESTIÓN</p>
          </div>
        </div>
        <button className="md:hidden text-cream-dim hover:text-cream p-1" onClick={onClose} aria-label="Cerrar menú">
          <Icon name="close" className="w-5 h-5" />
        </button>
      </div>

      <div className="px-2 mb-5">
        <div className="card px-3 py-2.5">
          <p className="text-[10px] text-cream-dim uppercase tracking-wide">Usuario conectado</p>
          <p className="text-sm font-semibold text-cream">{session.displayName}</p>
          <p className="text-[11px] text-gold">{session.roleLabel}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.view}
            className={`side-link ${active === item.view ? "active" : ""}`}
            onClick={() => { onNavigate(item.view); onClose(); }}
          >
            <Icon name={item.icon} />
            <span className="flex-1">{item.label}</span>
            {!!item.badge && (
              <span className="text-[10px] font-bold bg-danger text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-2 pt-3 border-t border-line flex flex-col gap-1">
        <button className="side-link" onClick={onLogout}>
          <Icon name="logout" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Escritorio: columna fija */}
      <aside className="sidebar w-64 flex-shrink-0 hidden md:flex flex-col">{content}</aside>

      {/* Celular: cajón desplegable + fondo oscurecido */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`sidebar w-72 max-w-[82vw] flex flex-col fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!open}
      >
        {content}
      </aside>
    </>
  );
}
