import { useStore } from "../../../store/StoreContext";

export function FacturacionView() {
  const { db } = useStore();

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-cream mb-1">Solicitudes de factura</p>
      <p className="text-xs text-cream-dim mb-4">Lo que pide el mesero al cliente al cerrar su mesa</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream-dim text-xs border-b border-line">
              <th className="py-2 pr-4">Mesa</th>
              <th className="py-2 pr-4">Cliente</th>
              <th className="py-2 pr-4">NIT</th>
              <th className="py-2 pr-4">Mesero</th>
              <th className="py-2 pr-4">Fecha</th>
              <th className="py-2 pr-4">Notas</th>
            </tr>
          </thead>
          <tbody>
            {db.solicitudesFactura.map((f) => (
              <tr key={f.id} className="border-b border-line last:border-0">
                <td className="py-2.5 pr-4 text-cream">Mesa {f.mesa}</td>
                <td className="py-2.5 pr-4 text-cream">{f.nombreCliente}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{f.nit || "—"}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{f.mesero || "—"}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{f.hora || "—"}</td>
                <td className="py-2.5 pr-4 text-cream-dim">{f.notas || "—"}</td>
              </tr>
            ))}
            {db.solicitudesFactura.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-cream-dim">
                  Todavía no hay solicitudes de factura — acá aparecerán en cuanto un mesero cargue una.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}