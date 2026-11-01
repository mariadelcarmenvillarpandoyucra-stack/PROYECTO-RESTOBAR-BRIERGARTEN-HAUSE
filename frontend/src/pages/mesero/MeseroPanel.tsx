import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import type { NavItem } from "../../components/layout/Sidebar";
import { SessionLib } from "../../lib/session";
import { useStore } from "../../store/StoreContext";
import { MisMesasView } from "./views/MisMesasView";
import { MisPedidosView } from "./views/MisPedidosView";
import { PerfilView } from "./views/PerfilView";

/* ==========================================================================
   Panel del Mesero — migrado de pages/mesero.html + js/mesero/mesero.js.
   ========================================================================== */

const NAV_ITEMS: NavItem[] = [
  { view: "mesas", label: "Mis Mesas", icon: "mesas" },
  { view: "pedidos", label: "Mis Pedidos", icon: "pedidos" },
  { view: "perfil", label: "Mi Perfil", icon: "usuarios" },
];

const TITLES: Record<string, { title: string; sub: string }> = {
  mesas: { title: "Mis Mesas", sub: "Arma pedidos y solicita facturas" },
  pedidos: { title: "Mis Pedidos", sub: "Seguimiento de tus pedidos enviados" },
  perfil: { title: "Mi Perfil", sub: "Tu desempeño del día" },
};

export default function MeseroPanel() {
  const navigate = useNavigate();
  const store = useStore();
  const [view, setView] = useState("mesas");
  const session = SessionLib.get()!;

  const misNotificaciones = store.db.notificaciones.filter((n) => n.mesero === session.displayName);

  function handleLogout() {
    SessionLib.clear();
    navigate("/");
  }

  const { title, sub } = TITLES[view];

  return (
    <AppShell
      navItems={NAV_ITEMS}
      activeView={view}
      onNavigate={setView}
      session={session}
      onLogout={handleLogout}
      title={title}
      subtitle={sub}
      notificaciones={misNotificaciones}
      onMarcarLeida={store.marcarNotificacionLeida}
    >
      {view === "mesas" && <MisMesasView meseroNombre={session.displayName} />}
      {view === "pedidos" && <MisPedidosView meseroNombre={session.displayName} />}
      {view === "perfil" && <PerfilView meseroNombre={session.displayName} />}
    </AppShell>
  );
}
