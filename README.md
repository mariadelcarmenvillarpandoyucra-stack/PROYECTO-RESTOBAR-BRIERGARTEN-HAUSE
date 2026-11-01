# Biergärten Haus — Sistema (frontend + backend + base de datos)

Rediseño del sistema original: paleta **vino tinto / cobre**, sin el dashboard
"Rock & Wings", y con **frontend y backend completamente separados**, con
**PostgreSQL** administrable desde **pgAdmin** y **login real** (JWT + contraseñas
hasheadas con bcrypt).

## Estructura del proyecto

```
biergarten-haus/
├── frontend/          # React + Vite + Tailwind (consume la API)
├── backend/            # Node.js + Express + PostgreSQL (API REST + JWT)
├── database/            # Esquema SQL, datos semilla y config de pgAdmin
└── docker-compose.yml     # Levanta PostgreSQL + pgAdmin + backend
```

## 1. Levantar PostgreSQL + pgAdmin + backend (Docker)

Requiere [Docker](https://www.docker.com/) instalado.

```bash
docker compose up -d
```

Esto levanta:

- **PostgreSQL** en `localhost:5432` (usuario `biergarten_user`, contraseña
  `biergarten_pass`, base `biergarten`). El esquema (`database/01_schema.sql`)
  y los datos de ejemplo (`database/02_seed.sql`) se cargan automáticamente
  la primera vez.
- **pgAdmin** en [http://localhost:5050](http://localhost:5050)
  (usuario `admin@biergarten.local`, contraseña `admin123`). El servidor
  "Biergärten Haus - PostgreSQL" ya aparece pre-cargado en el panel
  izquierdo; solo hay que abrirlo y poner la contraseña `biergarten_pass`
  la primera vez que conectes.
- **Backend (API)** en [http://localhost:4000](http://localhost:4000).

Para apagar todo: `docker compose down` (o `docker compose down -v` para
borrar también los datos y volver a empezar desde cero).

### Sin Docker (alternativa)

1. Instala PostgreSQL 16 y crea la base:
   ```sql
   CREATE USER biergarten_user WITH PASSWORD 'biergarten_pass';
   CREATE DATABASE biergarten OWNER biergarten_user;
   ```
2. Carga el esquema y los datos:
   ```bash
   psql -U biergarten_user -d biergarten -f database/01_schema.sql
   psql -U biergarten_user -d biergarten -f database/02_seed.sql
   ```
3. Entra a `backend/`, copia `.env.example` a `.env` y ajusta si hace falta.
4. `npm install && npm run dev`

## 2. Levantar el frontend

```bash
cd frontend
cp .env.example .env      # ya apunta a http://localhost:4000/api
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Usuarios de prueba (login real contra la base de datos)

| Usuario  | Contraseña   | Rol    |
|----------|--------------|--------|
| `admin`  | `dueno123`   | Dueño  |
| `carlos` | `mesero123`  | Mesero |
| `luis`   | `mesero123`  | Mesero |
| `ana`    | `mesero123`  | Mesero |

Las contraseñas están hasheadas con bcrypt en la base (nunca en texto plano),
y el login devuelve un token **JWT** real que el frontend guarda y usa en cada
llamada a la API (`Authorization: Bearer <token>`).

## Qué cambió respecto al sistema original

- **Paleta de colores**: de dorado a **vino tinto y cobre** en todo el
  sistema (login, sidebar, tarjetas, botones, badges).
- **Se eliminó por completo** el dashboard "Rock & Wings" (marca hermana de
  pollos): vista, ruta, ítem de menú, productos y datos relacionados.
- **Backend real**: antes todo vivía en `localStorage` del navegador; ahora
  hay una API REST en Node/Express que valida permisos por rol (dueño vs.
  mesero) y persiste todo en PostgreSQL.
- **Base de datos real** administrable visualmente desde **pgAdmin**
  (tablas: usuarios, mesas, productos, pedidos, ventas, notificaciones,
  barriles, solicitudes de factura).

## Endpoints principales de la API

| Método | Ruta                          | Descripción                          | Rol requerido |
|--------|-------------------------------|---------------------------------------|----------------|
| POST   | `/api/auth/login`             | Login (usuario, contraseña, rol)      | —              |
| GET    | `/api/productos`               | Listar menú                           | autenticado    |
| POST   | `/api/productos`               | Crear producto                        | dueño          |
| PUT    | `/api/productos/:id`           | Editar producto                       | dueño          |
| DELETE | `/api/productos/:id`           | Eliminar producto                     | dueño          |
| GET    | `/api/mesas`                   | Estado de las mesas                   | autenticado    |
| GET    | `/api/pedidos`                 | Listar pedidos                        | autenticado    |
| POST   | `/api/pedidos`                 | Crear pedido                          | autenticado    |
| PATCH  | `/api/pedidos/:id/estado`      | Cambiar estado del pedido             | autenticado    |
| POST   | `/api/ventas/cobrar`           | Cobrar una mesa                       | autenticado    |
| GET    | `/api/notificaciones`          | Notificaciones de cocina              | autenticado    |
| GET    | `/api/facturas`                | Solicitudes de factura                | autenticado    |
| GET    | `/api/reportes/resumen`        | Estadísticas del día                  | autenticado    |

## Notas

- El backend valida el rol de cada usuario en cada endpoint sensible (por
  ejemplo, solo el dueño puede crear/editar/eliminar productos).
- Cambia `JWT_SECRET` en producción (`backend/.env` o la variable de entorno
  del contenedor) por una clave larga y aleatoria.
