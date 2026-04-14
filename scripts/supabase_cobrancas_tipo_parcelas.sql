-- =============================================================================
-- Cobranças: tipo, valor total/pago/saldo e histórico de pagamentos
-- Alinhado ao app (pessoa_id uuid, membro texto, vencimento date, descricao).
-- Executar no SQL Editor do Supabase (ajusta nomes se o teu schema diferir).
-- =============================================================================

-- Extensão para UUID em `cobranca_pagamentos.id`
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Novas colunas em cobrancas (não duplicar vencimento se já existir)
-- Coluna `tipo` (TEXT): use os valores em minúsculas alinhados ao app — 'mensalidade', 'obrigacao', 'outros'.
ALTER TABLE public.cobrancas
  ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'mensalidade';

ALTER TABLE public.cobrancas
  ADD COLUMN IF NOT EXISTS valor_total NUMERIC(10, 2);

ALTER TABLE public.cobrancas
  ADD COLUMN IF NOT EXISTS valor_pago NUMERIC(10, 2) DEFAULT 0;

-- created_at (útil para listagens)
ALTER TABLE public.cobrancas
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Saldo gerado (só depois de valor_total e valor_pago existirem)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'cobrancas' AND column_name = 'valor_saldo'
  ) THEN
    ALTER TABLE public.cobrancas
      ADD COLUMN valor_saldo NUMERIC(10, 2)
      GENERATED ALWAYS AS (COALESCE(valor_total, 0) - COALESCE(valor_pago, 0)) STORED;
  END IF;
END $$;

-- Legado: copiar `valor` -> `valor_total` onde ainda não preenchido
UPDATE public.cobrancas
SET valor_total = COALESCE(valor_total, valor::numeric)
WHERE valor_total IS NULL AND valor IS NOT NULL;

-- 2) Histórico de pagamentos (obrigações / parcelas)
-- NOTA: `cobrancas.id` neste projeto é BIGINT (não uuid). A FK tem de ser BIGINT.
-- Se já criaste esta tabela com cobranca_id UUID, apaga e volta a criar:
-- DROP TABLE IF EXISTS public.cobranca_pagamentos CASCADE;

CREATE TABLE IF NOT EXISTS public.cobranca_pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cobranca_id BIGINT NOT NULL REFERENCES public.cobrancas(id) ON DELETE CASCADE,
  pessoa_id UUID NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  valor NUMERIC(10, 2) NOT NULL,
  data_pagamento DATE NOT NULL,
  obs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cobranca_pagamentos_cobranca
  ON public.cobranca_pagamentos(cobranca_id);

CREATE INDEX IF NOT EXISTS idx_cobranca_pagamentos_pessoa
  ON public.cobranca_pagamentos(pessoa_id);

-- 3) Atualizar valor_pago na cobrança após insert/update/delete em pagamentos
CREATE OR REPLACE FUNCTION public.update_valor_pago()
RETURNS TRIGGER AS $$
DECLARE
  target_id BIGINT;
BEGIN
  target_id := COALESCE(NEW.cobranca_id, OLD.cobranca_id);
  UPDATE public.cobrancas
  SET valor_pago = (
    SELECT COALESCE(SUM(valor), 0)
    FROM public.cobranca_pagamentos
    WHERE cobranca_id = target_id
  )
  WHERE id = target_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_valor_pago ON public.cobranca_pagamentos;
CREATE TRIGGER trg_update_valor_pago
  AFTER INSERT OR UPDATE OR DELETE ON public.cobranca_pagamentos
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_valor_pago();

-- 4) Remover função de geração automática (fluxo agora é manual/em massa no app)
DROP FUNCTION IF EXISTS public.gerar_mensalidades_mensais();
