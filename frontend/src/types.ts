/* ==========================================================================
   Tipos centrales del dominio — antes vivían implícitos en store.js,
   ahora quedan explícitos gracias a TypeScript.
   ========================================================================== */

export type Role = "dueno" | "mesero";

export interface Session {
  username: string;
  displayName: string;
  role: Role;
  roleLabel: string;
  ts: number;
  /** Token JWT emitido por el backend, usado en cada llamada a la API. */
  token: string;
}

export type EstadoMesa = "libre" | "ocupada" | "cuenta";

export interface Mesa {
  num: number;
  estado: EstadoMesa;
  horaApertura: number | null;
}

export type EstadoPedido = "pendiente" | "preparando" | "listo" | "entregado";

export interface ItemPedido {
  nombre: string;
  cant: number;
  precio: number;
}

export interface Pedido {
  id: number;
  mesa: number;
  mesero: string;
  estado: EstadoPedido;
  items: ItemPedido[];
  hora: string;
  ts: number;
  total: number;
  horaListo?: string;
}

export type MetodoPago = "efectivo" | "qr";

export interface Venta {
  id: number;
  mesa: number;
  mesero: string;
  items: { nombre: string; cant: number }[];
  subtotal: number;
  propina: number;
  metodoPago: MetodoPago;
  calificacion: number;
  hora: string;
  ts: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  icon: string;
  imagen: string | null;
  descripcion: string;
}

export interface Notificacion {
  id: number;
  mesero: string;
  mesa: number;
  pedidoId: number;
  mensaje: string;
  hora: string;
  leida: boolean;
}

export interface Barril {
  id: string;
  nombre: string;
  nivel: number;
  capacidad: string;
}

export interface Mesero {
  id: string;
  nombre: string;
}

export interface SolicitudFactura {
  id: number;
  mesa: number;
  mesero: string;
  nombreCliente: string;
  nit: string;
  notas: string;
  hora: string;
  ts: number;
  atendida: boolean;
}

export interface DB {
  mesas: Mesa[];
  pedidos: Pedido[];
  ventas: Venta[];
  productos: Producto[];
  nextProductoId: number;
  notificaciones: Notificacion[];
  nextPedidoId: number;
  nextVentaId: number;
  nextNotifId: number;
  ventasSemana: number[];
  meseros: Mesero[];
  barriles: Barril[];
  solicitudesFactura: SolicitudFactura[];
  nextFacturaId: number;
}
