import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchPessoasLista, deletePessoa } from '../../../services/membros';
import {
  deleteCobranca,
  fetchCobrancasComMembros,
  pessoaEstaDevendo,
  updateCobranca,
  type CobrancaComMembro,
} from '../../../services/cobrancas';
import { fetchPessoasOptions } from '../../../services/pessoasLookup';
import type { UUID } from '../../../types/database';
import { resolvePessoaIdCobranca } from '../../../types/database';
import { useMemberForm } from '../../../hooks/useMemberForm';
import { Toast } from '../Toast';
import { PessoaisSection } from './PessoaisSection';
import { OrixasSection } from './OrixasSection';
import { OrumaleSection } from './OrumaleSection';
import { ExusSection } from './ExusSection';
import { UmbandaSection } from './UmbandaSection';
import { CobrancaForm, type CobrancaFormValues } from '../cobrancas/CobrancaForm';
import { CobrancasReadOnlySummary } from './CobrancasReadOnlySummary';
import type { PessoaListaItem } from '../../../services/membros';

const BUSCA_MEMBROS_PLACEHOLDER = 'Pesquisar por nome, orisá de cabeça ou telefone';

type View = 'list' | 'form';

export function MembrosScreen() {
  const [view, setView] = useState<View>('list');
  const [editId, setEditId] = useState<UUID | null>(null);
  const [lista, setLista] = useState<PessoaListaItem[]>([]);
  const [cobrancas, setCobrancas] = useState<CobrancaComMembro[]>([]);
  const [cobrancaFormOpen, setCobrancaFormOpen] = useState(false);
  const [cobrancaEditing, setCobrancaEditing] = useState<CobrancaComMembro | null>(null);
  const [cobrancaDelete, setCobrancaDelete] = useState<CobrancaComMembro | null>(null);
  const [loadingLista, setLoadingLista] = useState(true);
  const [toast, setToast] = useState<{ msg: string; variant: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UUID | null>(null);
  const [busca, setBusca] = useState('');

  const reloadAll = useCallback(async () => {
    setLoadingLista(true);
    try {
      const [p, c] = await Promise.all([fetchPessoasLista(), fetchCobrancasComMembros()]);
      setLista(p);
      setCobrancas(c);
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'Erro ao carregar membros.', variant: 'error' });
    } finally {
      setLoadingLista(false);
    }
  }, []);

  const salvarCobrancaPerfil = async (values: CobrancaFormValues) => {
    if (!cobrancaEditing) return;
    const opts = await fetchPessoasOptions();
    const p = opts.find((x) => x.id === values.pessoa_id);
    const nome = p?.nome ?? '';
    if (!nome) {
      setToast({ msg: 'Membro não encontrado.', variant: 'error' });
      return;
    }
    await updateCobranca(cobrancaEditing.id, {
      pessoa_id: values.pessoa_id,
      membro_nome: nome,
      valor: values.valor,
      data: values.data,
      descricao: values.descricao || null,
      tipo: values.tipo,
    });
    setToast({ msg: 'Cobrança atualizada.', variant: 'success' });
    await reloadAll();
    setCobrancaEditing(null);
  };

  const confirmDeleteCobranca = async () => {
    if (!cobrancaDelete) return;
    try {
      await deleteCobranca(cobrancaDelete.id);
      setCobrancaDelete(null);
      setToast({ msg: 'Cobrança excluída.', variant: 'success' });
      await reloadAll();
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'Erro ao excluir.', variant: 'error' });
    }
  };

  useEffect(() => {
    reloadAll();
  }, [reloadAll]);

  const afterSave = useCallback(async () => {
    await reloadAll();
    setView('list');
    setEditId(null);
    setToast({ msg: 'Membro salvo com sucesso', variant: 'success' });
  }, [reloadAll]);

  const form = useMemberForm(editId, afterSave);

  const cobrancasDoPerfil = useMemo(() => {
    if (!editId) return [];
    return cobrancas.filter((c) => String(resolvePessoaIdCobranca(c)) === String(editId));
  }, [cobrancas, editId]);

  const listaFiltrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter((m) => `${m.nome} ${m.contato ?? ''} ${m.orixa_cabeca_nome ?? ''}`.toLowerCase().includes(q));
  }, [lista, busca]);

  const openCreate = () => {
    setEditId(null);
    setView('form');
  };

  const openEdit = (id: UUID) => {
    setEditId(id);
    setView('form');
  };

  const backToList = () => {
    setView('list');
    setEditId(null);
    form.setError(null);
    setCobrancaFormOpen(false);
    setCobrancaEditing(null);
    setCobrancaDelete(null);
  };

  const handleDelete = async (id: UUID) => {
    try {
      await deletePessoa(id);
      setDeleteConfirm(null);
      await reloadAll();
      setToast({ msg: 'Membro excluído.', variant: 'success' });
    } catch (e) {
      setToast({ msg: e instanceof Error ? e.message : 'Não foi possível excluir.', variant: 'error' });
    }
  };

  const handlePessoaisChange = (
    field: 'nome' | 'dataNascimento' | 'contato' | 'email' | 'signo' | 'obs',
    value: string,
  ) => {
    if (field === 'nome') form.setNome(value);
    if (field === 'dataNascimento') form.setDataNascimento(value);
    if (field === 'contato') form.setContato(value);
    if (field === 'email') form.setEmail(value);
    if (field === 'signo') form.setSigno(value);
    if (field === 'obs') form.setObs(value);
  };

  if (view === 'form') {
    return (
      <>
        <Toast message={toast?.msg ?? null} variant={toast?.variant} onDismiss={() => setToast(null)} />
        <div className="dash-split-main">
          <div className="dash-split-main__bar">
            <button type="button" className="dash-btn-secondary" onClick={backToList}>
              ← Voltar à lista
            </button>
            <h1 className="dash-split-main__title">{editId ? 'Editar membro' : 'Novo membro'}</h1>
            {editId && (
              <button type="button" className="dash-btn-danger-outline" onClick={() => setDeleteConfirm(editId)}>
                Excluir membro
              </button>
            )}
          </div>

          {form.error && <p className="dash-error">{form.error}</p>}
          {form.loadingMeta || form.loadingPessoa ? (
            <p>Carregando formulário…</p>
          ) : (
            <form
              className="dash-member-form"
              onSubmit={(e) => {
                e.preventDefault();
                void form.submit();
              }}
            >
              <PessoaisSection
                nome={form.nome}
                dataNascimento={form.dataNascimento}
                contato={form.contato}
                email={form.email}
                signo={form.signo}
                obs={form.obs}
                onChange={handlePessoaisChange}
              />
              <OrixasSection orixas={form.orixas} cadastro={form.cadastro} setCadastroField={form.setCadastroField} />
              <OrumaleSection
                orixas={form.orixas}
                rows={form.orumale}
                addRow={form.addOrumale}
                removeRow={form.removeOrumale}
                updateRow={form.updateOrumale}
              />
              <ExusSection
                rows={form.exus}
                addRow={form.addExu}
                removeRow={form.removeExu}
                updateRow={form.updateExu}
              />
              <UmbandaSection
                rows={form.umbanda}
                addRow={form.addUmbanda}
                removeRow={form.removeUmbanda}
                updateRow={form.updateUmbanda}
              />
              {editId && (
                <CobrancasReadOnlySummary
                  cobrancas={cobrancasDoPerfil}
                  onEdit={(c) => {
                    setCobrancaEditing(c);
                    setCobrancaFormOpen(true);
                  }}
                  onDelete={setCobrancaDelete}
                />
              )}
              <div className="dash-form-actions">
                <button type="button" className="dash-btn-secondary" onClick={backToList}>
                  Cancelar
                </button>
                <button type="submit" className="dash-btn-primary" disabled={form.saving}>
                  {form.saving ? 'Salvando…' : 'Salvar membro'}
                </button>
              </div>
            </form>
          )}
        </div>

        <CobrancaForm
          open={cobrancaFormOpen}
          initial={cobrancaEditing}
          onClose={() => {
            setCobrancaFormOpen(false);
            setCobrancaEditing(null);
          }}
          onSave={salvarCobrancaPerfil}
        />

        {cobrancaDelete && (
          <div className="dash-modal-overlay" role="dialog" aria-modal="true">
            <div className="dash-modal dash-modal--narrow">
              <h2>Excluir cobrança?</h2>
              <p>Esta ação não pode ser desfeita.</p>
              <div className="dash-form-actions">
                <button type="button" className="dash-btn-secondary" onClick={() => setCobrancaDelete(null)}>
                  Cancelar
                </button>
                <button type="button" className="dash-btn-danger" onClick={() => void confirmDeleteCobranca()}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="dash-modal-overlay" role="dialog" aria-modal="true">
            <div className="dash-modal dash-modal--narrow">
              <h2>Excluir membro?</h2>
              <p>Esta ação não pode ser desfeita.</p>
              <div className="dash-form-actions">
                <button type="button" className="dash-btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </button>
                <button type="button" className="dash-btn-danger" onClick={() => void handleDelete(deleteConfirm)}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Toast message={toast?.msg ?? null} variant={toast?.variant} onDismiss={() => setToast(null)} />
      <h1>Membros</h1>
      <div className="dash-section-header">
        <div className="dash-filtros">
          <input
            placeholder={BUSCA_MEMBROS_PLACEHOLDER}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label={BUSCA_MEMBROS_PLACEHOLDER}
          />
        </div>
        <button type="button" className="dash-add-button" onClick={openCreate}>
          Adicionar membro
        </button>
      </div>

      <div className="dash-filtros-mobile">
        <input
          placeholder={BUSCA_MEMBROS_PLACEHOLDER}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label={BUSCA_MEMBROS_PLACEHOLDER}
        />
      </div>

      {loadingLista ? (
        <p>Carregando…</p>
      ) : (
        <div className="dash-table-scroll">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Membro</th>
                <th>Telefone</th>
                <th>Orisá cabeça</th>
                <th>Situação</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {listaFiltrada.map((m) => {
                const devendo = pessoaEstaDevendo(m.id, cobrancas);
                return (
                  <tr key={m.id}>
                    <td>{m.nome}</td>
                    <td>{m.contato || '—'}</td>
                    <td>{m.orixa_cabeca_nome || '—'}</td>
                    <td>
                      <span className={`dash-badge ${devendo ? 'dash-badge--devendo' : 'dash-badge--ok'}`}>
                        {devendo ? 'Devendo' : 'Em dia'}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="dash-btn-table" onClick={() => openEdit(m.id)}>
                        Ver perfil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
