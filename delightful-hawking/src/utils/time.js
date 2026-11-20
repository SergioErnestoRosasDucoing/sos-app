export function formatTimeAgo(isoDate) {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return '';

  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days === 1) return 'Ayer';
  if (days < 7) return `Hace ${days} días`;
  if (weeks < 5) return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;

  return new Date(isoDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
