import type { ExuFormRow } from '../../../hooks/useMemberForm';

type Props = {
  rows: ExuFormRow[];
  addRow: () => void;
  removeRow: (key: string) => void;
  updateRow: (key: string, patch: Partial<ExuFormRow>) => void;
};

export function ExusSection({ rows, addRow, removeRow, updateRow }: Props) {
  return (
    <section className="dash-form-section">
      <div className="dash-form-section__head">
        <h2 className="dash-form-section__title">Exus</h2>
        <button type="button" className="dash-btn-secondary dash-btn-min" onClick={addRow}>
          Adicionar Exu
        </button>
      </div>
      {rows.length === 0 && <p className="dash-muted">Nenhum registro. Use o botão acima para adicionar.</p>}
      {rows.map((row) => (
        <div key={row.key} className="dash-dynamic-block">
          <div className="dash-dynamic-block__toolbar">
            <button
              type="button"
              className="dash-icon-remove"
              aria-label="Remover linha"
              onClick={() => removeRow(row.key)}
            >
              ×
            </button>
          </div>
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Exu nome</span>
              <input
                type="text"
                value={row.exu_nome}
                onChange={(e) => updateRow(row.key, { exu_nome: e.target.value })}
              />
            </label>
            <label className="dash-field">
              <span>Exu ordem</span>
              <input
                type="number"
                min={1}
                value={row.exu_ordem}
                onChange={(e) => updateRow(row.key, { exu_ordem: Number(e.target.value) || 1 })}
              />
            </label>
            <label className="dash-field">
              <span>Data feitura</span>
              <input
                type="date"
                value={row.data_feitura}
                onChange={(e) => updateRow(row.key, { data_feitura: e.target.value })}
              />
            </label>
          </div>
        </div>
      ))}
    </section>
  );
}
