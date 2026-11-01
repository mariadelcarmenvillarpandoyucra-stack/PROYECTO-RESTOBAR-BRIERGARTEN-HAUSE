import { Icon } from "../../../lib/icons";
import { bs } from "../../../lib/format";
import { computeStats, useStore } from "../../../store/StoreContext";
import { StatCard } from "../../../components/ui/StatCard";

export function CajaView() {
  const { db } = useStore();
  const stats = computeStats(db);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total del día" value={bs(stats.ventasHoy + stats.propinasHoy)} />
        <StatCard label="💵 Efectivo" value={bs(stats.cajaEfectivo)} sub={`${stats.numEfectivo} cobros`} />
        <StatCard label="📱 QR" value={bs(stats.cajaQR)} sub={`${stats.pctQR}% del total`} />
        <StatCard label="🤝 Propinas" value={bs(stats.propinasHoy)} />
      </div>

      <div className="card p-4">
        <h3 className="font-display text-cream mb-3">Historial de cobros</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-cream-dim text-xs uppercase tracking-wide">
                <th className="pb-2">Mesa</th>
                <th className="pb-2">Mesero</th>
                <th className="pb-2">Método</th>
                <th className="pb-2">Propina</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Hora</th>
              </tr>
            </thead>
            <tbody>
              {db.ventas.map((v) => (
                <tr key={v.id} className="border-t border-line">
                  <td className="py-2 text-cream">Mesa {v.mesa}</td>
                  <td className="py-2 text-cream-dim">{v.mesero}</td>
                  <td className="py-2 text-cream-dim flex items-center gap-1.5">
                    <Icon name={v.metodoPago === "efectivo" ? "efectivo" : "qr"} className="w-4 h-4" />
                    {v.metodoPago === "efectivo" ? "Efectivo" : "QR"}
                  </td>
                  <td className="py-2 text-cream-dim">{bs(v.propina)}</td>
                  <td className="py-2 text-cream font-semibold">{bs(v.subtotal + v.propina)}</td>
                  <td className="py-2 text-cream-dim">{v.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
