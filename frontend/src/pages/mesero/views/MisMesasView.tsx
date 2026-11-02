import { useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Modal } from "../../../components/ui/Modal";
import { useStore } from "../../../store/StoreContext";
import { MenuGrid } from "../components/MenuGrid";
import qrYape from "../../../../img/qr-mari.jpeg";
import type {
  ItemPedido,
  MetodoPago,
  Producto,
} from "../../../types";

export function MisMesasView({
  meseroNombre,
}: {
  meseroNombre: string;
}) {
  const {
    db,
    crearPedido,
    crearSolicitudFactura,
    cobrarMesa,
  } = useStore();

  /* =========================================================
     ESTADOS
     ========================================================= */

  const [mesaActiva, setMesaActiva] =
    useState<number | null>(null);

  const [vistaModal, setVistaModal] =
    useState<"productos" | "resumen">("productos");

  const [carrito, setCarrito] =
    useState<ItemPedido[]>([]);

  const [modalFactura, setModalFactura] =
    useState(false);

  const [modalCobro, setModalCobro] =
    useState(false);

  const [nombreCliente, setNombreCliente] =
    useState("");

  const [nit, setNit] =
    useState("");

  const [notasFactura, setNotasFactura] =
    useState("");

  const [metodoPago, setMetodoPago] =
    useState<MetodoPago>("efectivo");

  const [propina, setPropina] =
    useState(0);

  const [propinaManual, setPropinaManual] =
    useState("");

  const [usarPropinaManual, setUsarPropinaManual] =
    useState(false);

  const [calificacion, setCalificacion] =
    useState(5);

  /* =========================================================
     MESA SELECCIONADA
     ========================================================= */

  const mesaSeleccionada =
    db.mesas.find(
      (m) => m.num === mesaActiva
    );

  /* =========================================================
     PEDIDOS DE LA MESA
     ========================================================= */

  const pedidosMesa =
    mesaActiva !== null
      ? db.pedidos.filter(
          (pedido) =>
            pedido.mesa === mesaActiva
        )
      : [];

  /* =========================================================
     TOTAL DE LA MESA
     ========================================================= */

  const totalMesa =
    pedidosMesa.reduce(
      (total, pedido) =>
        total + pedido.total,
      0
    );

  /* =========================================================
     TOTAL DEL CARRITO
     ========================================================= */

  const totalCarrito =
    carrito.reduce(
      (total, item) =>
        total +
        item.precio * item.cant,
      0
    );

  /* =========================================================
     PROPINA FINAL
     ========================================================= */

  const propinaFinal =
    usarPropinaManual
      ? Number(propinaManual) || 0
      : propina;

  /* =========================================================
     TOTAL FINAL A COBRAR
     ========================================================= */

  const totalFinal =
    totalMesa + propinaFinal;

  /* =========================================================
     ABRIR MESA
     ========================================================= */

  function abrirMesa(num: number) {
    const mesa =
      db.mesas.find(
        (m) => m.num === num
      );

    if (!mesa) return;

    setMesaActiva(num);
    setCarrito([]);

    if (mesa.estado === "libre") {
      setVistaModal("productos");
    } else {
      setVistaModal("resumen");
    }
  }

  /* =========================================================
     CERRAR MESA
     ========================================================= */

  function cerrarMesa() {
    setMesaActiva(null);
    setCarrito([]);
    setVistaModal("productos");
    setModalCobro(false);
  }

  /* =========================================================
     AGREGAR PRODUCTO
     ========================================================= */

  function agregarAlCarrito(
    producto: Producto
  ) {
    setCarrito((prev) => {
      const existe =
        prev.find(
          (item) =>
            item.nombre ===
            producto.nombre
        );

      if (existe) {
        return prev.map((item) =>
          item.nombre ===
          producto.nombre
            ? {
                ...item,
                cant:
                  item.cant + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          nombre:
            producto.nombre,
          cant: 1,
          precio:
            producto.precio,
        },
      ];
    });
  }

  /* =========================================================
     CAMBIAR CANTIDAD
     ========================================================= */

  function cambiarCantidad(
    nombre: string,
    delta: number
  ) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.nombre === nombre
            ? {
                ...item,
                cant:
                  item.cant +
                  delta,
              }
            : item
        )
        .filter(
          (item) =>
            item.cant > 0
        )
    );
  }

  /* =========================================================
     ENVIAR PEDIDO
     ========================================================= */

  function enviarPedido() {
    if (
      mesaActiva === null ||
      carrito.length === 0
    ) {
      return;
    }

    crearPedido(
      mesaActiva,
      meseroNombre,
      carrito
    );

    setCarrito([]);
    cerrarMesa();
  }

  /* =========================================================
     AGREGAR MÁS PRODUCTOS
     ========================================================= */

  function agregarMasProductos() {
    setCarrito([]);
    setVistaModal("productos");
  }

  /* =========================================================
     SOLICITAR FACTURA
     ========================================================= */

  function solicitarFactura(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (mesaActiva === null) {
      return;
    }

    crearSolicitudFactura({
      mesa: mesaActiva,
      mesero: meseroNombre,
      nombreCliente,
      nit,
      notas: notasFactura,
    });

    setModalFactura(false);

    setNombreCliente("");
    setNit("");
    setNotasFactura("");
  }

  /* =========================================================
     ABRIR COBRO
     ========================================================= */

  function abrirCobro() {
    if (
      mesaActiva === null ||
      pedidosMesa.length === 0
    ) {
      return;
    }

    setMetodoPago("efectivo");
    setPropina(0);
    setPropinaManual("");
    setUsarPropinaManual(false);
    setCalificacion(5);
    setModalCobro(true);
  }

  /* =========================================================
     COBRAR Y LIBERAR MESA
     ========================================================= */

  function confirmarCobro() {
    if (
      mesaActiva === null ||
      pedidosMesa.length === 0
    ) {
      return;
    }

    const pedidoIds =
      pedidosMesa.map(
        (pedido) => pedido.id
      );

    cobrarMesa(
      mesaActiva,
      pedidoIds,
      propinaFinal,
      metodoPago,
      calificacion
    );

    setModalCobro(false);

    cerrarMesa();
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="space-y-5">

      {/* =====================================================
          ENCABEZADO
          ===================================================== */}

      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-cream">
          Mis mesas
        </h1>

        <p className="text-sm text-cream-dim mt-1">
          Toca una mesa para tomar el pedido,
          agregar productos o cobrar.
        </p>
      </div>

      {/* =====================================================
          MESAS
          ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4
        "
      >
        {db.mesas.map((mesa) => (
          <button
            key={mesa.num}
            type="button"
            onClick={() =>
              abrirMesa(mesa.num)
            }
            className="
              card
              p-4
              min-h-[145px]
              flex
              flex-col
              justify-between
              text-left
              transition-all
              duration-200
              hover:border-gold
              hover:-translate-y-0.5
              active:scale-[0.98]
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-2
              "
            >
              <span
                className="
                  font-display
                  text-xl
                  text-cream
                "
              >
                Mesa {mesa.num}
              </span>

              <Badge
                estado={mesa.estado === "libre" ? "libre" : "ocupada"}
              />
            </div>

            <div className="mt-4">
              {mesa.estado === "libre" ? (
                <p className="text-sm text-cream-dim">
                  Toca para tomar un pedido
                </p>
              ) : (
                <p className="text-sm text-gold">
                  Toca para ver el pedido
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* =====================================================
          MODAL DE MESA
          ===================================================== */}

      {mesaActiva !== null && (
        <Modal
          title={`Mesa ${mesaActiva}`}
          onClose={cerrarMesa}
        >

          {/* =================================================
              VISTA PRODUCTOS
              ================================================= */}

          {vistaModal === "productos" && (
            <div className="space-y-4">

              <div>
                <p className="text-sm text-cream">
                  Selecciona los productos
                </p>

                <p className="text-xs text-cream-dim mt-1">
                  Agrega los productos que
                  desea el cliente.
                </p>
              </div>

              {/* PRODUCTOS */}

              <div
                className="
                  max-h-[50vh]
                  overflow-y-auto
                  pr-1
                "
              >
                <MenuGrid
                  productos={
                    db.productos
                  }
                  onAgregar={
                    agregarAlCarrito
                  }
                />
              </div>

              {/* CARRITO */}

              <div
                className="
                  border-t
                  border-line
                  pt-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >
                  <span className="text-sm text-cream-dim">
                    Pedido actual
                  </span>

                  <span className="font-display text-lg text-gold">
                    Bs.{" "}
                    {totalCarrito.toFixed(0)}
                  </span>
                </div>

                {carrito.length > 0 && (
                  <div
                    className="
                      space-y-2
                      mb-4
                      max-h-40
                      overflow-y-auto
                    "
                  >
                    {carrito.map(
                      (item) => (
                        <div
                          key={
                            item.nombre
                          }
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            bg-bg-card-hi
                            rounded-sm
                            px-3
                            py-2
                          "
                        >
                          <div className="min-w-0">
                            <p className="text-sm text-cream truncate">
                              {item.nombre}
                            </p>

                            <p className="text-xs text-gold">
                              Bs.{" "}
                              {item.precio}
                            </p>
                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              flex-shrink-0
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidad(
                                  item.nombre,
                                  -1
                                )
                              }
                              className="
                                w-7
                                h-7
                                rounded
                                border
                                border-line
                                text-cream
                                hover:border-gold
                              "
                            >
                              −
                            </button>

                            <span
                              className="
                                text-sm
                                text-cream
                                w-5
                                text-center
                              "
                            >
                              {item.cant}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                cambiarCantidad(
                                  item.nombre,
                                  1
                                )
                              }
                              className="
                                w-7
                                h-7
                                rounded
                                border
                                border-line
                                text-cream
                                hover:border-gold
                              "
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <button
                  type="button"
                  disabled={
                    carrito.length === 0
                  }
                  onClick={
                    enviarPedido
                  }
                  className="
                    btn-gold
                    w-full
                    text-sm
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >
                  Enviar a cocina →
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              VISTA RESUMEN
              ================================================= */}

          {vistaModal === "resumen" && (
            <div className="space-y-4">

              <div
                className="
                  max-h-[45vh]
                  overflow-y-auto
                  space-y-3
                "
              >
                {pedidosMesa.map(
                  (pedido) => (
                    <div
                      key={pedido.id}
                      className="
                        rounded-sm
                        border
                        border-line
                        bg-bg-card-hi
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p className="text-sm font-semibold text-cream">
                            Pedido #{pedido.id}
                          </p>

                          <p className="text-xs text-cream-dim mt-1">
                            {pedido.hora}
                          </p>
                        </div>

                        <Badge
                          estado={
                            pedido.estado
                          }
                        />
                      </div>

                      <div className="mt-3 space-y-1">
                        {pedido.items.map(
                          (
                            item,
                            index
                          ) => (
                            <p
                              key={
                                index
                              }
                              className="text-sm text-cream-dim"
                            >
                              •{" "}
                              {item.cant}x{" "}
                              {item.nombre}
                            </p>
                          )
                        )}
                      </div>

                      <p className="text-sm text-gold mt-3">
                        Total: Bs.{" "}
                        {pedido.total}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* TOTAL */}

              <div
                className="
                  border-t
                  border-line
                  pt-4
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-sm text-cream-dim">
                  Consumo total
                </span>

                <span className="font-display text-xl text-cream">
                  Bs.{" "}
                  {totalMesa.toFixed(0)}
                </span>
              </div>

              {/* ACCIONES */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={
                    agregarMasProductos
                  }
                  className="
                    btn-outline
                    text-sm
                    min-h-[48px]
                  "
                >
                  + Agregar productos
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setModalFactura(true)
                  }
                  className="
                    btn-outline
                    text-sm
                    min-h-[48px]
                  "
                >
                  Solicitar factura
                </button>
              </div>

              {/* COBRAR */}

              <button
                type="button"
                onClick={abrirCobro}
                className="
                  btn-gold
                  w-full
                  text-sm
                  min-h-[52px]
                  font-semibold
                "
              >
                Cobrar y liberar mesa
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* =====================================================
          MODAL FACTURA
          ===================================================== */}

      {modalFactura && (
        <Modal
          title={`Solicitar factura — Mesa ${mesaActiva}`}
          onClose={() =>
            setModalFactura(false)
          }
        >
          <form
            onSubmit={
              solicitarFactura
            }
            className="space-y-3"
          >

            <div>
              <label className="text-xs text-cream-dim block mb-1">
                Nombre del cliente
              </label>

              <input
                required
                value={
                  nombreCliente
                }
                onChange={(e) =>
                  setNombreCliente(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-bg-deep
                  border
                  border-line
                  rounded-sm
                  px-3
                  py-2
                  text-sm
                  text-cream
                "
              />
            </div>

            <div>
              <label className="text-xs text-cream-dim block mb-1">
                NIT (opcional)
              </label>

              <input
                value={nit}
                onChange={(e) =>
                  setNit(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-bg-deep
                  border
                  border-line
                  rounded-sm
                  px-3
                  py-2
                  text-sm
                  text-cream
                "
              />
            </div>

            <div>
              <label className="text-xs text-cream-dim block mb-1">
                Notas (opcional)
              </label>

              <textarea
                rows={3}
                value={
                  notasFactura
                }
                onChange={(e) =>
                  setNotasFactura(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-bg-deep
                  border
                  border-line
                  rounded-sm
                  px-3
                  py-2
                  text-sm
                  text-cream
                "
                placeholder="Cualquier detalle extra para el dueño"
              />
            </div>

            <div
              className="
                flex
                flex-col-reverse
                sm:flex-row
                justify-end
                gap-2
                pt-3
                border-t
                border-line
              "
            >
              <button
                type="button"
                className="btn-outline text-sm"
                onClick={() =>
                  setModalFactura(false)
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-gold text-sm"
              >
                Enviar al dueño
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =====================================================
          MODAL COBRO
          ===================================================== */}

      {modalCobro && (
        <Modal
          title={`Cobrar Mesa ${mesaActiva}`}
          onClose={() =>
            setModalCobro(false)
          }
        >
          <div className="space-y-5">

            {/* TOTAL */}

            <div
              className="
                rounded-sm
                border
                border-line
                bg-bg-card-hi
                p-4
              "
            >
              <p className="text-xs text-cream-dim">
                Total a cobrar
              </p>

              <p className="font-display text-3xl text-gold mt-1">
                Bs.{" "}
                {totalFinal.toFixed(0)}
              </p>

              {propinaFinal > 0 && (
                <p className="text-xs text-cream-dim mt-1">
                  Consumo: Bs.{" "}
                  {totalMesa.toFixed(0)}
                  {" · "}
                  Propina: Bs.{" "}
                  {propinaFinal.toFixed(0)}
                </p>
              )}
            </div>

            {/* MÉTODO DE PAGO */}

            <div>
              <label className="text-xs text-cream-dim block mb-2">
                Método de pago
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setMetodoPago(
                      "efectivo"
                    )
                  }
                  className={`
                    min-h-[48px]
                    rounded-sm
                    border
                    text-sm
                    transition
                    ${
                      metodoPago ===
                      "efectivo"
                        ? "bg-gold text-bg-deep border-gold font-semibold"
                        : "border-line text-cream hover:border-gold"
                    }
                  `}
                >
                  💵 Efectivo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMetodoPago(
                      "qr"
                    )
                  }
                  className={`
                    min-h-[48px]
                    rounded-sm
                    border
                    text-sm
                    transition
                    ${
                      metodoPago ===
                      "qr"
                        ? "bg-gold text-bg-deep border-gold font-semibold"
                        : "border-line text-cream hover:border-gold"
                    }
                  `}
                >
                  📱 QR
                </button>

              </div>
            </div>

            {metodoPago === "qr" && (
              <div className="rounded-sm border border-line bg-bg-card-hi p-4 text-center">
                <p className="text-sm font-semibold text-cream">
                  Escanea el QR con Yape
                </p>

                <img
                  src={qrYape}
                  alt="QR de pago de Yape de Maria del Carmen Villarpando Yucra"
                  className="mx-auto mt-3 max-h-56 w-auto rounded-sm bg-white p-2"
                />

                <p className="mt-3 text-xs text-cream-dim">
                  Cuenta asociada: <strong className="text-cream">617888</strong>
                </p>
                <p className="mt-2 text-sm text-cream">
                  Ingresa este monto en Yape:{" "}
                  <strong className="text-gold">
                    Bs. {totalFinal.toFixed(2)}
                  </strong>
                </p>
                <p className="mt-1 text-xs text-cream-dim">
                  Verifica el monto antes de confirmar el pago.
                </p>
              </div>
            )}

            {/* PROPINA */}

            <div>
              <label className="text-xs text-cream-dim block mb-2">
                Propina
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                <button
                  type="button"
                  onClick={() => {
                    setPropina(0);
                    setUsarPropinaManual(
                      false
                    );
                  }}
                  className={`
                    py-3
                    rounded-sm
                    border
                    text-xs
                    ${
                      propina === 0 &&
                      !usarPropinaManual
                        ? "bg-gold text-bg-deep border-gold font-semibold"
                        : "border-line text-cream hover:border-gold"
                    }
                  `}
                >
                  Sin propina
                </button>

                {[5, 10, 15].map(
                  (valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => {
                        setPropina(
                          valor
                        );
                        setUsarPropinaManual(
                          false
                        );
                      }}
                      className={`
                        py-3
                        rounded-sm
                        border
                        text-sm
                        ${
                          propina ===
                            valor &&
                          !usarPropinaManual
                            ? "bg-gold text-bg-deep border-gold font-semibold"
                            : "border-line text-cream hover:border-gold"
                        }
                      `}
                    >
                      Bs. {valor}
                    </button>
                  )
                )}
              </div>

              {/* MONTO MANUAL */}

              <button
                type="button"
                onClick={() =>
                  setUsarPropinaManual(
                    true
                  )
                }
                className={`
                  w-full
                  mt-2
                  py-2.5
                  rounded-sm
                  border
                  text-sm
                  ${
                    usarPropinaManual
                      ? "bg-gold text-bg-deep border-gold font-semibold"
                      : "border-line text-cream hover:border-gold"
                  }
                `}
              >
                ✏️ Ingresar monto manual
              </button>

              {usarPropinaManual && (
                <div className="mt-2">
                  <label className="text-xs text-cream-dim block mb-1">
                    Monto de propina
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gold">
                      Bs.
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={
                        propinaManual
                      }
                      onChange={(e) =>
                        setPropinaManual(
                          e.target.value
                        )
                      }
                      placeholder="Ej. 20"
                      className="
                        w-full
                        bg-bg-deep
                        border
                        border-line
                        rounded-sm
                        pl-10
                        pr-3
                        py-2.5
                        text-sm
                        text-cream
                      "
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CALIFICACIÓN */}

            <div>
              <label className="text-xs text-cream-dim block mb-2">
                Calificación
              </label>

              <div className="flex gap-2">

                {[1, 2, 3, 4, 5].map(
                  (valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() =>
                        setCalificacion(
                          valor
                        )
                      }
                      className={`
                        text-xl
                        ${
                          valor <=
                          calificacion
                            ? "text-gold"
                            : "text-cream-dim"
                        }
                      `}
                    >
                      ★
                    </button>
                  )
                )}

              </div>
            </div>

            {/* BOTONES */}

            <div
              className="
                pt-3
                border-t
                border-line
                flex
                flex-col-reverse
                sm:flex-row
                gap-2
              "
            >
              <button
                type="button"
                onClick={() =>
                  setModalCobro(false)
                }
                className="
                  btn-outline
                  w-full
                  text-sm
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  confirmarCobro
                }
                className="
                  btn-gold
                  w-full
                  text-sm
                  font-semibold
                "
              >
                Confirmar cobro y liberar
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}