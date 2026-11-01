export function horaActual() {
  return new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
}

export function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
