import { Badge } from "../../../components/ui/Badge";
import { bs } from "../../../lib/format";
import { useStore } from "../../../store/StoreContext";

export function MisPedidosView({ meseroNombre }: { meseroNombre: string }) {
  const { db } = useStore();
  const misPedidos = db.pedidos.filter((p) => p.mesero === meseroNombre);

  return (
    <div className="space-y-3">
      {misPedidos.length === 0 && <p className="text-sm text-cream-dim">Todavía no enviaste pedidos hoy.</p>}
      {misPedidos.map((p) => (
        <div key={p.id} className="card p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-cream">#{p.id} · Mesa {p.mesa}</span>
            <Badge estado={p.estado} />
          </div>
          <ul className="text-xs text-cream-dim space-y-0.5 mb-2">
            {p.items.map((it, i) => <li key={i}>{it.cant}× {it.nombre}</li>)}
          </ul>
          <div className="flex justify-between text-xs text-cream-dim">
            <span>{p.hora}</span>
            <span className="text-gold font-semibold">{bs(p.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
