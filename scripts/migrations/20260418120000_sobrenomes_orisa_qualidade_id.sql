-- =============================================
-- sobrenomes_orisa: coluna qualidade_id (FK → qualidades.id)
-- Em muitas bases `qualidades.id` é INTEGER (serial), não UUID — o tipo deve coincidir.
-- Se uma tentativa anterior criou UUID, remove-se e recria-se em INTEGER.
-- =============================================

ALTER TABLE public.sobrenomes_orisa
  DROP CONSTRAINT IF EXISTS sobrenomes_orisa_qualidade_id_fkey;

ALTER TABLE public.sobrenomes_orisa
  DROP COLUMN IF EXISTS qualidade_id;

ALTER TABLE public.sobrenomes_orisa
  ADD COLUMN qualidade_id INTEGER REFERENCES public.qualidades(id);

CREATE INDEX IF NOT EXISTS idx_sobrenomes_orisa_qualidade_id ON public.sobrenomes_orisa(qualidade_id);

UPDATE public.sobrenomes_orisa s
SET qualidade_id = q.id
FROM public.qualidades q
INNER JOIN public.orixas o ON o.id = q.orixa_id
WHERE trim(o.nome) = trim(s.orisa)
  AND trim(q.nome) = trim(s.qualidade);

UPDATE public.sobrenomes_orisa s
SET qualidade_id = q.id
FROM public.qualidades q
INNER JOIN public.orixas o ON o.id = q.orixa_id
WHERE s.qualidade_id IS NULL
  AND lower(trim(o.nome)) = lower(trim(s.orisa))
  AND lower(trim(q.nome)) = lower(trim(s.qualidade));

-- Verificar linhas sem match: SELECT * FROM sobrenomes_orisa WHERE qualidade_id IS NULL;
