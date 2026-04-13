import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  cobrancaPassaFiltroIntervalo,
  deleteCobranca,
  fetchCobrancasComMembros,
  filtroPeriodoVazio,
  insertCobranca,
  isCobrancaPendente,
  updateCobranca,
  valorSaldoCobranca,
  type CobrancaComMembro,
  type FiltroPeriodoCobranca,
} from '../../../services/cobrancas';
import { fetchPessoasOptions } from '../../../services/pessoasLookup';
import { gerarPdfRelatorio } from '../../../utils/pdfRelatorio';
import { Toast } from '../Toast';
import { CobrancaForm, type CobrancaFormValues } from './CobrancaForm';
import { CobrancasTable } from './CobrancasTable';

export function CobrancasScreen() {
  const [rows, setRows] = useState<CobrancaComMembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [rascunhoPeriodo, setRascunhoPeriodo] = useState<FiltroPeriodoCobranca>(filtroPeriodoVazio);
  const [periodoAplicado, setPeriodoAplicado] = useState<FiltroPeriodoCobranca | null>(null);
  const [toast, setToast] = useState<{ msg: string; variant: 'success' | 'error' } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CobrancaComMembro | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CobrancaComMembro | null>(null);
  const [buscaMembro, setBuscaMembro] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCobrancasComMembros();
      setRows(data);
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'Erro ao carregar cobranças.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => {
    let list = rows;
    if (periodoAplicado?.de && periodoAplicado?.ate) {
      list = list.filter((c) => cobrancaPassaFiltroIntervalo(c, periodoAplicado));
    }
    const q = buscaMembro.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const nome = (c.membro_nome || c.membro || '').toLowerCase();
        return nome.includes(q);
      });
    }
    return list;
  }, [rows, periodoAplicado, buscaMembro]);

  const aplicarFiltro = () => {
    const { de, ate } = rascunhoPeriodo;
    if (!de || !ate) {
      setToast({ msg: 'Preencha data inicial e final.', variant: 'error' });
      return;
    }
    if (de > ate) {
      setToast({ msg: 'A data inicial não pode ser maior que a final.', variant: 'error' });
      return;
    }
    setPeriodoAplicado({ de, ate });
  };

  const limparFiltros = () => {
    setRascunhoPeriodo(filtroPeriodoVazio());
    setPeriodoAplicado(null);
    setBuscaMembro('');
  };

  const openNovo = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (c: CobrancaComMembro) => {
    setEditing(c);
    setFormOpen(true);
  };

  const salvar = async (values: CobrancaFormValues) => {
    const opts = await fetchPessoasOptions();
    const p = opts.find((x) => x.id === values.pessoa_id);
    const nome = p?.nome ?? '';
    if (!nome) {
      setToast({ msg: 'Membro não encontrado.', variant: 'error' });
      return;
    }
    if (editing) {
      await updateCobranca(editing.id, {
        pessoa_id: values.pessoa_id,
        membro_nome: nome,
        valor: values.valor,
        data: values.data,
        descricao: values.descricao || null,
        tipo: values.tipo,
      });
      setToast({ msg: 'Cobrança atualizada.', variant: 'success' });
    } else {
      await insertCobranca({
        pessoa_id: values.pessoa_id,
        membro_nome: nome,
        valor: values.valor,
        data: values.data,
        descricao: values.descricao || null,
        tipo: values.tipo,
      });
      setToast({ msg: 'Cobrança criada.', variant: 'success' });
    }
    await reload();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCobranca(deleteTarget.id);
      setDeleteTarget(null);
      setToast({ msg: 'Cobrança excluída.', variant: 'success' });
      await reload();
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'Erro ao excluir.', variant: 'error' });
    }
  };

  const gerarRelatorio = () => {
    if (!periodoAplicado?.de || !periodoAplicado?.ate) {
      setToast({ msg: 'Aplique um período (De / Até) antes de gerar o relatório.', variant: 'error' });
      return;
    }
    const base = rows.filter((c) => cobrancaPassaFiltroIntervalo(c, periodoAplicado));
    const pendentes = base.filter((c) => isCobrancaPendente(c));
    const linhas = pendentes.map((c) => ({
      nome: c.membro_nome,
      data: c.vencimento || c.created_at?.slice(0, 10) || '—',
      descricao: c.descricao || '—',
      valor: valorSaldoCobranca(c),
    }));
    const total = linhas.reduce((a, b) => a + b.valor, 0);
    gerarPdfRelatorio(periodoAplicado, linhas, total);
  };

  return (
    <>
      <Toast message={toast?.msg ?? null} variant={toast?.variant} onDismiss={() => setToast(null)} />
      <h1>Cobranças</h1>

      <div className="dash-filter-bar dash-filter-bar--periodo">
        <label className="dash-field dash-field--busca-membro">
          <span>Pesquisar por membro</span>
          <input
            type="search"
            placeholder="Digite o nome…"
            value={buscaMembro}
            onChange={(e) => setBuscaMembro(e.target.value)}
            autoComplete="off"
            aria-label="Pesquisar cobranças por nome do membro"
          />
        </label>
        <div className="dash-date-range">
          <label className="dash-field dash-field--inline">
            <span>De:</span>
            <input
              type="date"
              value={rascunhoPeriodo.de}
              onChange={(e) => setRascunhoPeriodo((p) => ({ ...p, de: e.target.value }))}
            />
          </label>
          <span className="dash-date-range__ate" aria-hidden>
            até
          </span>
          <label className="dash-field dash-field--inline">
            <span>Até:</span>
            <input
              type="date"
              value={rascunhoPeriodo.ate}
              onChange={(e) => setRascunhoPeriodo((p) => ({ ...p, ate: e.target.value }))}
            />
          </label>
        </div>
        <div className="dash-filter-bar__actions">
          <button type="button" className="dash-btn-primary" onClick={aplicarFiltro}>
            Filtrar
          </button>
          <button type="button" className="dash-btn-secondary" onClick={limparFiltros}>
            Limpar
          </button>
          {periodoAplicado?.de && periodoAplicado?.ate && (
            <button type="button" className="dash-btn-primary" onClick={gerarRelatorio}>
              Gerar relatório
            </button>
          )}
        </div>
      </div>

      <div className="dash-section-header">
        <p className="dash-muted">
          {periodoAplicado?.de && periodoAplicado?.ate
            ? `A mostrar cobranças com vencimento entre ${periodoAplicado.de} e ${periodoAplicado.ate}.`
            : 'Sem filtro de período — a mostrar todas as cobranças.'}{' '}
          {buscaMembro.trim()
            ? `Pesquisa ativa por nome (“${buscaMembro.trim()}”).`
            : null}
        </p>
        <button type="button" className="dash-add-button" onClick={openNovo}>
          Nova cobrança
        </button>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <CobrancasTable rows={filtered} onEdit={openEdit} onDelete={setDeleteTarget} onRefresh={reload} />
      )}

      <CobrancaForm open={formOpen} initial={editing} onClose={() => setFormOpen(false)} onSave={salvar} />

      {deleteTarget && (
        <div className="dash-modal-overlay" role="dialog" aria-modal="true">
          <div className="dash-modal dash-modal--narrow">
            <h2>Excluir cobrança?</h2>
            <p>Esta ação não pode ser desfeita.</p>
            <div className="dash-form-actions">
              <button type="button" className="dash-btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button type="button" className="dash-btn-danger" onClick={() => void confirmDelete()}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
