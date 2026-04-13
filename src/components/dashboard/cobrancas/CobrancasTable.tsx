import type { CobrancaComMembro } from '../../../services/cobrancas';
import { CobrancaRow } from './CobrancaRow';

type Props = {
  rows: CobrancaComMembro[];
  onEdit: (c: CobrancaComMembro) => void;
  onDelete: (c: CobrancaComMembro) => void;
  onRefresh: () => void;
};

export function CobrancasTable({ rows, onEdit, onDelete, onRefresh }: Props) {
  if (rows.length === 0) {
    return <p className="dash-muted">Nenhuma cobrança encontrada.</p>;
  }
  return (
    <div className="dash-table-scroll">
      <table className="dash-table dash-table--cobrancas">
        <thead>
          <tr>
            <th>Criação</th>
            <th>Vencimento</th>
            <th>Membro</th>
            <th>Tipo</th>
            <th>Valores</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <CobrancaRow key={String(c.id)} cobranca={c} onEdit={onEdit} onDelete={onDelete} onRefresh={onRefresh} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
