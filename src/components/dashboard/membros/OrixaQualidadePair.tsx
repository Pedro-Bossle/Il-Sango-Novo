import { useEffect, useState } from 'react';
import { fetchQualidadesPorOrixa } from '../../../services/orixasQualidades';
import type { Orixa, Qualidade } from '../../../types/database';

type Props = {
  label: string;
  orixas: Orixa[];
  orixaId: string;
  qualidadeId: string;
  onOrixaChange: (id: string) => void;
  onQualidadeChange: (id: string) => void;
  /** Secção Orixás (B): reza por par. Omitir em Orumalé. */
  placeholderOrixaNome?: string;
  rezaValue?: string;
  onRezaChange?: (value: string) => void;
};

export function OrixaQualidadePair({
  label,
  orixas,
  orixaId,
  qualidadeId,
  onOrixaChange,
  onQualidadeChange,
  placeholderOrixaNome = '',
  rezaValue = '',
  onRezaChange,
}: Props) {
  const [qualidades, setQualidades] = useState<Qualidade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!orixaId) {
      setQualidades([]);
      return;
    }
    setLoading(true);
    fetchQualidadesPorOrixa(orixaId)
      .then((q) => {
        if (!cancelled) setQualidades(q);
      })
      .catch(() => {
        if (!cancelled) setQualidades([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orixaId]);

  const disabledQual = !orixaId || loading;

  return (
    <div className="dash-orixa-pair">
      <h3 className="dash-orixa-pair__label">{label}</h3>
      <div className="dash-form-grid dash-form-grid--pair">
        <label className="dash-field">
          <span>Orixá</span>
          <select value={orixaId} onChange={(e) => onOrixaChange(e.target.value)}>
            <option value="">—</option>
            {orixas.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="dash-field">
          <span>Qualidade</span>
          <select
            value={qualidadeId}
            disabled={disabledQual}
            onChange={(e) => onQualidadeChange(e.target.value)}
          >
            <option value="">{disabledQual && orixaId ? (loading ? 'Carregando…' : '—') : '—'}</option>
            {qualidades.map((q) => (
              <option key={q.id} value={q.id}>
                {q.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
      {onRezaChange && (
        <label className="dash-field dash-field--full dash-orixa-reza">
          <span>Reza</span>
          <textarea
            className="dash-orixa-reza__textarea"
            value={rezaValue}
            onChange={(e) => onRezaChange(e.target.value)}
            placeholder={`Digite a reza de ${placeholderOrixaNome}...`}
            rows={4}
          />
        </label>
      )}
    </div>
  );
}
