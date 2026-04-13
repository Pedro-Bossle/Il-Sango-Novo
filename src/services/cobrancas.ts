import { supabase } from '../lib/supabaseClient';
import type { Cobranca, CobrancaTipo, PagamentoHistorico, Pessoa, UUID } from '../types/database';
import { resolvePessoaIdCobranca } from '../types/database';

export type CobrancaComMembro = Cobranca & { membro_nome: string };

const COBRANCA_SELECT =
  'id, valor, valor_total, valor_pago, valor_saldo, tipo, vencimento, descricao, membro, membro_id, pessoa_id, created_at';

function mapNomePessoa(pessoas: Pessoa[]): Map<string, string> {
  return new Map(pessoas.map((p) => [p.id, p.nome]));
}

export function valorTotalCobranca(c: Cobranca): number {
  const v = c.valor_total ?? c.valor;
  return Number(v ?? 0);
}

export function valorPagoCobranca(c: Cobranca): number {
  return Number(c.valor_pago ?? 0);
}

/** Saldo em aberto (considera coluna gerada ou total − pago). */
export function valorSaldoCobranca(c: Cobranca): number {
  if (c.valor_saldo != null && c.valor_saldo !== '') {
    const s = Number(c.valor_saldo);
    if (!Number.isNaN(s)) return Math.max(0, s);
  }
  const total = valorTotalCobranca(c);
  const pago = valorPagoCobranca(c);
  return Math.max(0, total - pago);
}

/** Progresso 0–1 para obrigações (valor pago / total). */
export function progressoPagamentoObrigacao(c: Cobranca): number {
  const total = valorTotalCobranca(c);
  if (total <= 0) return 0;
  return Math.min(1, valorPagoCobranca(c) / total);
}

/** Vencimento passado e sem modelo novo de saldo (legado). */
function devendoSoPorVencimento(vencimento: string | null): boolean {
  if (!vencimento) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(vencimento);
  d.setHours(0, 0, 0, 0);
  return d < hoje;
}

export function isCobrancaPendente(c: Cobranca): boolean {
  if (c.valor_total == null && c.valor_saldo == null) {
    return devendoSoPorVencimento(c.vencimento);
  }
  return valorSaldoCobranca(c) > 0.0001;
}

export function isObrigacaoTipo(c: Cobranca): boolean {
  return c.tipo === 'obrigacao';
}

export function isMensalidadeTipo(c: Cobranca): boolean {
  return c.tipo === 'mensalidade';
}

export async function fetchCobrancasComMembros(): Promise<CobrancaComMembro[]> {
  const [{ data: cobrancas, error: e1 }, { data: pessoas, error: e2 }] = await Promise.all([
    supabase.from('cobrancas').select(COBRANCA_SELECT).order('vencimento', { ascending: true }),
    supabase.from('pessoas').select('id, nome'),
  ]);
  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);
  const nomes = mapNomePessoa((pessoas ?? []) as Pessoa[]);
  const rows = (cobrancas ?? []) as Cobranca[];
  return rows.map((c) => {
    const pid = resolvePessoaIdCobranca(c);
    const membro_nome = c.membro || (pid ? nomes.get(pid) : undefined) || 'Membro não informado';
    return { ...c, membro_nome };
  });
}

export function pessoaEstaDevendo(pessoaId: UUID, cobrancas: Cobranca[]): boolean {
  return cobrancas.some((c) => {
    const pid = resolvePessoaIdCobranca(c);
    return pid === pessoaId && isCobrancaPendente(c);
  });
}

export type CobrancaInput = {
  pessoa_id: UUID;
  membro_nome: string;
  valor: string | number;
  data: string | null;
  descricao: string | null;
  tipo: CobrancaTipo;
};

export async function insertCobranca(input: CobrancaInput): Promise<void> {
  const total = Number(input.valor);
  const payload: Record<string, unknown> = {
    pessoa_id: input.pessoa_id,
    membro: input.membro_nome,
    tipo: input.tipo,
    valor_total: total,
    valor_pago: 0,
    vencimento: input.data,
    descricao: input.descricao,
    valor: total,
  };
  const { error } = await supabase.from('cobrancas').insert(payload);
  if (error) {
    if (error.message.includes('membro_key')) {
      throw new Error(
        'A base ainda tem UNIQUE na coluna membro (só permite uma cobrança por nome). ' +
          'No Supabase, executa o script scripts/supabase_cobrancas_drop_unique_membro.sql para remover essa restrição.',
      );
    }
    throw new Error(error.message);
  }
}

export async function updateCobranca(id: string | number, input: CobrancaInput): Promise<void> {
  const total = Number(input.valor);
  const payload: Record<string, unknown> = {
    pessoa_id: input.pessoa_id,
    membro: input.membro_nome,
    tipo: input.tipo,
    valor_total: total,
    vencimento: input.data,
    descricao: input.descricao,
    valor: total,
  };
  const { error } = await supabase.from('cobrancas').update(payload).eq('id', id);
  if (error) {
    if (error.message.includes('membro_key')) {
      throw new Error(
        'A base ainda tem UNIQUE na coluna membro. Executa scripts/supabase_cobrancas_drop_unique_membro.sql no Supabase.',
      );
    }
    throw new Error(error.message);
  }
}

export async function deleteCobranca(id: string | number): Promise<void> {
  const { error } = await supabase.from('cobrancas').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function registrarPagamento(
  cobrancaId: string | number,
  pessoaId: UUID,
  valor: number,
  dataPagamento: string,
  obs?: string | null,
): Promise<void> {
  const { error } = await supabase.from('cobranca_pagamentos').insert({
    cobranca_id: Number(cobrancaId),
    pessoa_id: pessoaId,
    valor,
    data_pagamento: dataPagamento,
    obs: obs?.trim() ? obs.trim() : null,
  });
  if (error) throw new Error(error.message);
}

export async function buscarHistoricoPagamentos(cobrancaId: string | number): Promise<PagamentoHistorico[]> {
  const { data, error } = await supabase
    .from('cobranca_pagamentos')
    .select('id, cobranca_id, pessoa_id, valor, data_pagamento, obs, created_at')
    .eq('cobranca_id', Number(cobrancaId))
    .order('data_pagamento', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PagamentoHistorico[];
}

/** Filtro por intervalo de datas (aplicado após clicar em Filtrar). */
export type FiltroPeriodoCobranca = {
  de: string;
  ate: string;
};

export function filtroPeriodoVazio(): FiltroPeriodoCobranca {
  return { de: '', ate: '' };
}

export function filtroPeriodoAtivo(f: FiltroPeriodoCobranca): boolean {
  return Boolean(f.de && f.ate);
}

/** Data de referência: vencimento ou, se nulo, dia de created_at. */
function dataRefCobranca(c: Cobranca): string | null {
  if (c.vencimento) return c.vencimento.slice(0, 10);
  if (c.created_at) return c.created_at.slice(0, 10);
  return null;
}

export function cobrancaPassaFiltroIntervalo(c: Cobranca, f: FiltroPeriodoCobranca): boolean {
  if (!f.de || !f.ate) return true;
  const ref = dataRefCobranca(c);
  if (!ref) return false;
  return ref >= f.de && ref <= f.ate;
}
