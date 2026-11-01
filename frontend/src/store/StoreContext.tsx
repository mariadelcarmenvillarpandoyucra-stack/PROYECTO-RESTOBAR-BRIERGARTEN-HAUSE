import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type {
  Barril, DB, EstadoPedido, ItemPedido, Mesa, MetodoPago, Mesero, Notificacion, Pedido, Producto,
  SolicitudFactura, Venta,
} from "../types";
import { api } from "../lib/api";

/* ==========================================================================
   Contexto de la tienda — ahora respaldado por la API del backend
   (Express + PostgreSQL) en vez de localStorage. Toda mutación llama al
   endpoint correspondiente y luego actualiza el estado local de React
   con la respuesta del servidor, que es la fuente de verdad.
   ========================================================================== */

const EMPTY_DB: DB = {
  mesas: [],
  pedidos: [],
  ventas: [],
  productos: [],
  nextProductoId: 0,
  notificaciones: [],
  nextPedidoId: 0,
  nextVentaId: 0,
  nextNotifId: 0,
  ventasSemana: [0, 0, 0, 0, 0, 0, 0],
  meseros: [],
  barriles: [],
  solicitudesFactura: [],
  nextFacturaId: 0,
};

/* ---------------- Estadísticas derivadas (igual que antes) ---------------- */
export function computeStats(db: DB) {
  const ventas = db.ventas || [];
  const ventasHoy = ventas.reduce((sum, v) => sum + v.subtotal, 0);
  const propinasHoy = ventas.reduce((sum, v) => sum + (v.propina || 0), 0);
  const cajaEfectivo = ventas.filter((v) => v.metodoPago === "efectivo").reduce((s, v) => s + v.subtotal + (v.propina || 0), 0);
  const cajaQR = ventas.filter((v) => v.metodoPago === "qr").reduce((s, v) => s + v.subtotal + (v.propina || 0), 0);
  const calificadas = ventas.filter((v) => v.calificacion > 0);
  const calificacionPromedio = calificadas.length ? calificadas.reduce((s, v) => s + v.calificacion, 0) / calificadas.length : 0;
  const numEfectivo = ventas.filter((v) => v.metodoPago === "efectivo").length;
  const numQR = ventas.filter((v) => v.metodoPago === "qr").length;
  const pctQR = ventas.length ? Math.round((numQR / ventas.length) * 100) : 0;

  const conteoProductos: Record<string, number> = {};
  ventas.forEach((v) => v.items.forEach((it) => { conteoProductos[it.nombre] = (conteoProductos[it.nombre] || 0) + it.cant; }));
  let productoTop = "—";
  let maxCant = 0;
  Object.entries(conteoProductos).forEach(([nombre, cant]) => { if (cant > maxCant) { maxCant = cant; productoTop = nombre; } });

  return { ventasHoy, propinasHoy, cajaEfectivo, cajaQR, calificacionPromedio, numVentas: ventas.length, numEfectivo, numQR, pctQR, productoTop };
}

export function statsPorMesero(db: DB, nombre: string) {
  const ventas = (db.ventas || []).filter((v) => v.mesero === nombre);
  const pedidosHoy = ventas.length;
  const propinasHoy = ventas.reduce((s, v) => s + (v.propina || 0), 0);
  const calificadas = ventas.filter((v) => v.calificacion > 0);
  const calificacion = calificadas.length ? calificadas.reduce((s, v) => s + v.calificacion, 0) / calificadas.length : 0;
  return { pedidosHoy, propinasHoy, calificacion };
}

interface StoreApi {
  db: DB;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  crearPedido: (mesa: number, mesero: string, items: ItemPedido[]) => Promise<void>;
  avanzarEstadoPedido: (id: number, estado: EstadoPedido) => Promise<void>;
  cobrarMesa: (mesa: number, pedidoIds: number[], propina: number, metodoPago: MetodoPago, calificacion: number) => Promise<void>;
  agregarProducto: (p: Omit<Producto, "id">) => Promise<void>;
  editarProducto: (id: string, p: Partial<Producto>) => Promise<void>;
  eliminarProducto: (id: string) => Promise<void>;
  marcarNotificacionLeida: (id: number) => Promise<void>;
  crearSolicitudFactura: (s: Omit<SolicitudFactura, "id" | "ts" | "hora" | "atendida">) => Promise<void>;
  atenderFactura: (id: number) => Promise<void>;
}

