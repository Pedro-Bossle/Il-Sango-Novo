import { supabase } from '../lib/supabaseClient';
import type { Orixa, Qualidade, UUID } from '../types/database';

export async function fetchOrixas(): Promise<Orixa[]> {
  const { data, error } = await supabase.from('orixas').select('id, nome').order('nome', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Orixa[];
}

export async function fetchQualidadesPorOrixa(orixaId: UUID | ''): Promise<Qualidade[]> {
  if (!orixaId) return [];
  const { data, error } = await supabase
    .from('qualidades')
    .select('id, nome, orixa_id')
    .eq('orixa_id', orixaId)
    .order('nome', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Qualidade[];
}
