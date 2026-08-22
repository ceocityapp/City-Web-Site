/**
 * Format large numbers with k/M abbreviation
 * 1234 -> "1.234"
 * 12345 -> "12,3K"
 * 1234567 -> "1,2M"
 */
export function formatCount(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 10000) return n.toLocaleString("es-ES");
  if (n < 1000000) return (n / 1000).toFixed(1).replace(".", ",").replace(",0", "") + "K";
  return (n / 1000000).toFixed(1).replace(".", ",").replace(",0", "") + "M";
}

export function formatPrice(n: number, currency = "€"): string {
  return n.toFixed(2).replace(".", ",") + currency;
}