const StoreCtx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(EMPTY_DB);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cocinaProgramada = useRef<Set<number>>(new Set());

  const cargarTodo = useCallback(async () => {
    const [mesas, productos, pedidos, ventas, notificaciones, meseros, barriles, solicitudesFactura, ventasSemana] =
      await Promise.all([
        api.get<Mesa[]>("/mesas"),
        api.get<Producto[]>("/productos"),
        api.get<Pedido[]>("/pedidos"),
        api.get<Venta[]>("/ventas"),
        api.get<Notificacion[]>("/notificaciones"),
        api.get<Mesero[]>("/meseros"),
        api.get<Barril[]>("/barriles"),
        api.get<SolicitudFactura[]>("/facturas"),
        api.get<number[]>("/reportes/ventas-semana"),
      ]);
    setDb({
      mesas,
      productos,
      pedidos,
      ventas,
      notificaciones,
      meseros,
      barriles,
      solicitudesFactura,
      ventasSemana: ventasSemana.length ? ventasSemana : [0, 0, 0, 0, 0, 0, 0],
      nextProductoId: 0,
      nextPedidoId: 0,
      nextVentaId: 0,
      nextNotifId: 0,
      nextFacturaId: 0,
    });
  }, []);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      await cargarTodo();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo conectar con el servidor");
    }
  }, [cargarTodo]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refetch();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Simulación de cocina (igual que en la versión original) ----------------
     No hay panel de cocinero conectado: al cargar, avanza automáticamente los pedidos
     pendiente → preparando → listo con tiempos aleatorios, persistiendo cada paso en la API. */
  const programarCocina = useCallback((pedidoId: number, rapido: boolean) => {
    if (cocinaProgramada.current.has(pedidoId)) return;
    cocinaProgramada.current.add(pedidoId);

    const delayPrep = rapido ? 2500 + Math.random() * 2500 : 5000 + Math.random() * 4000;
    const delayListo = rapido ? 6000 + Math.random() * 5000 : 12000 + Math.random() * 9000;

    setTimeout(() => { avanzarEstadoPedidoInterno(pedidoId, "preparando"); }, delayPrep);
    setTimeout(() => { avanzarEstadoPedidoInterno(pedidoId, "listo"); }, delayPrep + delayListo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function avanzarEstadoPedidoInterno(id: number, estado: EstadoPedido) {
    try {
      const pedidoActualizado = await api.patch<Pedido>(`/pedidos/${id}/estado`, { estado });
      setDb((prev) => ({ ...prev, pedidos: prev.pedidos.map((p) => (p.id === id ? pedidoActualizado : p)) }));
      if (estado === "listo") {
        const notificaciones = await api.get<Notificacion[]>("/notificaciones");
        setDb((prev) => ({ ...prev, notificaciones }));
      }
    } catch {
      // El pedido puede ya no existir (mesa cobrada antes de que termine la simulación); se ignora.
    }
  }

  useEffect(() => {
    if (loading) return;
    db.pedidos.forEach((p) => {
      if (p.estado === "pendiente" || p.estado === "preparando") programarCocina(p.id, true);
    });
    // Solo cuando termina la carga inicial: retoma pedidos que quedaron en curso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const api_: StoreApi = useMemo(() => ({
    db,
    loading,
    error,
    refetch,

    async crearPedido(mesa, _mesero, items) {
      const pedido = await api.post<Pedido>("/pedidos", { mesa, items });
      setDb((prev) => ({
        ...prev,
        pedidos: [pedido, ...prev.pedidos],
        mesas: prev.mesas.map((m) => (m.num === mesa && m.estado === "libre" ? { ...m, estado: "ocupada", horaApertura: Date.now() } : m)),
      }));
    },

    async avanzarEstadoPedido(id, estado) {
      await avanzarEstadoPedidoInterno(id, estado);
    },

    async cobrarMesa(mesa, pedidoIds, propina, metodoPago, calificacion) {
      const venta = await api.post<Venta>("/ventas/cobrar", { mesa, pedidoIds, propina, metodoPago, calificacion });
      setDb((prev) => ({
        ...prev,
        ventas: [venta, ...prev.ventas],
        pedidos: prev.pedidos.filter((p) => !pedidoIds.includes(p.id)),
        mesas: prev.mesas.map((m) => (m.num === mesa ? { ...m, estado: "libre", horaApertura: null } : m)),
      }));
    },

    async agregarProducto(p) {
      const nuevo = await api.post<Producto>("/productos", p);
      setDb((prev) => ({ ...prev, productos: [...prev.productos, nuevo] }));
    },

    async editarProducto(id, p) {
      const actualizado = await api.put<Producto>(`/productos/${id}`, p);
      setDb((prev) => ({ ...prev, productos: prev.productos.map((x) => (x.id === id ? actualizado : x)) }));
    },

    async eliminarProducto(id) {
      await api.del(`/productos/${id}`);
      setDb((prev) => ({ ...prev, productos: prev.productos.filter((x) => x.id !== id) }));
    },

    async marcarNotificacionLeida(id) {
      const actualizada = await api.patch<Notificacion>(`/notificaciones/${id}/leida`);
      setDb((prev) => ({ ...prev, notificaciones: prev.notificaciones.map((n) => (n.id === id ? actualizada : n)) }));
    },

    async crearSolicitudFactura(s) {
      const nueva = await api.post<SolicitudFactura>("/facturas", s);
      setDb((prev) => ({ ...prev, solicitudesFactura: [nueva, ...prev.solicitudesFactura] }));
    },

    async atenderFactura(id) {
      const actualizada = await api.patch<SolicitudFactura>(`/facturas/${id}/atender`);
      setDb((prev) => ({ ...prev, solicitudesFactura: prev.solicitudesFactura.map((f) => (f.id === id ? actualizada : f)) }));
    },
  }), [db, loading, error, refetch]);

  return <StoreCtx.Provider value={api_}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
