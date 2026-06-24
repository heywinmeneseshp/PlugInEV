export function formatCOP(price) {
  if (price === 0) return 'Gratis';
  return `$${price.toLocaleString('es-CO')}`;
}
