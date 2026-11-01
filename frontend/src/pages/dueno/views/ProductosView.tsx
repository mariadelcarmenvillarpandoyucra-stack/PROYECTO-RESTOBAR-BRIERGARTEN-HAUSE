import { useState } from "react";
import { Icon } from "../../../lib/icons";
import { Modal } from "../../../components/ui/Modal";
import { bs } from "../../../lib/format";
import { useStore } from "../../../store/StoreContext";
import type { Producto } from "../../../types";
import { BARRILES, CATEGORIA_ICONS } from "../../../store/seed";

const CATEGORIAS = ["Comidas", "Cócteles", "Cerveza artesanal", "Refrescos"];
const TABS = ["Todos", ...CATEGORIAS];

const emptyForm = { nombre: "", categoria: CATEGORIAS[0], precio: "", descripcion: "" };

export function ProductosView() {
  const { db, agregarProducto, editarProducto, eliminarProducto } = useStore();
  const [tab, setTab] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagen, setImagen] = useState<string | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("Sin archivos seleccionados");

  function abrirNuevo() {
    setEditId(null);
    setForm(emptyForm);
    setImagen(null);
    setNombreArchivo("Sin archivos seleccionados");
    setModalOpen(true);
  }

  function abrirEditar(p: Producto) {
    setEditId(p.id);
    setForm({ nombre: p.nombre, categoria: p.categoria, precio: String(p.precio), descripcion: p.descripcion });
    setImagen(p.imagen ?? null);
    setNombreArchivo(p.imagen ? "Imagen actual" : "Sin archivos seleccionados");
    setModalOpen(true);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNombreArchivo(file.name);
    const reader = new FileReader();
    reader.onload = () => setImagen(reader.result as string);
    reader.readAsDataURL(file);
  }

  function guardar(e: React.FormEvent) {
    e.preventDefault();
    const precio = Number(form.precio) || 0;
    if (editId) {
      editarProducto(editId, { nombre: form.nombre, categoria: form.categoria, precio, descripcion: form.descripcion, imagen });
    } else {
      agregarProducto({ nombre: form.nombre, categoria: form.categoria, precio, descripcion: form.descripcion, icon: "plate", imagen });
    }
    setModalOpen(false);
  }

  const productosFiltrados = tab === "Todos" ? db.productos : db.productos.filter((p) => p.categoria === tab);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h3 className="font-display text-cream mb-4">Stock de cerveza — barriles</h3>
        <div className="space-y-4">
          {BARRILES.map((b) => (
            <div key={b.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-cream">{b.nombre}</span>
                <span className="text-cream-dim">{b.nivel}% · {b.capacidad}</span>
              </div>
              <div className="w-full h-2 bg-bg-card-hi rounded-full overflow-hidden">
                <div className={`h-full ${b.nivel < 20 ? "bg-danger" : b.nivel < 50 ? "bg-warn" : "bg-gold-dim"}`} style={{ width: `${b.nivel}%` }} />
              </div>
              {b.nivel < 20 && <p className="text-[11px] text-danger mt-1">⚠ Nivel crítico — reponer pronto</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
          <div>
            <h3 className="font-display text-cream mb-1">Menú / Productos</h3>
            <p className="text-xs text-cream-dim">Lo que añadas aquí aparece al instante en el panel del mesero</p>
          </div>
          <button className="btn-gold text-sm flex items-center gap-2" onClick={abrirNuevo}>
            <Icon name="plus" className="w-4 h-4" /> Añadir producto
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setTab(cat)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm border ${
                tab === cat ? "border-gold bg-gold/10 text-gold" : "border-line text-cream-dim"
              }`}
            >
              <Icon name={(CATEGORIA_ICONS[cat] as any) ?? "productos"} className="w-3.5 h-3.5" />
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-gold mb-4">{productosFiltrados.length} productos en el menú</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map((p) => (
            <div key={p.id} className="card overflow-hidden relative cursor-pointer" onClick={() => abrirEditar(p)}>
              <button
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-cream-dim hover:text-danger flex items-center justify-center z-10"
                onClick={(e) => { e.stopPropagation(); eliminarProducto(p.id); }}
                aria-label="Eliminar"
              >
                ×
              </button>
              <div className="h-20 bg-bg-card-hi flex items-center justify-center text-gold">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Icon name={(p.icon as any) ?? "plate"} className="w-7 h-7" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm text-cream font-semibold">{p.nombre}</p>
                <p className="text-[11px] text-cream-dim">{p.categoria}</p>
                <p className="text-xs text-cream-dim mt-1 line-clamp-2">{p.descripcion}</p>
                <p className="text-sm text-gold font-semibold mt-2">{bs(p.precio)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editId ? "Editar producto" : "Nuevo producto"} onClose={() => setModalOpen(false)}>
          <form onSubmit={guardar} className="space-y-4">
            <div>
              <label className="text-xs text-cream-dim block mb-1">Imagen del producto</label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-sm bg-bg-deep border border-line flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagen ? (
                    <img src={imagen} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-dim" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <circle cx="8.5" cy="9.5" r="1.5" />
                      <path d="M21 16l-5-5-4 4-2-2-5 5" />
                    </svg>
                  )}
                </div>
                <label className="btn-outline text-xs cursor-pointer">
                  Seleccionar archivo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
                <span className="text-xs text-cream-dim truncate">{nombreArchivo}</span>
              </div>
              <p className="text-[11px] text-cream-dim mt-1">Opcional — si no subes imagen se usará un ícono genérico</p>
            </div>

            <div>
              <label className="text-xs text-cream-dim block mb-1">Nombre del producto</label>
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Costillas BBQ" className="w-full bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-cream-dim block mb-1">Categoría</label>
                <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream">
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-cream-dim block mb-1">Precio (Bs.)</label>
                <input required type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="0" className="w-full bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream" />
              </div>
            </div>

            <div>
              <label className="text-xs text-cream-dim block mb-1">Descripción</label>
              <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción — la verá el mesero al armar el pedido" className="w-full bg-bg-deep border border-line rounded-sm px-3 py-2 text-sm text-cream" />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-line">
              <button type="button" className="btn-outline text-sm" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button type="submit" className="btn-gold text-sm">Guardar producto</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}