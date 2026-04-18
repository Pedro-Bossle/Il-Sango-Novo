/**
 * Formatação centralizada de datas para exibição na UI (padrão brasileiro).
 * Evita duplicar lógica e garante DD/MM/AAAA em todo o projeto.
 */
export const formatDateBR = (date: string | Date | null | undefined): string => {
  if (date == null || date === '') return '—';
  if (typeof date === 'string') {
    const trimmed = date.trim();
    // Datas ISO só com YYYY-MM-DD — evita desvio de fuso ao interpretar como UTC
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  }
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
