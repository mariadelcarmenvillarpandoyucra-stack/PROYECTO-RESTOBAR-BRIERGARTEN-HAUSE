/* ==========================================================================
   Set de íconos SVG en línea — migrado 1:1 de js/core/icons.js.
   Se expone como componente <Icon name="..."/> tipado en vez de strings
   sueltas, para que el autocompletado avise si un nombre no existe.
   ========================================================================== */

export const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
  mesas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v7M19 12v7M9 12v7M15 12v7"/></svg>`,
  productos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>`,
  usuarios: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c.8-3.4 3.3-5.4 6.5-5.4s5.7 2 6.5 5.4"/><circle cx="17.5" cy="7" r="2.4"/><path d="M15.8 14.2c2.6.4 4.2 2.2 4.8 5"/></svg>`,
  pedidos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 2h9l3 3v17H6z"/><path d="M15 2v3h3M9 11h6M9 15h6M9 7h3"/></svg>`,
  ventas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 20V10M9 20V4M15 20v-7M21 20V8"/></svg>`,
  propinas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1.4 1.3-2.5 3-2.5s3 .9 3 2.2c0 3-6 1.8-6 4.8 0 1.3 1.3 2.3 3 2.3s3-1 3-2.4"/></svg>`,
  estrella: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2.5l3 6.2 6.8.9-5 4.7 1.3 6.7L12 17.8l-6.1 3.2L7.2 14.4l-5-4.7 6.8-.9z"/></svg>`,
  reportes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 2h9l3 3v17H6z"/><path d="M15 2v3h3"/><path d="M9 12l2 2 4-4"/></svg>`,
  config: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.6 7.6 0 000-2l2-1.5-2-3.5-2.4 1a7.9 7.9 0 00-1.7-1L15 2.5H9L8.7 5a7.9 7.9 0 00-1.7 1l-2.4-1-2 3.5L4.6 11a7.6 7.6 0 000 2l-2 1.5 2 3.5 2.4-1c.5.4 1.1.8 1.7 1l.3 2.5h6l.3-2.5c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.5z"/></svg>`,
  campana: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>`,
  fuego: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2s-5 5.5-5 10a5 5 0 0010 0c0-1.5-.7-2.7-1.4-3.8.3 2-1 3-1.9 2.2.8-2-.2-4.6-1.7-8.4z"/></svg>`,
  reloj: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
  alerta: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L2.4 18a1.8 1.8 0 001.6 2.7h16a1.8 1.8 0 001.6-2.7L13.7 3.9a1.8 1.8 0 00-3.4 0z"/></svg>`,
  cerveza: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h9v11a2 2 0 01-2 2H8a2 2 0 01-2-2z"/><path d="M15 10h2a2 2 0 012 2v3a2 2 0 01-2 2h-2"/><path d="M6 8c0-2.5.5-4 1-5.5M9 8c.3-2 .6-3.5.3-5.5M12 8c.4-2 .2-3.5-.3-5.5"/></svg>`,
  burger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 10h16a1 1 0 011 1 5 5 0 01-5 5H8a5 5 0 01-5-5 1 1 0 011-1z"/><path d="M5 10a7 7 0 0114 0M4 18h16"/><path d="M6 14h12"/></svg>`,
  pizza: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2C6 8 3 14 3 14l9 8 9-8s-3-6-9-12z"/><circle cx="12" cy="10" r=".8" fill="currentColor"/><circle cx="9" cy="13" r=".8" fill="currentColor"/><circle cx="15" cy="13" r=".8" fill="currentColor"/></svg>`,
  wings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4c4 1 6 4 6 8s-2 8-4 8"/><path d="M19 4c-4 1-6 4-6 8s2 8 4 8"/></svg>`,
  plate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/></svg>`,
  soda: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 8l1 12a1 1 0 001 1h6a1 1 0 001-1l1-12z"/><path d="M6 8h12l-1.3-4H7.3z"/></svg>`,
  dessert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h16M6 20c0-5 2-8 6-8s6 3 6 8"/><path d="M12 12V6M9 6a3 3 0 016 0"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M15 19l-7-7 7-7"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>`,
  papas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 10V5a1 1 0 012 0v5M11 10V4a1 1 0 012 0v6M15 10V5a1 1 0 012 0v5"/><path d="M6 10h14l-1.4 9.2a2 2 0 01-2 1.8H9.4a2 2 0 01-2-1.8z"/></svg>`,
  coctel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4h16l-8 9-8-9z"/><path d="M12 13v7M8 20h8"/><path d="M8.5 6.5h7"/></svg>`,
  efectivo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01M18 15v.01"/></svg>`,
  qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01"/></svg>`,
  caja: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 10l2-5h14l2 5"/><path d="M3 10v9a1 1 0 001 1h16a1 1 0 001-1v-9"/><path d="M3 10h18M9 14a3 3 0 006 0"/></svg>`,
  mesero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="6" r="3"/><path d="M6 21v-2a6 6 0 0112 0v2"/><path d="M9 13l3-2 3 2"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 3l18 18"/><path d="M10.6 5.2A10.6 10.6 0 0112 5c6.4 0 10 7 10 7a17.7 17.7 0 01-3.4 4.4M6.6 6.6C4 8.3 2 12 2 12s3.6 7 10 7c1.4 0 2.6-.3 3.7-.8"/><path d="M9.5 9.5a3 3 0 004.2 4.2"/></svg>`,
  usuario: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6"/></svg>`,
  candado: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M7.5 10.5V7a4.5 4.5 0 019 0v3.5"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M15 19l-7-7 7-7"/></svg>`,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <span
      className={`inline-flex ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }}
    />
  );
}
