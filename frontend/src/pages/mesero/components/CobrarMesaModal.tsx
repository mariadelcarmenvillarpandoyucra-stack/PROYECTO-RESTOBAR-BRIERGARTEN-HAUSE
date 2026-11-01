
import { useState } from "react";
import type { MetodoPago } from "../../../types";
import "./CobrarMesaModal.css";

interface CobrarMesaModalProps {
  mesa: number;
  subtotal: number;
  onConfirmar: (
    propina: number,
    metodoPago: MetodoPago,
    calificacion: number
  ) => void;
  onCerrar: () => void;
}

const PROPINA_PREDEFINIDA = [0, 5, 10, 15, 20, 25];

const OPCIONES_CALIFICACION = [
  { nombre: "Malo", valor: 1 },
  { nombre: "Regular", valor: 2 },
  { nombre: "Bueno", valor: 3 },
  { nombre: "Satisfecho", valor: 4 },
  { nombre: "Muy satisfecho", valor: 5 },
];

export function CobrarMesaModal({
  mesa,
  subtotal,
  onConfirmar,
  onCerrar,
}: CobrarMesaModalProps) {
  const [propina, setPropina] = useState(0);
  const [propinaManual, setPropinaManual] = useState("");
  const [usarPropinaManual, setUsarPropinaManual] =
    useState(false);

  const [metodoPago, setMetodoPago] =
    useState<MetodoPago>("efectivo");

  // Calificación inicial
  const [calificacion, setCalificacion] = useState(5);

  const montoPropina = usarPropinaManual
    ? Number(propinaManual) || 0
    : propina;

  const total = subtotal + montoPropina;

  // Obtener el nombre correspondiente a la calificación
  const nombreCalificacion =
    OPCIONES_CALIFICACION.find(
      (opcion) => opcion.valor === calificacion
    )?.nombre ?? "Muy satisfecho";

  function seleccionarPropina(monto: number) {
    setUsarPropinaManual(false);
    setPropina(monto);
    setPropinaManual("");
  }

  function seleccionarPropinaManual() {
    setUsarPropinaManual(true);
    setPropina(0);
  }

  function confirmar() {
    if (montoPropina < 0) return;

    onConfirmar(
      montoPropina,
      metodoPago,
      calificacion
    );
  }

  return (
    <div className="cobro-modal">

      {/* ENCABEZADO */}

      <div className="cobro-header">
        <div>
          <h2 className="cobro-title">
            Cobrar mesa {mesa}
          </h2>

          <p className="cobro-subtitle">
            Revisa el pago antes de liberar la mesa.
          </p>
        </div>

        <button
          type="button"
          className="cobro-close"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* RESUMEN */}

      <div className="cobro-resumen">
        <div className="cobro-resumen-linea">
          <span>Consumo</span>
          <strong>Bs. {subtotal.toFixed(2)}</strong>
        </div>

        <div className="cobro-resumen-linea">
          <span>Propina</span>
          <strong>Bs. {montoPropina.toFixed(2)}</strong>
        </div>

        <div className="cobro-separador" />

        <div className="cobro-total-linea">
          <span>Total</span>
          <strong>Bs. {total.toFixed(2)}</strong>
        </div>
      </div>

      {/* PROPINA */}

      <section className="cobro-seccion">
        <div className="cobro-seccion-titulo">
          Propina
        </div>

        <div className="cobro-propinas">
          {PROPINA_PREDEFINIDA.map((monto) => (
            <button
              key={monto}
              type="button"
              className={
                !usarPropinaManual && propina === monto
                  ? "cobro-opcion cobro-opcion-activa"
                  : "cobro-opcion"
              }
              onClick={() => seleccionarPropina(monto)}
            >
              {monto === 0
                ? "Sin propina"
                : `Bs. ${monto}`}
            </button>
          ))}

          <button
            type="button"
            className={
              usarPropinaManual
                ? "cobro-opcion cobro-opcion-activa"
                : "cobro-opcion"
            }
            onClick={seleccionarPropinaManual}
          >
            Otro monto
          </button>
        </div>

        {usarPropinaManual && (
          <div className="cobro-manual">
            <label
              htmlFor="propina-manual"
              className="cobro-label"
            >
              Monto de propina
            </label>

            <div className="cobro-input-monto">
              <input
                id="propina-manual"
                type="number"
                min="0"
                step="0.01"
                value={propinaManual}
                onChange={(e) =>
                  setPropinaManual(e.target.value)
                }
                placeholder="0.00"
                autoFocus
              />

              <span>Bs.</span>
            </div>
          </div>
        )}
      </section>

      {/* MÉTODO DE PAGO */}

      <section className="cobro-seccion">
        <div className="cobro-seccion-titulo">
          Método de pago
        </div>

        <div className="cobro-pagos">
          <button
            type="button"
            className={
              metodoPago === "efectivo"
                ? "cobro-pago cobro-pago-activo"
                : "cobro-pago"
            }
            onClick={() => setMetodoPago("efectivo")}
          >
            <span className="cobro-pago-icono">
              💵
            </span>
            <span>Efectivo</span>
          </button>

          <button
            type="button"
            className={
              metodoPago === "qr"
                ? "cobro-pago cobro-pago-activo"
                : "cobro-pago"
            }
            onClick={() => setMetodoPago("qr")}
          >
            <span className="cobro-pago-icono">
              📱
            </span>
            <span>QR</span>
          </button>
        </div>
      </section>

      {/* CALIFICACIÓN DEL CLIENTE */}

      <section className="cobro-seccion cobro-calificacion">

        <div className="cobro-seccion-titulo">
          Calificación del cliente
        </div>

        {/* COMBO BOX */}

        <select
          id="calificacion-cliente"
          className="cobro-select-calificacion"
          value={calificacion}
          onChange={(e) =>
            setCalificacion(Number(e.target.value))
          }
        >
          {OPCIONES_CALIFICACION.map((opcion) => (
            <option
              key={opcion.valor}
              value={opcion.valor}
            >
              {opcion.nombre}
            </option>
          ))}
        </select>

        {/* ESTRELLAS CENTRADAS */}

        <div className="cobro-valoracion">

          <div
            className="cobro-estrellas"
            role="img"
            aria-label={`${calificacion} de 5 estrellas`}
          >
            {[1, 2, 3, 4, 5].map((numero) => (
              <span
                key={numero}
                className={
                  numero <= calificacion
                    ? "cobro-estrella cobro-estrella-activa"
                    : "cobro-estrella"
                }
              >
                ★
              </span>
            ))}
          </div>

          <p className="cobro-nombre-calificacion">
            {nombreCalificacion}
          </p>

          <span className="cobro-texto-calificacion">
            {calificacion} de 5 estrellas
          </span>

        </div>

      </section>

      {/* BOTONES */}

      <div className="cobro-acciones">
        <button
          type="button"
          className="cobro-btn-cancelar"
          onClick={onCerrar}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="cobro-btn-confirmar"
          onClick={confirmar}
        >
          Cobrar y liberar mesa
        </button>
      </div>

    </div>
  );
}