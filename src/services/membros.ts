import { supabase } from '../lib/supabaseClient';
import type { CadastroOrixas, Exu, Orumale, Orixa, Pessoa, UUID } from '../types/database';

export type PessoaListaItem = Pessoa & {
  orixa_cabeca_nome: string | null;
};

export type PessoaCompleta = {
  pessoa: Pessoa;
  cadastro: CadastroOrixas | null;
  orumale: Orumale[];
  exus: Exu[];
};

export type MemberFormPayload = {
  pessoa: Omit<Pessoa, 'id'> & { id: UUID | null };
  cadastro: {
    orixa_cabeca_id: string;
    qualidade_cabeca_id: string;
    orixa_corpo_id: string;
    qualidade_corpo_id: string;
    orixa_caminho_id: string;
    qualidade_caminho_id: string;
    orixa_passagem_id: string;
    qualidade_passagem_id: string;
    orixa_cabeca_reza: string;
    orixa_corpo_reza: string;
    orixa_caminho_reza: string;
    orixa_passagem_reza: string;
  };
  orumale: Array<{
    orixa_id: string;
    qualidade_id: string;
    digina: string;
    data_feitura: string;
  }>;
  exus: Array<{
    exu_nome: string;
    exu_ordem: number;
    data_feitura: string;
  }>;
};

async function mapOrixaNomes(ids: (string | null)[]): Promise<Map<string, string>> {
  const clean = [...new Set(ids.filter(Boolean))] as string[];
  if (clean.length === 0) return new Map();
  const { data, error } = await supabase.from('orixas').select('id, nome').in('id', clean);
  if (error) throw new Error(error.message);
  return new Map((data as Orixa[]).map((o) => [o.id, o.nome]));
}

export async function fetchPessoasLista(): Promise<PessoaListaItem[]> {
  const { data: pessoas, error: e1 } = await supabase
    .from('pessoas')
    .select('id, nome, data_nascimento, contato, email, signo, obs')
    .order('nome', { ascending: true });
  if (e1) throw new Error(e1.message);
  const list = (pessoas ?? []) as Pessoa[];
  if (list.length === 0) return [];

  const ids = list.map((p) => p.id);
  const { data: cadastros, error: e2 } = await supabase
    .from('cadastro_orixas')
    .select(
      'pessoa_id, orixa_cabeca_id, qualidade_cabeca_id, orixa_corpo_id, qualidade_corpo_id, orixa_caminho_id, qualidade_caminho_id, orixa_passagem_id, qualidade_passagem_id',
    )
    .in('pessoa_id', ids);
  if (e2) throw new Error(e2.message);
  const cabecaIds = (cadastros ?? []).map((c: { orixa_cabeca_id?: string | null }) => c.orixa_cabeca_id ?? null);
  const nomeMap = await mapOrixaNomes(cabecaIds);
  const cadByPessoa = new Map<string, { orixa_cabeca_id?: string | null }>();
  for (const c of cadastros ?? []) {
    const row = c as { pessoa_id: string; orixa_cabeca_id?: string | null };
    cadByPessoa.set(row.pessoa_id, row);
  }
  return list.map((p) => {
    const co = cadByPessoa.get(p.id);
    const oid = co?.orixa_cabeca_id ?? null;
    return {
      ...p,
      orixa_cabeca_nome: oid ? nomeMap.get(oid) ?? null : null,
    };
  });
}

export async function fetchPessoaCompleta(id: UUID): Promise<PessoaCompleta> {
  const [{ data: pessoa, error: e1 }, { data: cadastro, error: e2 }, { data: orumale, error: e3 }, { data: exus, error: e4 }] =
    await Promise.all([
      supabase.from('pessoas').select('id, nome, data_nascimento, contato, email, signo, obs').eq('id', id).maybeSingle(),
      supabase.from('cadastro_orixas').select('*').eq('pessoa_id', id).maybeSingle(),
      supabase.from('orumale').select('id, pessoa_id, orixa_id, qualidade_id, digina, data_feitura').eq('pessoa_id', id),
      supabase.from('exus').select('id, pessoa_id, exu_nome, exu_ordem, data_feitura').eq('pessoa_id', id).order('exu_ordem', { ascending: true }),
    ]);
  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);
  if (e3) throw new Error(e3.message);
  if (e4) throw new Error(e4.message);
  if (!pessoa) throw new Error('Pessoa não encontrada.');
  return {
    pessoa: pessoa as Pessoa,
    cadastro: (cadastro as CadastroOrixas | null) ?? null,
    orumale: (orumale ?? []) as Orumale[],
    exus: (exus ?? []) as Exu[],
  };
}

/** Aceita valores vindos do formulário ou do Supabase (null, número, etc.) */
function nullIfEmpty(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t.length ? t : null;
}

