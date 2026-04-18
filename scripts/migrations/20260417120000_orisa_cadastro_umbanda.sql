-- =============================================
-- MIGRAÇÃO: Orisá — renomear colunas caminho/passagem → passagem/saída,
--            novos campos digina/sobrenome em cadastro_orixas,
--            tabela umbanda (espelho de exus)
-- PRÉ-REQUISITO: executar scripts/sobrenomes_orisa.sql (tabela sobrenomes_orisa + dados)
-- AMBIENTE: testar em staging antes de produção
-- =============================================

-- ----- 1) Renomear colunas em cadastro_orixas (evitar conflito: passagem → saída primeiro)
ALTER TABLE public.cadastro_orixas RENAME COLUMN orixa_passagem_id TO orixa_saida_id;
ALTER TABLE public.cadastro_orixas RENAME COLUMN qualidade_passagem_id TO qualidade_saida_id;
ALTER TABLE public.cadastro_orixas RENAME COLUMN orixa_passagem_reza TO orixa_saida_reza;

ALTER TABLE public.cadastro_orixas RENAME COLUMN orixa_caminho_id TO orixa_passagem_id;
ALTER TABLE public.cadastro_orixas RENAME COLUMN qualidade_caminho_id TO qualidade_passagem_id;
ALTER TABLE public.cadastro_orixas RENAME COLUMN orixa_caminho_reza TO orixa_passagem_reza;

-- ----- 2) Novos campos: digina (texto) e sobrenome (FK para sobrenomes_orisa)
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS digina_cabeca TEXT;
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS digina_corpo TEXT;
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS digina_passagem TEXT;
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS digina_saida TEXT;

ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS sobrenome_orisa_cabeca UUID REFERENCES public.sobrenomes_orisa(id);
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS sobrenome_orisa_corpo UUID REFERENCES public.sobrenomes_orisa(id);
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS sobrenome_orisa_passagem UUID REFERENCES public.sobrenomes_orisa(id);
ALTER TABLE public.cadastro_orixas ADD COLUMN IF NOT EXISTS sobrenome_orisa_saida UUID REFERENCES public.sobrenomes_orisa(id);

-- ----- 3) Tabela umbanda (mesmo padrão conceitual de exus: várias linhas por pessoa)
CREATE TABLE IF NOT EXISTS public.umbanda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  umbanda_nome TEXT,
  umbanda_ordem INT,
  data_feitura DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_umbanda_pessoa ON public.umbanda(pessoa_id);

ALTER TABLE public.umbanda ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS umbanda_select_authenticated ON public.umbanda;
DROP POLICY IF EXISTS umbanda_insert_authenticated ON public.umbanda;
DROP POLICY IF EXISTS umbanda_update_authenticated ON public.umbanda;
DROP POLICY IF EXISTS umbanda_delete_authenticated ON public.umbanda;

CREATE POLICY umbanda_select_authenticated ON public.umbanda FOR SELECT TO authenticated USING (true);
CREATE POLICY umbanda_insert_authenticated ON public.umbanda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY umbanda_update_authenticated ON public.umbanda FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY umbanda_delete_authenticated ON public.umbanda FOR DELETE TO authenticated USING (true);

-- Verificação sugerida:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'cadastro_orixas' ORDER BY ordinal_position;
