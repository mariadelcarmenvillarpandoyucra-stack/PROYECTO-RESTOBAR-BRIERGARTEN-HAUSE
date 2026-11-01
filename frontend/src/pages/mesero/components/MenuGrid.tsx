import { useState } from "react";
import { Icon } from "../../../lib/icons";
import { bs } from "../../../lib/format";
import { CATEGORIA_ICONS } from "../../../store/seed";
import type { Producto } from "../../../types";

interface MenuGridProps {
  productos: Producto[];
  onAgregar: (p: Producto) => void;
}

/**
 * Grilla del menú con filtro por categoría.
 * Se utiliza al armar un pedido.
 */
export function MenuGrid({
  productos,
  onAgregar,
}: MenuGridProps) {

  const categorias = [
    "Todos",
    ...Array.from(
      new Set(
        productos.map(
          (p) => p.categoria
        )
      )
    ),
  ];

  const [categoria, setCategoria] =
    useState("Todos");

  const visibles =
    categoria === "Todos"
      ? productos
      : productos.filter(
          (p) =>
            p.categoria === categoria
        );

  return (
    <div className="space-y-3">

      {/* =====================================================
          CATEGORÍAS
          ===================================================== */}

      <div className="flex gap-2 overflow-x-auto pb-2">

        {categorias.map((c) => (

          <button
            key={c}
            type="button"
            onClick={() =>
              setCategoria(c)
            }
            className={`
              flex
              items-center
              gap-1.5
              text-xs
              px-3
              py-2
              rounded-full
              whitespace-nowrap
              flex-shrink-0
              ${
                categoria === c
                  ? "bg-gold text-bg-deep font-semibold"
                  : "btn-outline"
              }
            `}
          >

            <Icon
              name={
                (CATEGORIA_ICONS[
                  c
                ] as any) ??
                "productos"
              }
              className="w-3.5 h-3.5"
            />

            {c}

          </button>

        ))}

      </div>

      {/* =====================================================
          CANTIDAD DE PRODUCTOS
          ===================================================== */}

      <p className="text-xs text-cream-dim">
        {visibles.length} productos disponibles
      </p>

      {/* =====================================================
          PRODUCTOS
          ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {visibles.map((p) => (

          <button
            key={p.id}
            type="button"
            onClick={() =>
              onAgregar(p)
            }
            className="
              card
              overflow-hidden
              text-left
              hover:border-gold
              transition
              active:scale-[0.98]
            "
          >

            {/* =================================================
                IMAGEN
                ================================================= */}

            {p.imagen ? (

              <div className="w-full h-28 sm:h-32 overflow-hidden bg-bg-card-hi">

                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-200
                    hover:scale-105
                  "
                />

              </div>

            ) : (

              <div className="
                w-full
                h-24
                bg-bg-card-hi
                flex
                items-center
                justify-center
                text-gold
              ">

                <Icon
                  name={
                    (p.icon as any) ??
                    "plate"
                  }
                  className="w-8 h-8"
                />

              </div>

            )}

            {/* =================================================
                INFORMACIÓN
                ================================================= */}

            <div className="p-3">

              <p className="
                text-sm
                text-cream
                font-semibold
                truncate
              ">
                {p.nombre}
              </p>

              <p className="
                text-[11px]
                text-cream-dim
                mt-0.5
              ">
                {p.categoria}
              </p>

              <div className="
                flex
                items-center
                justify-between
                gap-2
                mt-3
              ">

                <p className="
                  text-sm
                  text-gold
                  font-semibold
                ">
                  {bs(p.precio)}
                </p>

                <span className="
                  text-[11px]
                  px-2
                  py-1
                  rounded
                  bg-gold
                  text-bg-deep
                  font-semibold
                ">
                  + Agregar
                </span>

              </div>

            </div>

          </button>

        ))}

      </div>

      {/* =====================================================
          SIN PRODUCTOS
          ===================================================== */}

      {visibles.length === 0 && (

        <div className="
          text-center
          py-8
          text-sm
          text-cream-dim
          border
          border-line
          rounded-sm
        ">
          No hay productos en esta categoría.
        </div>

      )}

    </div>
  );
}