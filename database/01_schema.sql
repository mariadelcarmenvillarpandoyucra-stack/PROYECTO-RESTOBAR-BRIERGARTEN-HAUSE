-- ============================================================================
-- Biergärten Haus — Esquema de base de datos (PostgreSQL)
-- Diseñado para administrarse desde pgAdmin.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- USUARIOS (dueño y meseros) — login real con contraseña hasheada
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('dueno', 'mesero')),
    display_name  VARCHAR(100) NOT NULL,
    role_label    VARCHAR(40) NOT NULL,
    activo        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- MESAS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mesas (
    num            INTEGER PRIMARY KEY,
    estado         VARCHAR(20) NOT NULL DEFAULT 'libre'
                   CHECK (estado IN ('libre', 'ocupada', 'cuenta')),
    hora_apertura  TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- PRODUCTOS (menú)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id           VARCHAR(20) PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    categoria    VARCHAR(80) NOT NULL,
    precio       NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    icon         VARCHAR(40) NOT NULL DEFAULT 'plate',
    imagen       TEXT,
    descripcion  TEXT,
    creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- BARRILES (control de stock de cerveza)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS barriles (
    id         VARCHAR(20) PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    nivel      INTEGER NOT NULL CHECK (nivel BETWEEN 0 AND 100),
    capacidad  VARCHAR(20) NOT NULL
);

-- ---------------------------------------------------------------------------
-- PEDIDOS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos (
    id          SERIAL PRIMARY KEY,
    mesa        INTEGER NOT NULL REFERENCES mesas(num),
    mesero_id   INTEGER REFERENCES usuarios(id),
    mesero      VARCHAR(100) NOT NULL,
    estado      VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'preparando', 'listo', 'entregado')),
    total       NUMERIC(10,2) NOT NULL DEFAULT 0,
    hora        VARCHAR(20) NOT NULL,
    hora_listo  VARCHAR(20),
    ts          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedido_items (
    id         SERIAL PRIMARY KEY,
    pedido_id  INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    nombre     VARCHAR(150) NOT NULL,
    cant       INTEGER NOT NULL CHECK (cant > 0),
    precio     NUMERIC(10,2) NOT NULL
);

-- ---------------------------------------------------------------------------
-- VENTAS (mesas cobradas)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventas (
    id            SERIAL PRIMARY KEY,
    mesa          INTEGER NOT NULL,
    mesero_id     INTEGER REFERENCES usuarios(id),
    mesero        VARCHAR(100) NOT NULL,
    subtotal      NUMERIC(10,2) NOT NULL DEFAULT 0,
    propina       NUMERIC(10,2) NOT NULL DEFAULT 0,
    metodo_pago   VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo', 'qr')),
    calificacion  SMALLINT NOT NULL DEFAULT 0 CHECK (calificacion BETWEEN 0 AND 5),
    hora          VARCHAR(20) NOT NULL,
    ts            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS venta_items (
    id        SERIAL PRIMARY KEY,
    venta_id  INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    nombre    VARCHAR(150) NOT NULL,
    cant      INTEGER NOT NULL CHECK (cant > 0)
);

-- ---------------------------------------------------------------------------
-- NOTIFICACIONES (cocina -> mesero)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones (
    id         SERIAL PRIMARY KEY,
    mesero     VARCHAR(100) NOT NULL,
    mesa       INTEGER NOT NULL,
    pedido_id  INTEGER REFERENCES pedidos(id) ON DELETE SET NULL,
    mensaje    TEXT NOT NULL,
    hora       VARCHAR(20) NOT NULL,
    leida      BOOLEAN NOT NULL DEFAULT FALSE,
    ts         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- SOLICITUDES DE FACTURA
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_factura (
    id              SERIAL PRIMARY KEY,
    mesa            INTEGER NOT NULL,
    mesero          VARCHAR(100) NOT NULL,
    nombre_cliente  VARCHAR(150) NOT NULL,
    nit             VARCHAR(30),
    notas           TEXT,
    atendida        BOOLEAN NOT NULL DEFAULT FALSE,
    hora            VARCHAR(20) NOT NULL,
    ts              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Índices útiles
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa ON pedidos(mesa);
CREATE INDEX IF NOT EXISTS idx_ventas_ts ON ventas(ts);
CREATE INDEX IF NOT EXISTS idx_notificaciones_mesero ON notificaciones(mesero);
