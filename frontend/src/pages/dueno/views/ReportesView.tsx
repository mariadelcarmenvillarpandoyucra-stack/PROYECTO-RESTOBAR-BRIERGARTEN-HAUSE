import { useState } from "react";
import { StatCard } from "../../../components/ui/StatCard";
import { bs } from "../../../lib/format";
import { useStore } from "../../../store/StoreContext";

const RANGOS = ["Hoy", "Últimos 7 días", "Este mes"];

function enRango(ts: number, rango: string) {
  const ahora = new Date();
  const fecha = new Date(ts);
  if (rango === "Hoy") {
    return fecha.toDateString() === ahora.toDateString();
  }
  if (rango === "Últimos 7 días") {
    const hace7dias = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return ts >= hace7dias;
  }
  // Este mes
  return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
}

export function ReportesView() {
  const { db } = useStore();
  const totalSemana = db.ventasSemana.reduce((a, b) => a + b, 0);
  const [rango, setRango] = useState(RANGOS[0]);
  const [tipo, setTipo] = useState("Ventas");

  const ventasEnRango = db.ventas.filter((v) => enRango(v.ts, rango));
  const productosVendidos: Record<string, number> = {};
  ventasEnRango.forEach((venta) => {
    venta.items.forEach((item) => {
      productosVendidos[item.nombre] =
        (productosVendidos[item.nombre] || 0) + item.cant;
    });
  });

  const productoTop =
    Object.entries(productosVendidos)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "Sin ventas";
  const totalQR = ventasEnRango
    .filter((v) => v.metodoPago === "qr")
    .reduce((total, v) => total + v.subtotal + (v.propina || 0), 0);

  const totalEfectivo = ventasEnRango
    .filter((v) => v.metodoPago === "efectivo")
    .reduce((total, v) => total + v.subtotal + (v.propina || 0), 0);

  const porFecha: Record<string, { total: number; pedidos: number; ts: number }> = {};
  ventasEnRango.forEach((v) => {
    const clave = new Date(v.ts).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
    if (!porFecha[clave]) porFecha[clave] = { total: 0, pedidos: 0, ts: v.ts };
    porFecha[clave].total += (v.subtotal || 0) + (v.propina || 0);
    porFecha[clave].pedidos += 1;
  });
  const filasFecha = Object.entries(porFecha).sort((a, b) => a[1].ts - b[1].ts);
  const totalRango = filasFecha.reduce((s, [, v]) => s + v.total, 0);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="text-sm font-semibold text-cream mb-1">Generar reporte</p>
        <p className="text-xs text-cream-dim mb-4">Selecciona el rango y el tipo de reporte a consultar</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs text-cream-dim block mb-1">Rango</label>
            <select
              value={rango}
              onChange={(e) => setRango(e.target.value)}
              className="bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream"
            >
              {RANGOS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-cream-dim block mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream"
            >
              <option>Ventas</option>
              <option>Facturación</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <p className="text-sm font-semibold text-cream">Vendido por fecha </p>
          <span className="text-sm text-gold font-semibold">Total: {bs(totalRango)}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-cream-dim text-xs border-b border-line">
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2 pr-4">Ventas realizadas</th>
                <th className="py-2 pr-4">Total vendido</th>
              </tr>
            </thead>
            <tbody>
              {filasFecha.map(([fecha, v]) => (
                <tr key={fecha} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-4 text-cream">{fecha}</td>
                  <td className="py-2.5 pr-4 text-cream-dim">{v.pedidos}</td>
                  <td className="py-2.5 pr-4 text-gold font-semibold">{bs(v.total)}</td>
                </tr>
              ))}
              {filasFecha.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-cream-dim">
                    No hay ventas registradas en este rango ({rango.toLowerCase()}) todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={`Total vendido (${rango})`}
          value={bs(totalRango)}
        />
        <StatCard
          label={`Producto más vendido (${rango})`}
          value={productoTop}
        />
        <StatCard
          label="Cobrado por QR"
          value={bs(totalQR)}
        />
        <StatCard
          label="Cobrado en efectivo"
          value={bs(totalEfectivo)}
        />
      </div>

      <div className="card p-4">
        <h3 className="font-display text-cream mb-3">Ventas de la semana (Bs.)</h3>
        <div className="flex items-end gap-3 h-40">
          {db.ventasSemana.map((v, i) => {
            const max = Math.max(...db.ventasSemana);
            const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-cream-dim">{bs(v)}</span>
                <div className="w-full bg-gold-dim rounded-t-sm" style={{ height: `${max > 0 ? (v / max) * 100 : 0}%` }} />
                <span className="text-[10px] text-cream-dim">{dias[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}