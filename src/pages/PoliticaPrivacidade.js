import './LegalPage.css';
import { PageMeta } from '../components/Seo/PageMeta';

const PoliticaPrivacidade = () => {
  return (
    <main className="legal-page">
      <PageMeta
        title="Política de privacidade"
        path="/politica-de-privacidade"
        description="Política de privacidade e proteção de dados (LGPD) — Ilê Sàngó Aganjù e Oṣun Pandá."
      />
      <h1 className="legal-page__title">Política de privacidade</h1>
      <p className="legal-page__updated">Última atualização: abril de 2026 · Lei nº 13.709/2018 (LGPD)</p>

      <section className="legal-page__section">
        <h2>1. Quem somos</h2>
        <p>
          O Ilê Sàngó Aganjù e Oṣun Pandá trata dados pessoais com transparência e respeito às finalidades informadas nesta política.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>2. Dados que podemos recolher</h2>
        <p>
          Identificação e contacto (nome, e-mail, telefone), dados de navegação (cookies quando aplicável), e informações necessárias
          à gestão de membros e cobranças na área restrita.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>3. Finalidades</h2>
        <p>
          Prestação de serviços religiosos e administrativos, agendamentos, comunicações institucionais, cumprimento de obrigações
          legais e melhoria da experiência no site.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>4. Armazenamento e segurança</h2>
        <p>
          Os dados podem ser armazenados em serviços cloud (por exemplo, Supabase) com medidas de segurança adequadas. Conservamos
          apenas pelo tempo necessário às finalidades ou exigências legais.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>5. Partilha</h2>
        <p>
          Não vendemos dados pessoais. Podemos partilhar com prestadores que nos auxiliem na operação do site, sob contratos que
          respeitam a LGPD.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>6. Direitos do titular</h2>
        <p>
          Pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de dados desnecessários
          ou revogação de consentimento, conforme a LGPD, através do contacto indicado abaixo.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>7. Cookies</h2>
        <p>
          Podemos utilizar cookies estritamente necessários ao funcionamento do site ou preferências. Pode gerir cookies no seu
          navegador.
        </p>
      </section>

      <section className="legal-page__section">
        <h2>8. Contacto</h2>
        <p>
          Para questões sobre privacidade: <a href="mailto:ile.de.ase@gmail.com">ile.de.ase@gmail.com</a> ou pelos canais indicados
          na página de contato.
        </p>
      </section>
    </main>
  );
};

export default PoliticaPrivacidade;
