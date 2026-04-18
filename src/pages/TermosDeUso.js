import './LegalPage.css';
import { PageMeta } from '../components/Seo/PageMeta';

const TermosDeUso = () => {
  return (
    <main className="legal-page">
      <PageMeta
        title="Termos de uso"
        path="/termos-de-uso"
        description="Termos de uso da plataforma do Ilê Sàngó Aganjù e Oṣun Pandá."
      />
      <h1 className="legal-page__title">Termos de uso</h1>
      <p className="legal-page__updated">Última atualização: abril de 2026</p>

      <section className="legal-page__section">
        <h2>1. Aceitação</h2>
        <p>
          Ao aceder e utilizar esta plataforma, o utilizador declara ter lido e compreendido estes termos. O uso continuado implica
          aceitação integral das condições aqui descritas.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>2. Finalidade da plataforma</h2>
        <p>
          O site destina-se a informar sobre atividades da casa, calendário, catálogo institucional e canal de contacto. A área
          restrita destina-se a membros e equipa autorizada, para gestão interna autorizada.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>3. Responsabilidades do utilizador</h2>
        <p>
          Compromete-se a fornecer informações verdadeiras quando solicitadas, a manter a confidencialidade das credenciais de acesso
          e a não utilizar a plataforma para fins ilícitos, ofensivos ou que comprometam a segurança de terceiros.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>4. Dados pessoais</h2>
        <p>
          O tratamento de dados pessoais segue a nossa Política de privacidade, em conformidade com a Lei Geral de Proteção de Dados
          (Lei nº 13.709/2018).
        </p>
      </section>

      <section className="legal-page__section">
        <h2>5. Propriedade intelectual</h2>
        <p>
          Textos, imagens, logótipos e demais conteúdos são protegidos por direitos do Ilê ou de terceiros licenciadores. É proibida
          a reprodução sem autorização prévia, salvo uso privado ou citação breve com indicação da fonte.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>6. Limitações</h2>
        <p>
          A plataforma é fornecida &quot;no estado em que se encontra&quot;. Não garantimos disponibilidade ininterrupta nem ausência
          de erros. Podemos alterar ou descontinuar funcionalidades mediante necessidade técnica ou legal.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>7. Foro</h2>
        <p>
          Estes termos regem-se pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de domicílio da casa,
          salvo disposição legal em contrário.
        </p>
      </section>
    </main>
  );
};

export default TermosDeUso;
