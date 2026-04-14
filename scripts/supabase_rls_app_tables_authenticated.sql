-- =============================================================================
-- RLS — tabelas usadas pelo app Il Sango (dashboard com login Supabase)
--
-- Modelo: utilizadores `authenticated` (JWT válido) podem SELECT/INSERT/UPDATE/DELETE
-- em todas as tabelas abaixo. Utilizadores `anon` não têm políticas — não acedem às linhas.
--
-- Remove políticas antigas (ex.: templates com get_teams_for_user) e recria permissões.
-- Executar no SQL Editor do Supabase após as tabelas existirem em public.
--
-- Tabelas: pessoas, eventos, catalogo, cobrancas, cobranca_pagamentos, orixas,
--          qualidades, cadastro_orixas, orumale, exus
-- =============================================================================

DO $$
DECLARE
  r RECORD;
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pessoas',
    'eventos',
    'catalogo',
    'cobrancas',
    'cobranca_pagamentos',
    'orixas',
    'qualidades',
    'cadastro_orixas',
    'orumale',
    'exus'
  ]
  LOOP
    FOR r IN (
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t
    )
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, t);
    END LOOP;
  END LOOP;
END $$;

-- pessoas
ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pessoas_select_authenticated ON public.pessoas;
DROP POLICY IF EXISTS pessoas_insert_authenticated ON public.pessoas;
DROP POLICY IF EXISTS pessoas_update_authenticated ON public.pessoas;
DROP POLICY IF EXISTS pessoas_delete_authenticated ON public.pessoas;
CREATE POLICY pessoas_select_authenticated ON public.pessoas FOR SELECT TO authenticated USING (true);
CREATE POLICY pessoas_insert_authenticated ON public.pessoas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY pessoas_update_authenticated ON public.pessoas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY pessoas_delete_authenticated ON public.pessoas FOR DELETE TO authenticated USING (true);

-- eventos
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS eventos_select_authenticated ON public.eventos;
DROP POLICY IF EXISTS eventos_select_anon ON public.eventos;
DROP POLICY IF EXISTS eventos_insert_authenticated ON public.eventos;
DROP POLICY IF EXISTS eventos_update_authenticated ON public.eventos;
DROP POLICY IF EXISTS eventos_delete_authenticated ON public.eventos;
CREATE POLICY eventos_select_authenticated ON public.eventos FOR SELECT TO authenticated USING (true);
CREATE POLICY eventos_select_anon ON public.eventos FOR SELECT TO anon USING (true);
CREATE POLICY eventos_insert_authenticated ON public.eventos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY eventos_update_authenticated ON public.eventos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY eventos_delete_authenticated ON public.eventos FOR DELETE TO authenticated USING (true);

-- catalogo
ALTER TABLE public.catalogo ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS catalogo_select_authenticated ON public.catalogo;
DROP POLICY IF EXISTS catalogo_select_anon ON public.catalogo;
DROP POLICY IF EXISTS catalogo_insert_authenticated ON public.catalogo;
DROP POLICY IF EXISTS catalogo_update_authenticated ON public.catalogo;
DROP POLICY IF EXISTS catalogo_delete_authenticated ON public.catalogo;
CREATE POLICY catalogo_select_authenticated ON public.catalogo FOR SELECT TO authenticated USING (true);
CREATE POLICY catalogo_select_anon ON public.catalogo FOR SELECT TO anon USING (true);
CREATE POLICY catalogo_insert_authenticated ON public.catalogo FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY catalogo_update_authenticated ON public.catalogo FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY catalogo_delete_authenticated ON public.catalogo FOR DELETE TO authenticated USING (true);

-- cobrancas
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cobrancas_select_authenticated ON public.cobrancas;
DROP POLICY IF EXISTS cobrancas_insert_authenticated ON public.cobrancas;
DROP POLICY IF EXISTS cobrancas_update_authenticated ON public.cobrancas;
DROP POLICY IF EXISTS cobrancas_delete_authenticated ON public.cobrancas;
CREATE POLICY cobrancas_select_authenticated ON public.cobrancas FOR SELECT TO authenticated USING (true);
CREATE POLICY cobrancas_insert_authenticated ON public.cobrancas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY cobrancas_update_authenticated ON public.cobrancas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY cobrancas_delete_authenticated ON public.cobrancas FOR DELETE TO authenticated USING (true);

