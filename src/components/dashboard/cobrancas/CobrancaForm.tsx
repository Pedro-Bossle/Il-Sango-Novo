import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchPessoasOptions, type PessoaOption } from '../../../services/pessoasLookup';
import type { CobrancaComMembro } from '../../../services/cobrancas';
import { resolvePessoaIdCobranca, type CobrancaTipo, type UUID } from '../../../types/database';

export type CobrancaFormValues = {
  pessoa_id: UUID;
  data: string;
  valor: string;
  descricao: string;
  tipo: CobrancaTipo;
};

const emptyValues = (): CobrancaFormValues => ({
  pessoa_id: '',
  data: '',
  valor: '',
  descricao: '',
  tipo: 'obrigacao',
});

type Props = {
  open: boolean;
  initial: CobrancaComMembro | null;
  onClose: () => void;
  onSave: (values: CobrancaFormValues) => Promise<void>;
};

export function CobrancaForm({ open, initial, onClose, onSave }: Props) {
  const [pessoas, setPessoas] = useState<PessoaOption[]>([]);
  const [search, setSearch] = useState('');
  const [values, setValues] = useState<CobrancaFormValues>(emptyValues);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetchPessoasOptions()
      .then((p) => {
        if (!cancelled) setPessoas(p);
      })
      .catch(() => {
        if (!cancelled) setPessoas([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      const pid = (resolvePessoaIdCobranca(initial) ?? '') as UUID;
      const tipoRaw = initial.tipo;
      const tiposValidos: CobrancaTipo[] = ['mensalidade', 'obrigacao', 'outros'];
      const tipo: CobrancaTipo = tiposValidos.includes(tipoRaw as CobrancaTipo)
        ? (tipoRaw as CobrancaTipo)
        : 'obrigacao';
      setValues({
        pessoa_id: pid,
        data: initial.vencimento ?? '',
        valor: String(initial.valor_total ?? initial.valor ?? ''),
        descricao: initial.descricao ?? '',
        tipo,
      });
    } else {
      setValues(emptyValues());
    }
    setSearch('');
  }, [open, initial]);

  const nomeSelecionado = useMemo(() => {
    const p = pessoas.find((x) => x.id === values.pessoa_id);
    return p?.nome ?? '';
  }, [pessoas, values.pessoa_id]);

  const filtradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return pessoas.filter((p) => p.nome.toLowerCase().includes(q)).slice(0, 80);
  }, [pessoas, search]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.pessoa_id || !values.data) return;
    setSaving(true);
    try {
      await onSave(values);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="dash-panel-backdrop" onClick={onClose} aria-hidden />
      <aside className="dash-panel-slide" role="dialog" aria-labelledby="cobranca-form-title">
        <div className="dash-panel-slide__inner">
          <h2 id="cobranca-form-title">{initial ? 'Editar cobrança' : 'Nova cobrança'}</h2>
          <form className="dash-member-form" onSubmit={(e) => void submit(e)}>
            <label className="dash-field">
              <span>Membro</span>
              <div className="dash-search-select">
                <input
                  type="text"
                  placeholder="Pesquisar por nome…"
                  value={dropdownOpen ? search : nomeSelecionado || search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDropdownOpen(true);
                  }}
                  onFocus={() => setDropdownOpen(true)}
                  autoComplete="off"
                />
                {dropdownOpen && search.trim() && (
                  <ul className="dash-search-select__list">
                    {filtradas.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="dash-search-select__opt"
                          onClick={() => {
                            setValues((v) => ({ ...v, pessoa_id: p.id }));
                            setSearch('');
                            setDropdownOpen(false);
                          }}
                        >
                          {p.nome}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {!values.pessoa_id && <span className="dash-hint">Selecione um membro na lista.</span>}
            </label>

            <label className="dash-field">
              <span>Tipo</span>
              <select
                value={values.tipo}
                onChange={(e) => setValues((v) => ({ ...v, tipo: e.target.value as CobrancaTipo }))}
              >
                <option value="obrigacao">Obrigação</option>
                <option value="mensalidade">Mensalidade</option>
                <option value="outros">Outros</option>
              </select>
            </label>

            <label className="dash-field">
              <span>Data</span>
              <input
                type="date"
                required
                value={values.data}
                onChange={(e) => setValues((v) => ({ ...v, data: e.target.value }))}
              />
            </label>

            <label className="dash-field">
              <span>Cobrança (valor total)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={values.valor}
                onChange={(e) => setValues((v) => ({ ...v, valor: e.target.value }))}
              />
            </label>

            <label className="dash-field dash-field--full">
              <span>Descrição</span>
              <textarea
                rows={4}
                value={values.descricao}
                onChange={(e) => setValues((v) => ({ ...v, descricao: e.target.value }))}
              />
            </label>

            <div className="dash-form-actions">
              <button type="button" className="dash-btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="dash-btn-primary" disabled={saving || !values.pessoa_id}>
                {saving ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  );
}
