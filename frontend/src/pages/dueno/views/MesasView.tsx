import { Badge } from "../../../components/ui/Badge";
import { bs } from "../../../lib/format";
import { minutosDesde } from "../../../store/seed";
import { useStore } from "../../../store/StoreContext";

export function MesasView() {
  const { db } = useStore();

  function pedidosDeMesa(mesa: number) {
    return db.pedidos.filter((p) => p.mesa === mesa);
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-cream mb-1">Estado de mesas en tiempo real</p>
      <p className="text-xs text-cream-dim mb-4">Vista de solo lectura — la actualizan los meseros desde su panel</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
        {db.mesas.map((m) => {
          const pedidos = pedidosDeMesa(m.num);
          const total = pedidos.reduce((s, p) => s + p.total, 0);
          const libre = m.estado === "libre";
          return (
            <div key={m.num} className="card p-4 flex flex-col items-center text-center gap-1 relative">
              <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${libre ? "bg-ok" : "bg-warn"}`} />
              <span className="font-display text-2xl text-cream">{m.num}</span>
              <span className="text-[11px] text-cream-dim">{libre ? "Libre" : "Ocupada"}</span>
              {!libre && (
                <>
                  <span className="text-[10px] text-cream-dim">
                    {m.horaApertura ? minutosDesde(m.horaApertura) : 0} min
                  </span>
                  <span className="text-[11px] text-gold font-semibold">{bs(total)}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-cream-dim border-t border-line pt-3">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-ok" /> Libre</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warn" /> Ocupada</span>
      </div>
    </div>
  );
}