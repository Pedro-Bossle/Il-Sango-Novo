import { supabase } from '../lib/supabaseClient';
import type { UUID } from '../types/database';

export type PessoaOption = { id: UUID; nome: string };

export async function fetchPessoasOptions(): Promise<PessoaOption[]> {
  const { data, error } = await supabase.from('pessoas').select('id, nome').order('nome', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PessoaOption[];
}
