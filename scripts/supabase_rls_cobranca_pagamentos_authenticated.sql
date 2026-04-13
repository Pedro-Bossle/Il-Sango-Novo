-- =============================================================================
-- RLS em `public.cobranca_pagamentos` — sem `get_teams_for_user`
-- Preferir: `supabase_rls_app_tables_authenticated.sql` (todas as tabelas do app).
--
-- IMPORTANTE: no SQL Editor do Supabase, cola e executa ESTE FICHEIRO INTEIRO
-- de uma vez (botão Run). Não executes só uma linha a meio — linhas que começam
-- por "ON public.cobranca_pagamentos" causam erro 42601 se forem sem o CREATE POLICY.
--
-- Erro comum: function get_teams_for_user(uuid) does not exist → políticas antigas
-- com template "teams". Este script remove-as e recria políticas para `authenticated`.
-- =============================================================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'cobranca_pagamentos'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.cobranca_pagamentos', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.cobranca_pagamentos ENABLE ROW LEVEL SECURITY;

-- Uma instrução completa por linha (seguro se correres bloco a bloco)
CREATE POLICY cobranca_pagamentos_select_authenticated ON public.cobranca_pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY cobranca_pagamentos_insert_authenticated ON public.cobranca_pagamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY cobranca_pagamentos_update_authenticated ON public.cobranca_pagamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY cobranca_pagamentos_delete_authenticated ON public.cobranca_pagamentos FOR DELETE TO authenticated USING (true);
