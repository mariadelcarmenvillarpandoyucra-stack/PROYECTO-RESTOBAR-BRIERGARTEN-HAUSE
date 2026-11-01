export function bs(monto: number): string {
  return `Bs. ${monto.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
}
