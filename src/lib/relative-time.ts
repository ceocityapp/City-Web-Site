export function relativeTime(dateStr: string | Date): string {
  const now = new Date();
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 5) return "ahora";
  if (seconds < 60) return `hace ${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `hace ${weeks}sem`;

  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months}mes`;

  const years = Math.floor(days / 365);
  return `hace ${years}a`;
}

export function formatDateSpanish(dateStr: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("es-ES", opts || { day: "numeric", month: "long", year: "numeric" });
}
