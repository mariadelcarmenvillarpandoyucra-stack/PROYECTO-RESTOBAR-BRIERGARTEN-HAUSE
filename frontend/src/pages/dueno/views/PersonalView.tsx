import { bs } from "../../../lib/format";
import { statsPorMesero, useStore } from "../../../store/StoreContext";

export function PersonalView() {
  const { db } = useStore();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {db.meseros.map((m) => {
        const stats = statsPorMesero(db, m.nombre);
        return (
          <div key={m.id} className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center text-black font-bold">
                {m.nombre.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-cream">{m.nombre}</p>
                <p className="text-[11px] text-cream-dim">Mesero</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-display text-cream">{stats.pedidosHoy}</p>
                <p className="text-[10px] text-cream-dim">Pedidos</p>
              </div>
              <div>
                <p className="text-lg font-display text-cream">{bs(stats.propinasHoy)}</p>
                <p className="text-[10px] text-cream-dim">Propinas</p>
              </div>
              <div>
                <p className="text-lg font-display text-cream">{stats.calificacion ? stats.calificacion.toFixed(1) : "—"}</p>
                <p className="text-[10px] text-cream-dim">Calificación</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
