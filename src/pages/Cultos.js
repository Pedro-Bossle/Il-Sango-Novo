import './Cultos.css';
import { PageMeta } from '../components/Seo/PageMeta';

const PLACEHOLDER =
  'Texto temático provisório: a casa reúne nações e linhas que dialogam com a mesma fé. Aqui descrevemos com respeito a Nação Cabinda, a Quimbanda Malei e a Umbanda, sempre no cuidado com a palavra e com quem chega buscando orientação.';

const Cultos = () => {
  return (
    <div className="cultos-page">
      <PageMeta title="Cultos" path="/cultos" description="Conheça Nação Cabinda, Quimbanda Malei e Umbanda no Ilê Sàngó Aganjù e Oṣun Pandá." />
      <header className="cultos-hero">
        <h1 className="cultos-hero__title">Cultos</h1>
        <p className="cultos-hero__lead">Três expressões da nossa vivência espiritual.</p>
      </header>

      <section className="cultos-section cultos-section--cabinda" aria-labelledby="cultos-cabinda">
        <h2 id="cultos-cabinda" className="cultos-section__title">
          Nação Cabinda
        </h2>
        <div className="cultos-section__grid cultos-section__grid--text-right">
          <div className="cultos-section__text">
            <p>{PLACEHOLDER}</p>
          </div>
          <div className="cultos-section__gallery" role="group" aria-label="Imagens Nação Cabinda">
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Nação Cabinda" className="cultos-section__img" />
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Nação Cabinda" className="cultos-section__img" />
          </div>
        </div>
      </section>

      <section className="cultos-section cultos-section--malei" aria-labelledby="cultos-malei">
        <h2 id="cultos-malei" className="cultos-section__title">
          Quimbanda Malei
        </h2>
        <div className="cultos-section__grid cultos-section__grid--text-left">
          <div className="cultos-section__gallery" role="group" aria-label="Imagens Quimbanda Malei">
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Quimbanda Malei" className="cultos-section__img" />
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Quimbanda Malei" className="cultos-section__img" />
          </div>
          <div className="cultos-section__text">
            <p>{PLACEHOLDER}</p>
          </div>
        </div>
      </section>

      <section className="cultos-section cultos-section--umbanda" aria-labelledby="cultos-umbanda">
        <h2 id="cultos-umbanda" className="cultos-section__title">
          Umbanda
        </h2>
        <div className="cultos-section__grid cultos-section__grid--text-right">
          <div className="cultos-section__text">
            <p>{PLACEHOLDER}</p>
          </div>
          <div className="cultos-section__gallery" role="group" aria-label="Imagens Umbanda">
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Umbanda" className="cultos-section__img" />
            <img src="/images/logo-ile.png" alt="Imagem ilustrativa Umbanda" className="cultos-section__img" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cultos;
