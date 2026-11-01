import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar, type NavItem } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { Notificacion, Session } from "../../types";

interface AppShellProps {
  navItems: NavItem[];
  activeView: string;
  onNavigate: (view: string) => void;
  session: Session;
  onLogout: () => void;
  title: string;
  subtitle: string;
  notificaciones: Notificacion[];
  onMarcarLeida: (id: number) => void;
  children: ReactNode;
}

/** Layout compartido por los paneles de Dueño y Mesero: sidebar + topbar + contenido. */
export function AppShell({
  navItems, activeView, onNavigate, session, onLogout, title, subtitle, notificaciones, onMarcarLeida, children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-tavern">
      <Sidebar
        items={navItems}
        active={activeView}
        onNavigate={onNavigate}
        session={session}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 p-4 sm:p-5 md:p-8 overflow-y-auto min-w-0">
        <TopBar
          title={title}
          subtitle={subtitle}
          session={session}
          notificaciones={notificaciones}
          onMarcarLeida={onMarcarLeida}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <div className="view-enter">{children}</div>
      </main>
    </div>
  );
}
