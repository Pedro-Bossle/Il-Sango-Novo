-- =============================================================================
-- Remove UNIQUE em `cobrancas.membro` (legado: uma linha por nome)
--
-- Com `pessoa_id` e várias obrigações/mensalidades por pessoa, o mesmo nome
-- aparece em várias linhas → UNIQUE(membro) gera:
--   duplicate key value violates unique constraint "cobrancas_membro_key"
--   (ou typo "cobrancaas_membro_key" na tua base)
--
-- Executar no SQL Editor do Supabase.
-- =============================================================================

ALTER TABLE public.cobrancas
  DROP CONSTRAINT IF EXISTS cobrancas_membro_key;

ALTER TABLE public.cobrancas
  DROP CONSTRAINT IF EXISTS cobrancaas_membro_key;

-- Índice não-único opcional (só para pesquisa por texto, não obrigatório)
-- CREATE INDEX IF NOT EXISTS idx_cobrancas_membro ON public.cobrancas (membro);
