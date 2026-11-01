# Biergärten Haus — Frontend (React + TypeScript)

Cliente del sistema, construido con **React 18 + TypeScript + Vite + Tailwind**.
Consume la API del backend (`../backend`) en vez de guardar datos en el navegador.

> Instrucciones completas de instalación (backend + base de datos + frontend)
> están en el `README.md` de la raíz del proyecto.

## Cómo correrlo

```bash
cp .env.example .env      # VITE_API_URL, ya apunta a http://localhost:4000/api
npm install
npm run dev
```

El backend (`../backend`) y PostgreSQL deben estar corriendo primero
(ver `docker compose up -d` en la raíz).

Usuarios de prueba (login real contra la base de datos):
- Dueño → usuario `admin`, contraseña `dueno123`
- Mesero → usuario `carlos` / `luis` / `ana`, contraseña `mesero123`

## Estructura del proyecto

```
src/
  types.ts                 → todos los tipos del dominio (Pedido, Mesa, Producto, etc.)
  lib/
    api.ts                  → cliente HTTP hacia el backend (agrega el token JWT)
    session.ts               → sesión de usuario + login real contra POST /api/auth/login
    icons.tsx                → set de íconos SVG como componente <Icon name="..."/>
    format.ts                → helper de formato de moneda (Bs.)
  store/
    seed.ts                 → catálogo/base usados solo como referencia de tipos
    StoreContext.tsx         → "cerebro" de la app: carga todo desde la API al montar
                               y expone acciones (crearPedido, cobrarMesa, etc.) que
                               llaman al backend y actualizan el estado local con la
                               respuesta del servidor.
  components/
    layout/Sidebar.tsx       → barra lateral (con drawer en celular)
    layout/TopBar.tsx        → barra superior con notificaciones y botón de menú móvil
    layout/AppShell.tsx      → arma sidebar + topbar + contenido para ambos paneles
    ui/                      → StatCard, Badge, Modal (reutilizables)
  pages/
    LoginPage.tsx            → pantalla de acceso (login real, JWT)
    dueno/
      DuenoPanel.tsx          → arma la navegación y cambia de vista
      views/                  → una vista por archivo: Resumen, Mesas, Caja,
                                Productos, Personal, Pedidos, Facturacion, Reportes
    mesero/
      MeseroPanel.tsx
      views/                  → MisMesas, MisPedidos, Perfil
      components/             → MenuGrid.tsx y CartPanel.tsx (menú y carrito del pedido)
```

## Notas técnicas

- Todo el estado (mesas, pedidos, ventas, productos, notificaciones) vive ahora en
  **PostgreSQL**, servido por la API en `../backend`. `StoreContext.tsx` hace el
  `fetch` inicial y expone las mismas acciones que antes, pero cada una llama a un
  endpoint real.
- La sesión guarda el **token JWT** que devuelve el login y lo manda en cada
  petición (`Authorization: Bearer <token>`), en vez de simular un usuario local.
- La "simulación de cocina" (pendiente → preparando → listo en segundo plano) se
  mantiene igual que antes, pero ahora persiste cada cambio de estado en la API
  (`PATCH /api/pedidos/:id/estado`) en vez de solo en memoria.
- Paleta de colores **vino tinto / cobre** en `tailwind.config.js` y `src/index.css`.
- El dashboard "Rock & Wings" fue eliminado por completo del sistema.
