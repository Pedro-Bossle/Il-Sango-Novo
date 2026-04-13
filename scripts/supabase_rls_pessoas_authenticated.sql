-- =============================================================================
-- RLS em `public.pessoas` — sem `get_teams_for_user`
-- Preferir: `supabase_rls_app_tables_authenticated.sql` (todas as tabelas do app).
--
-- Erro comum: policies copiadas de templates usam
--   get_teams_for_user(auth.uid())
-- mas essa função só existe se TU a criares (ex.: modelo com equipas/tenants).
--
-- Este script:
-- 1) Remove TODAS as políticas existentes em `public.pessoas` (recomeço limpo).
-- 2) Ativa RLS e cria políticas para o role `authenticated` (sessão Supabase logada).
--
-- Ajusta se precisares de regras mais finas (ex.: coluna `user_id` em pessoas).
-- =============================================================================

-- Remover todas as políticas atuais da tabela (inclui as que referenciam funções inexistentes)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'pessoas'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.pessoas', r.policyname);
  END LOOP;
END $$;

ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;

-- Qualquer utilizador com JWT válido (authenticated) pode ler/escrever.
-- Isto alinha com um dashboard interno onde só contas confiáveis têm login.
CREATE POLICY pessoas_select_authenticated
  ON public.pessoas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY pessoas_insert_authenticated
  ON public.pessoas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY pessoas_update_authenticated
  ON public.pessoas
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY pessoas_delete_authenticated
  ON public.pessoas
  FOR DELETE
  TO authenticated
  USING (true);

-- Opcional: utilizadores anónimos não veem dados (sem política para `anon`)
