/** Envuelve un handler async para que sus errores lleguen al middleware de errores
 *  de Express en vez de tumbar el proceso (Express 4 no captura rechazos async). */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
