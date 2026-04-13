import type { Orixa } from '../../../types/database';
import type { OrumaleFormRow } from '../../../hooks/useMemberForm';
import { OrixaQualidadePair } from './OrixaQualidadePair';

type Props = {
  orixas: Orixa[];
  rows: OrumaleFormRow[];
  addRow: () => void;
  removeRow: (key: string) => void;
  updateRow: (key: string, patch: Partial<OrumaleFormRow>) => void;
};

export function OrumaleSection({ orixas, rows, addRow, removeRow, updateRow }: Props) {
  return (
    <section className="dash-form-section">
      <div className="dash-form-section__head">
        <h2 className="dash-form-section__title">Orumalé</h2>
        <button type="button" className="dash-btn-secondary dash-btn-min" onClick={addRow}>
          Adicionar Orumalé
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
          <OrixaQualidadePair
            label="Orixá e qualidade"
            orixas={orixas}
            orixaId={row.orixa_id}
            qualidadeId={row.qualidade_id}
            onOrixaChange={(id) => updateRow(row.key, { orixa_id: id, qualidade_id: '' })}
            onQualidadeChange={(id) => updateRow(row.key, { qualidade_id: id })}
          />
          <div className="dash-form-grid">
            <label className="dash-field">
              <span>Digina</span>
              <input
                type="text"
                value={row.digina}
                onChange={(e) => updateRow(row.key, { digina: e.target.value })}
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