function hasText(v: unknown): boolean {
  return Boolean(nullIfEmpty(v));
}

export async function savePessoaCompleta(payload: MemberFormPayload): Promise<UUID> {
  const { pessoa, cadastro, orumale, exus } = payload;
  const pessoaRow = {
    nome: nullIfEmpty(pessoa.nome) ?? '',
    data_nascimento: nullIfEmpty(pessoa.data_nascimento),
    contato: nullIfEmpty(pessoa.contato),
    email: nullIfEmpty(pessoa.email),
    signo: nullIfEmpty(pessoa.signo),
    obs: nullIfEmpty(pessoa.obs),
  };

  let pessoaId = pessoa.id;

  if (pessoaId) {
    const { error } = await supabase.from('pessoas').update(pessoaRow).eq('id', pessoaId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from('pessoas').insert(pessoaRow).select('id').single();
    if (error) throw new Error(error.message);
    pessoaId = (data as { id: string }).id;
  }

  const temAlgumOrixa =
    hasText(cadastro.orixa_cabeca_id) ||
    hasText(cadastro.orixa_corpo_id) ||
    hasText(cadastro.orixa_caminho_id) ||
    hasText(cadastro.orixa_passagem_id);

  const temAlgumaReza =
    hasText(cadastro.orixa_cabeca_reza) ||
    hasText(cadastro.orixa_corpo_reza) ||
    hasText(cadastro.orixa_caminho_reza) ||
    hasText(cadastro.orixa_passagem_reza);

  const temCadastroOrixas = temAlgumOrixa || temAlgumaReza;

  await supabase.from('cadastro_orixas').delete().eq('pessoa_id', pessoaId);

  if (temCadastroOrixas) {
    const cadRow = {
      pessoa_id: pessoaId,
      orixa_cabeca_id: nullIfEmpty(cadastro.orixa_cabeca_id) as UUID | null,
      qualidade_cabeca_id: hasText(cadastro.orixa_cabeca_id)
        ? (nullIfEmpty(cadastro.qualidade_cabeca_id) as UUID | null)
        : null,
      orixa_corpo_id: nullIfEmpty(cadastro.orixa_corpo_id) as UUID | null,
      qualidade_corpo_id: hasText(cadastro.orixa_corpo_id)
        ? (nullIfEmpty(cadastro.qualidade_corpo_id) as UUID | null)
        : null,
      orixa_caminho_id: nullIfEmpty(cadastro.orixa_caminho_id) as UUID | null,
      qualidade_caminho_id: hasText(cadastro.orixa_caminho_id)
        ? (nullIfEmpty(cadastro.qualidade_caminho_id) as UUID | null)
        : null,
      orixa_passagem_id: nullIfEmpty(cadastro.orixa_passagem_id) as UUID | null,
      qualidade_passagem_id: hasText(cadastro.orixa_passagem_id)
        ? (nullIfEmpty(cadastro.qualidade_passagem_id) as UUID | null)
        : null,
      orixa_cabeca_reza: nullIfEmpty(cadastro.orixa_cabeca_reza),
      orixa_corpo_reza: nullIfEmpty(cadastro.orixa_corpo_reza),
      orixa_caminho_reza: nullIfEmpty(cadastro.orixa_caminho_reza),
      orixa_passagem_reza: nullIfEmpty(cadastro.orixa_passagem_reza),
    };
    const { error: upCad } = await supabase.from('cadastro_orixas').insert(cadRow);
    if (upCad) throw new Error(upCad.message);
  }

  const { error: delO } = await supabase.from('orumale').delete().eq('pessoa_id', pessoaId);
  if (delO) throw new Error(delO.message);
  for (const row of orumale) {
    if (!nullIfEmpty(row.orixa_id)) continue;
    const ins = {
      pessoa_id: pessoaId,
      orixa_id: row.orixa_id,
      qualidade_id: nullIfEmpty(row.qualidade_id) as UUID | null,
      digina: nullIfEmpty(row.digina),
      data_feitura: nullIfEmpty(row.data_feitura),
    };
    const { error: insE } = await supabase.from('orumale').insert(ins);
    if (insE) throw new Error(insE.message);
  }

  const { error: delX } = await supabase.from('exus').delete().eq('pessoa_id', pessoaId);
  if (delX) throw new Error(delX.message);
  for (const row of exus) {
    const ins = {
      pessoa_id: pessoaId,
      exu_nome: nullIfEmpty(row.exu_nome),
      exu_ordem: row.exu_ordem,
      data_feitura: nullIfEmpty(row.data_feitura),
    };
    const { error: insE } = await supabase.from('exus').insert(ins);
    if (insE) throw new Error(insE.message);
  }

  return pessoaId;
}

export async function deletePessoa(id: UUID): Promise<void> {
  const { error } = await supabase.from('pessoas').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
