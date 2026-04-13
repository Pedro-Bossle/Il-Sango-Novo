import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FiltroPeriodoCobranca } from '../services/cobrancas';

export type LinhaRelatorio = {
  nome: string;
  data: string;
  descricao: string;
  valor: number;
};

function tituloPeriodo(f: FiltroPeriodoCobranca | null): string {
  if (f?.de && f?.ate) return `Período: ${f.de} até ${f.ate}`;
  return 'Período: todos';
}

export function gerarPdfRelatorio(
  periodo: FiltroPeriodoCobranca | null,
  linhas: LinhaRelatorio[],
  total: number,
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFontSize(14);
  doc.text('Relatório — cobranças pendentes (saldo em aberto)', 14, 18);
  doc.setFontSize(10);
  doc.text(tituloPeriodo(periodo), 14, 26);
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, 14, 32);

  const body = linhas.map((l) => [l.nome, l.data, l.descricao, `R$ ${l.valor.toFixed(2)}`]);

  autoTable(doc, {
    startY: 38,
    head: [['Nome', 'Data', 'Descrição', 'Valor (saldo)']],
    body,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [94, 23, 40] },
  });

  const d = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  const finalY = d.lastAutoTable?.finalY ?? 200;
  doc.setFontSize(11);
  doc.text(`Total devido: R$ ${total.toFixed(2)}`, 14, finalY + 10);

  doc.save(`relatorio-cobrancas-${Date.now()}.pdf`);
}
