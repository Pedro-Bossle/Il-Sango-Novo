import type { Orixa } from '../../../types/database';
import type { CadastroFormState } from '../../../types/memberForm';
import { OrisaQuadBlock } from './OrisaQuadBlock';

type Props = {
  orixas: Orixa[];
  cadastro: CadastroFormState;
  setCadastroField: (field: keyof CadastroFormState, value: string) => void;
};

/**
 * Secção completa de Orisás no cadastro de membro (cabeça, corpo, passagem, saída).
 * Textos visíveis usam a grafia "Orisá" conforme identidade do projeto.
 */
export function OrixasSection({ orixas, cadastro, setCadastroField }: Props) {
  return (
    <section className="dash-form-section">
      <h2 className="dash-form-section__title">Orisás</h2>
      <OrisaQuadBlock
        label="Orisá cabeça"
        section="cabeca"
        orixas={orixas}
        cadastro={cadastro}
        setCadastroField={setCadastroField}
      />
      <OrisaQuadBlock
        label="Orisá corpo"
        section="corpo"
        orixas={orixas}
        cadastro={cadastro}
        setCadastroField={setCadastroField}
      />
      <OrisaQuadBlock
        label="Orisá passagem"
        section="passagem"
        orixas={orixas}
        cadastro={cadastro}
        setCadastroField={setCadastroField}
      />
      <OrisaQuadBlock
        label="Orisá saída"
        section="saida"
        orixas={orixas}
        cadastro={cadastro}
        setCadastroField={setCadastroField}
      />
    </section>
  );
}
