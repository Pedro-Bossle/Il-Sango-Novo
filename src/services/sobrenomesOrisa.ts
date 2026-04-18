import { supabase } from '../lib/supabaseClient';

export type SobrenomeOrisaRow = {
  id: string;
  nome: string;
};

type FetchSobrenomesParams = {
  qualidadeId: string | null | undefined;
  orisaNome?: string | null;
  qualidadeNome?: string | null;
  orixaSemQualidades?: boolean;
};

/**
 * Se `qualidadeNome` vier vazio (ex.: mismatch string/number no React), resolve o nome em `qualidades`.
 */
async function resolverNomeQualidade(
  qualidadeId: string,
  qualidadeNome: string,
): Promise<string> {
  const qn = (qualidadeNome ?? '').trim();
  if (qn) return qn;
  const id = qualidadeId.trim();
  if (!id) return '';
  const { data, error } = await supabase.from('qualidades').select('nome').eq('id', id).maybeSingle();
  if (error || !data) return '';
  return String((data as { nome: string }).nome).trim();
}

/**
 * Sobrenomes em `sobrenomes_orisa`:
 * - Orixa sem qualidades: `.eq('orisa', nomeDoOrisá)`.
 * - Com qualidade: `.eq('qualidade_id', id)` (INTEGER); se vazio, fallback `orisa` + `qualidade` (texto).
 */
export async function fetchSobrenomesOrisa({
  qualidadeId,
  orisaNome,
  qualidadeNome,
  orixaSemQualidades,
}: FetchSobrenomesParams): Promise<SobrenomeOrisaRow[]> {
  const o = (orisaNome ?? '').trim();
  const qid = (qualidadeId ?? '').trim();

  if (!o) return [];

  if (orixaSemQualidades) {
    const { data, error } = await supabase
      .from('sobrenomes_orisa')
      .select('id, nome')
      .eq('orisa', o)
      .order('nome', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as SobrenomeOrisaRow[];
  }

  if (!qid) return [];

  const qnResolvido = await resolverNomeQualidade(qid, qualidadeNome ?? '');

  const { data: porId, error: errId } = await supabase
    .from('sobrenomes_orisa')
    .select('id, nome')
    .eq('qualidade_id', qid)
    .order('nome', { ascending: true });

  if (!errId && porId && porId.length > 0) {
    return porId as SobrenomeOrisaRow[];
  }

  if (qnResolvido) {
    const { data: porTexto, error: errText } = await supabase
      .from('sobrenomes_orisa')
      .select('id, nome')
      .eq('orisa', o)
      .eq('qualidade', qnResolvido)
      .order('nome', { ascending: true });
    if (errText) throw new Error(errText.message);
    return (porTexto ?? []) as SobrenomeOrisaRow[];
  }

  if (errId) throw new Error(errId.message);
  return [];
}
