const LABELS: Record<string, string> = {
  pendiente: "Pendiente", preparando: "Preparando", listo: "Listo", entregado: "Entregado",
  libre: "Libre", ocupada: "Ocupada", cuenta: "Pidió cuenta",
};

export function Badge({ estado }: { estado: string }) {
  return <span className={`badge badge-${estado}`}>{LABELS[estado] ?? estado}</span>;
}
