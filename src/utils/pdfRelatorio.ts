import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FiltroPeriodoCobranca } from '../services/cobrancas';

export type LinhaRelatorio = {
  nome: string;
  data: string;
  descricao: string;
  valor: number;
  /** Mensalidade / Obrigação / Outros */
  tipo?: string | null;
};

function tituloPeriodo(f: FiltroPeriodoCobranca | null): string {
  if (f?.de && f?.ate) return `Período: ${f.de} até ${f.ate}`;
  return 'Período: todos';
}

function labelTipo(t: string | null | undefined): string {
  if (t === 'mensalidade') return 'Mensalidade';
  if (t === 'obrigacao') return 'Obrigação';
  if (t === 'outros') return 'Outros';
  return t?.trim() ? String(t) : '—';
}

export type PdfRelatorioOpcoes = {
  periodo: FiltroPeriodoCobranca | null;
  linhas: LinhaRelatorio[];
  total: number;
  tituloPrincipal?: string;
  subtitulo?: string;
};

/**
 * Gera PDF de cobranças pendentes com coluna de tipo e totais em R$ (pt-BR).
 */
export function gerarPdfRelatorio(opcoes: PdfRelatorioOpcoes): void {
  const { periodo, linhas, total, tituloPrincipal, subtitulo } = opcoes;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const titulo = tituloPrincipal ?? 'Relatório — cobranças pendentes (saldo em aberto)';
  let y = 18;
  doc.setFontSize(14);
  doc.text(titulo, 14, y);
  y += 8;
  doc.setFontSize(10);
  doc.text(tituloPeriodo(periodo), 14, y);
  y += 6;
  if (subtitulo) {
    doc.text(subtitulo, 14, y);
    y += 6;
  }
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 14, y);
  y += 10;

  const body = linhas.map((l) => [
    l.nome,
    l.data,
    labelTipo(l.tipo),
    l.descricao,
    `R$ ${l.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Nome', 'Data venc.', 'Tipo', 'Descrição', 'Valor (saldo)']],
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [94, 23, 40] },
  });

  const d = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  const finalY = d.lastAutoTable?.finalY ?? 200;
  doc.setFontSize(11);
  doc.text(
    `Total devido: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    14,
    finalY + 10,
  );

  doc.save(`relatorio-cobrancas-${Date.now()}.pdf`);
}