-- cobranca_pagamentos
ALTER TABLE public.cobranca_pagamentos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cobranca_pagamentos_select_authenticated ON public.cobranca_pagamentos;
DROP POLICY IF EXISTS cobranca_pagamentos_insert_authenticated ON public.cobranca_pagamentos;
DROP POLICY IF EXISTS cobranca_pagamentos_update_authenticated ON public.cobranca_pagamentos;
DROP POLICY IF EXISTS cobranca_pagamentos_delete_authenticated ON public.cobranca_pagamentos;
CREATE POLICY cobranca_pagamentos_select_authenticated ON public.cobranca_pagamentos FOR SELECT TO authenticated USING (true);
CREATE POLICY cobranca_pagamentos_insert_authenticated ON public.cobranca_pagamentos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY cobranca_pagamentos_update_authenticated ON public.cobranca_pagamentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY cobranca_pagamentos_delete_authenticated ON public.cobranca_pagamentos FOR DELETE TO authenticated USING (true);

-- orixas
ALTER TABLE public.orixas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orixas_select_authenticated ON public.orixas;
DROP POLICY IF EXISTS orixas_insert_authenticated ON public.orixas;
DROP POLICY IF EXISTS orixas_update_authenticated ON public.orixas;
DROP POLICY IF EXISTS orixas_delete_authenticated ON public.orixas;
CREATE POLICY orixas_select_authenticated ON public.orixas FOR SELECT TO authenticated USING (true);
CREATE POLICY orixas_insert_authenticated ON public.orixas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY orixas_update_authenticated ON public.orixas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY orixas_delete_authenticated ON public.orixas FOR DELETE TO authenticated USING (true);

-- qualidades
ALTER TABLE public.qualidades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS qualidades_select_authenticated ON public.qualidades;
DROP POLICY IF EXISTS qualidades_insert_authenticated ON public.qualidades;
DROP POLICY IF EXISTS qualidades_update_authenticated ON public.qualidades;
DROP POLICY IF EXISTS qualidades_delete_authenticated ON public.qualidades;
CREATE POLICY qualidades_select_authenticated ON public.qualidades FOR SELECT TO authenticated USING (true);
CREATE POLICY qualidades_insert_authenticated ON public.qualidades FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY qualidades_update_authenticated ON public.qualidades FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY qualidades_delete_authenticated ON public.qualidades FOR DELETE TO authenticated USING (true);

-- cadastro_orixas
ALTER TABLE public.cadastro_orixas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cadastro_orixas_select_authenticated ON public.cadastro_orixas;
DROP POLICY IF EXISTS cadastro_orixas_insert_authenticated ON public.cadastro_orixas;
DROP POLICY IF EXISTS cadastro_orixas_update_authenticated ON public.cadastro_orixas;
DROP POLICY IF EXISTS cadastro_orixas_delete_authenticated ON public.cadastro_orixas;
CREATE POLICY cadastro_orixas_select_authenticated ON public.cadastro_orixas FOR SELECT TO authenticated USING (true);
CREATE POLICY cadastro_orixas_insert_authenticated ON public.cadastro_orixas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY cadastro_orixas_update_authenticated ON public.cadastro_orixas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY cadastro_orixas_delete_authenticated ON public.cadastro_orixas FOR DELETE TO authenticated USING (true);

-- orumale
ALTER TABLE public.orumale ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orumale_select_authenticated ON public.orumale;
DROP POLICY IF EXISTS orumale_insert_authenticated ON public.orumale;
DROP POLICY IF EXISTS orumale_update_authenticated ON public.orumale;
DROP POLICY IF EXISTS orumale_delete_authenticated ON public.orumale;
CREATE POLICY orumale_select_authenticated ON public.orumale FOR SELECT TO authenticated USING (true);
CREATE POLICY orumale_insert_authenticated ON public.orumale FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY orumale_update_authenticated ON public.orumale FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY orumale_delete_authenticated ON public.orumale FOR DELETE TO authenticated USING (true);

-- exus
ALTER TABLE public.exus ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS exus_select_authenticated ON public.exus;
DROP POLICY IF EXISTS exus_insert_authenticated ON public.exus;
DROP POLICY IF EXISTS exus_update_authenticated ON public.exus;
DROP POLICY IF EXISTS exus_delete_authenticated ON public.exus;
CREATE POLICY exus_select_authenticated ON public.exus FOR SELECT TO authenticated USING (true);
CREATE POLICY exus_insert_authenticated ON public.exus FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY exus_update_authenticated ON public.exus FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY exus_delete_authenticated ON public.exus FOR DELETE TO authenticated USING (true);

-- Privilégios nas tabelas da app (se vires "permission denied" no cliente)
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.pessoas,
  public.eventos,
  public.catalogo,
  public.cobrancas,
  public.cobranca_pagamentos,
  public.orixas,
  public.qualidades,
  public.cadastro_orixas,
  public.orumale,
  public.exus
TO authenticated;

GRANT SELECT ON public.eventos, public.catalogo TO anon;
