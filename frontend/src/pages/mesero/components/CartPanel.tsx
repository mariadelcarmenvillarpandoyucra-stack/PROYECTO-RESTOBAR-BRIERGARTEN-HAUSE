import { Icon } from "../../../lib/icons";
import { bs } from "../../../lib/format";
import type { ItemPedido } from "../../../types";

interface CartPanelProps {
  items: ItemPedido[];
  onCambiarCantidad: (nombre: string, delta: number) => void;
  onEnviar: () => void;
}

/** Carrito del pedido en curso — botón enviar queda deshabilitado si está vacío. */
export function CartPanel({ items, onCambiarCantidad, onEnviar }: CartPanelProps) {
  const total = items.reduce((s, it) => s + it.precio * it.cant, 0);

  return (
    <div className="card p-4 flex flex-col h-full">
      <h3 className="font-display text-cream mb-3">Pedido actual</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {items.length === 0 && <p className="text-sm text-cream-dim">Toca un producto del menú para agregarlo.</p>}
        {items.map((it) => (
          <div key={it.nombre} className="flex items-center justify-between text-sm">
            <span className="text-cream flex-1 truncate">{it.nombre}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onCambiarCantidad(it.nombre, -1)} className="w-6 h-6 flex items-center justify-center btn-outline rounded-full">
                <Icon name="minus" className="w-3 h-3" />
              </button>
              <span className="text-cream w-4 text-center">{it.cant}</span>
              <button onClick={() => onCambiarCantidad(it.nombre, 1)} className="w-6 h-6 flex items-center justify-center btn-outline rounded-full">
                <Icon name="plus" className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line pt-3 flex items-center justify-between mb-3">
        <span className="text-sm text-cream-dim">Total</span>
        <span className="text-lg font-display text-gold">{bs(total)}</span>
      </div>
      <button className="btn-gold text-sm w-full flex items-center justify-center gap-2" disabled={items.length === 0} onClick={onEnviar}>
        <Icon name="send" className="w-4 h-4" /> Enviar a cocina
      </button>
    </div>
  );
}
