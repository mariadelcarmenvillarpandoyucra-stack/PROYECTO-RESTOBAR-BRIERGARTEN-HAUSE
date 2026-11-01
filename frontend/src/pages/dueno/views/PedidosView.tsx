import { Badge } from "../../../components/ui/Badge";
import { bs } from "../../../lib/format";
import { useStore } from "../../../store/StoreContext";

export function PedidosView() {
  const { db } = useStore();
  const pedidos = [...db.pedidos].sort((a, b) => b.id - a.id);

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-cream mb-4">Todos los pedidos</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream-dim text-xs border-b border-line">
              <th className="py-2 pr-4">Pedido</th>
              <th className="py-2 pr-4">Mesa</th>
              <th className="py-2 pr-4">Mesero</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Hora</th>
              <th className="py-2 pr-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="py-2.5 pr-4 text-cream">#{p.id}</td>
                <td className="py-2.5 pr-4 text-cream-dim">Mesa {p.mesa}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{p.mesero}</td>
                <td className="py-2.5 pr-4 text-cream-dim">
                  {p.items.map((it, i) => `${it.cant}× ${it.nombre}`).join(", ")}
                </td>
                <td className="py-2.5 pr-4 text-cream font-semibold">{bs(p.total)}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{p.hora}</td>
                <td className="py-2.5 pr-4"><Badge estado={p.estado} /></td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr><td colSpan={7} className="py-6 text-center text-cream-dim">Todavía no hay pedidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}