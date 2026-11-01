import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import type { NavItem } from "../../components/layout/Sidebar";
import { SessionLib } from "../../lib/session";
import { useStore } from "../../store/StoreContext";
import { ResumenView } from "./views/ResumenView";
import { MesasView } from "./views/MesasView";
import { CajaView } from "./views/CajaView";
import { ProductosView } from "./views/ProductosView";
import { PersonalView } from "./views/PersonalView";
import { PedidosView } from "./views/PedidosView";
import { FacturacionView } from "./views/FacturacionView";
import { ReportesView } from "./views/ReportesView";

/* ==========================================================================
   Panel del Dueño — migrado de pages/dueno.html + js/dueno/dueno.js.
   El nombre de la vista principal ya no es "Dashboard": ahora es
   "Restobar Biergärten Haus" (a pedido del cliente). Cada vista vive en
   su propio componente dentro de ./views para mantener archivos cortos.
   ========================================================================== */

const NAV_ITEMS: NavItem[] = [
  { view: "resumen", label: "Restobar Biergärten Haus", icon: "dashboard" },
  { view: "mesas", label: "Mesas", icon: "mesas" },
  { view: "caja", label: "Caja", icon: "caja" },
  { view: "productos", label: "Productos & Stock", icon: "productos" },
  { view: "personal", label: "Personal", icon: "usuarios" },
  { view: "pedidos", label: "Pedidos", icon: "pedidos" },
  { view: "facturacion", label: "Facturación", icon: "send" },
  { view: "reportes", label: "Reportes", icon: "reportes" },
];

const TITLES: Record<string, { title: string; sub: string }> = {
  resumen: { title: "Restobar Biergärten Haus", sub: "Vista general del funcionamiento del restobar" },
  mesas: { title: "Mesas", sub: "Estado en tiempo real del salón" },
  caja: { title: "Caja", sub: "Efectivo, QR y propinas del día" },
  productos: { title: "Productos & Stock", sub: "Menú y barriles de cerveza" },
  personal: { title: "Personal", sub: "Desempeño de cada mesero" },
  pedidos: { title: "Pedidos", sub: "Todos los pedidos en curso" },
  facturacion: { title: "Facturación", sub: "Solicitudes de factura de los meseros" },
  reportes: { title: "Reportes", sub: "Métodos de pago y producto más vendido" },
};

export default function DuenoPanel() {
  const navigate = useNavigate();
  const store = useStore();
  const [view, setView] = useState("resumen");
  const session = SessionLib.get()!;

  const navItemsConBadge = NAV_ITEMS.map((item) =>
    item.view === "facturacion"
      ? { ...item, badge: store.db.solicitudesFactura.filter((f) => !f.atendida).length }
      : item
  );

  function handleLogout() {
    SessionLib.clear();
    navigate("/");
  }

  const { title, sub } = TITLES[view];

  return (
    <AppShell
      navItems={navItemsConBadge}
      activeView={view}
      onNavigate={setView}
      session={session}
      onLogout={handleLogout}
      title={title}
      subtitle={sub}
      notificaciones={store.db.notificaciones}
      onMarcarLeida={store.marcarNotificacionLeida}
    >
      {view === "resumen" && <ResumenView />}
      {view === "mesas" && <MesasView />}
      {view === "caja" && <CajaView />}
      {view === "productos" && <ProductosView />}
      {view === "personal" && <PersonalView />}
      {view === "pedidos" && <PedidosView />}
      {view === "facturacion" && <FacturacionView />}
      {view === "reportes" && <ReportesView />}
    </AppShell>
  );
}
