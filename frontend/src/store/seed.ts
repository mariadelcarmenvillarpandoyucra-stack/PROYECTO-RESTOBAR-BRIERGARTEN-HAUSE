import type { Barril, DB, Producto } from "../types";

/* ==========================================================================
   Menú semilla — migrado 1:1 de store.js (MENU_SEED)
   ========================================================================== */
export const MENU_SEED: Producto[] = [
  { id: "p1", nombre: "Hamburguesa Haus", categoria: "Comidas", precio: 45, icon: "burger", imagen: null, descripcion: "Carne de res, queso cheddar, tocino y salsa de la casa en pan brioche." },
  { id: "p2", nombre: "Pizza Biergärten", categoria: "Comidas", precio: 55, icon: "pizza", imagen: null, descripcion: "Masa artesanal, mozzarella, salame y albahaca fresca." },
  { id: "p3", nombre: "Alitas BBQ", categoria: "Comidas", precio: 35, icon: "wings", imagen: null, descripcion: "8 alitas bañadas en salsa BBQ ahumada, acompañadas de aderezo ranch." },
  { id: "p4", nombre: "Plato de la Casa", categoria: "Comidas", precio: 60, icon: "plate", imagen: null, descripcion: "Selección de carnes a la parrilla con guarniciones de la casa." },
  { id: "p5", nombre: "Papas Especiales", categoria: "Comidas", precio: 20, icon: "papas", imagen: null, descripcion: "Papas fritas con queso cheddar, tocino y cebollín." },
  { id: "p6", nombre: "Cóctel Tropical", categoria: "Cócteles", precio: 32, icon: "coctel", imagen: null, descripcion: "Ron, jugo de maracuyá, piña y un toque de menta." },
  { id: "p7", nombre: "Mojito Biergärten", categoria: "Cócteles", precio: 30, icon: "coctel", imagen: null, descripcion: "Ron blanco, hierbabuena, limón y soda bien fría." },
  { id: "p8", nombre: "Cerveza Artesanal IPA 500ml", categoria: "Cerveza artesanal", precio: 25, icon: "cerveza", imagen: null, descripcion: "IPA de la casa, amarga y aromática, notas cítricas." },
  { id: "p9", nombre: "Cerveza Rubia 500ml", categoria: "Cerveza artesanal", precio: 22, icon: "cerveza", imagen: null, descripcion: "Lager rubia suave, ligera y refrescante." },
  { id: "p10", nombre: "Cerveza Negra 500ml", categoria: "Cerveza artesanal", precio: 24, icon: "cerveza", imagen: null, descripcion: "Stout tostada con notas a café y chocolate." },
  { id: "p11", nombre: "Refresco", categoria: "Refrescos", precio: 10, icon: "soda", imagen: null, descripcion: "Línea de gaseosas heladas, sabor a elección." },
  { id: "p12", nombre: "Limonada de la Casa", categoria: "Refrescos", precio: 12, icon: "soda", imagen: null, descripcion: "Limonada natural con un toque de hierbabuena." },
];

export const CATEGORIA_ICONS: Record<string, string> = {
  Todos: "productos",
  Comidas: "plate",
  "Cócteles": "coctel",
  "Cerveza artesanal": "cerveza",
  Refrescos: "soda",
};

export const BARRILES: Barril[] = [
  { id: "b1", nombre: "Cerveza Rubia", nivel: 72, capacidad: "50L" },
  { id: "b2", nombre: "Cerveza Negra", nivel: 34, capacidad: "50L" },
  { id: "b3", nombre: "Cerveza Roja / Amber", nivel: 12, capacidad: "30L" },
  { id: "b4", nombre: "Cerveza Artesanal IPA", nivel: 58, capacidad: "30L" },
];

export function formatHora(d: Date): string {
  return d.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
}

export function minutosDesde(ts: number): number {
  return Math.max(0, Math.round((Date.now() - ts) / 60000));
}

/** Base de datos de demostración — misma semilla que el prototipo original. */
export function seedDB(): DB {
  const now = Date.now();
  const haceMin = (m: number) => now - m * 60000;

  return {
    mesas: [
      { num: 1, estado: "libre", horaApertura: null },
      { num: 2, estado: "ocupada", horaApertura: haceMin(9) },
      { num: 3, estado: "ocupada", horaApertura: haceMin(22) },
      { num: 4, estado: "libre", horaApertura: null },
      { num: 5, estado: "cuenta", horaApertura: haceMin(38) },
      { num: 6, estado: "libre", horaApertura: null },
      { num: 7, estado: "libre", horaApertura: null },
      { num: 8, estado: "ocupada", horaApertura: haceMin(4) },
    ],
    pedidos: [
      { id: 101, mesa: 3, mesero: "Carlos", estado: "preparando", items: [{ nombre: "Hamburguesa Haus", cant: 2, precio: 45 }, { nombre: "Pizza Biergärten", cant: 1, precio: 55 }], hora: formatHora(new Date(haceMin(20))), ts: haceMin(20), total: 145 },
      { id: 102, mesa: 5, mesero: "Carlos", estado: "entregado", items: [{ nombre: "Plato de la Casa", cant: 1, precio: 60 }, { nombre: "Refresco", cant: 2, precio: 10 }], hora: formatHora(new Date(haceMin(35))), ts: haceMin(35), total: 80 },
      { id: 103, mesa: 2, mesero: "Carlos", estado: "pendiente", items: [{ nombre: "Alitas BBQ", cant: 2, precio: 35 }, { nombre: "Cerveza Artesanal IPA 500ml", cant: 3, precio: 25 }], hora: formatHora(new Date(haceMin(6))), ts: haceMin(6), total: 145 },
      { id: 104, mesa: 8, mesero: "Carlos", estado: "listo", items: [{ nombre: "Papas Especiales", cant: 2, precio: 20 }, { nombre: "Cóctel Tropical", cant: 2, precio: 32 }], hora: formatHora(new Date(haceMin(3))), ts: haceMin(3), total: 104 },
    ],
    ventas: [
      { id: 1, mesa: 4, mesero: "Carlos", items: [{ nombre: "Hamburguesa Haus", cant: 1 }, { nombre: "Cerveza Rubia 500ml", cant: 2 }], subtotal: 89, propina: 10, metodoPago: "efectivo", calificacion: 5, hora: formatHora(new Date(haceMin(240))), ts: haceMin(240) },
      { id: 2, mesa: 6, mesero: "Ana", items: [{ nombre: "Pizza Biergärten", cant: 1 }, { nombre: "Refresco", cant: 2 }], subtotal: 75, propina: 8, metodoPago: "qr", calificacion: 5, hora: formatHora(new Date(haceMin(210))), ts: haceMin(210) },
      { id: 3, mesa: 1, mesero: "Luis", items: [{ nombre: "Alitas BBQ", cant: 2 }, { nombre: "Cerveza Artesanal IPA 500ml", cant: 2 }], subtotal: 120, propina: 12, metodoPago: "qr", calificacion: 4, hora: formatHora(new Date(haceMin(190))), ts: haceMin(190) },
      { id: 4, mesa: 7, mesero: "Ana", items: [{ nombre: "Plato de la Casa", cant: 2 }], subtotal: 120, propina: 15, metodoPago: "efectivo", calificacion: 5, hora: formatHora(new Date(haceMin(160))), ts: haceMin(160) },
      { id: 5, mesa: 3, mesero: "Carlos", items: [{ nombre: "Cóctel Tropical", cant: 3 }, { nombre: "Papas Especiales", cant: 1 }], subtotal: 116, propina: 10, metodoPago: "qr", calificacion: 5, hora: formatHora(new Date(haceMin(140))), ts: haceMin(140) },
      { id: 6, mesa: 2, mesero: "Luis", items: [{ nombre: "Hamburguesa Haus", cant: 2 }, { nombre: "Refresco", cant: 2 }], subtotal: 110, propina: 0, metodoPago: "efectivo", calificacion: 3, hora: formatHora(new Date(haceMin(120))), ts: haceMin(120) },
      { id: 7, mesa: 8, mesero: "Ana", items: [{ nombre: "Pizza Biergärten", cant: 2 }], subtotal: 110, propina: 12, metodoPago: "qr", calificacion: 5, hora: formatHora(new Date(haceMin(95))), ts: haceMin(95) },
      { id: 8, mesa: 5, mesero: "Carlos", items: [{ nombre: "Mojito Biergärten", cant: 2 }, { nombre: "Papas Especiales", cant: 2 }], subtotal: 100, propina: 10, metodoPago: "efectivo", calificacion: 4, hora: formatHora(new Date(haceMin(70))), ts: haceMin(70) },
    ],
    productos: MENU_SEED.map((p) => ({ ...p })),
    nextProductoId: 13,
    notificaciones: [
      { id: 1, mesero: "Carlos", mesa: 8, pedidoId: 104, mensaje: "Pedido #104 listo para servir — Mesa 8", hora: formatHora(new Date(haceMin(3))), leida: false },
    ],
    nextPedidoId: 105,
    nextVentaId: 9,
    nextNotifId: 2,
    ventasSemana: [820, 1010, 940, 1180, 1400, 1850, 1620],
    meseros: [
      { id: "u1", nombre: "Carlos" },
      { id: "u2", nombre: "Luis" },
      { id: "u3", nombre: "Ana" },
    ],
    barriles: BARRILES,
    solicitudesFactura: [],
    nextFacturaId: 1,
  };
}
