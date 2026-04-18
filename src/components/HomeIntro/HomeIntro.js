import './HomeIntro.css';

/**
 * Bloco institucional: logo ILÊ + apresentação da casa (home e página Sobre).
 * No mobile o layout empilha (logo acima, texto abaixo), centrado.
 */
const HomeIntro = () => {
  return (
    <section className="home-intro" aria-labelledby="home-intro-heading">
      <div className="home-intro__inner">
        <div className="home-intro__logo-wrap">
          <img
            className="home-intro__logo"
            src="/images/logo-ile.png"
            alt="Logo do Ilê Sàngó Aganjù e Oṣun Pandá"
          />
        </div>
        <div className="home-intro__text">
          <h2 id="home-intro-heading" className="home-intro__title">
            Nossa casa
          </h2>
          <p className="home-intro__p">
            O Ilê Asé Sàngó Aganjù e Oṣun Pandá é uma casa de fé dedicada ao culto das tradições
            afro-brasileiras, preservando e praticando a Nação Cambinda, a Kimbanda Malei e a Umbanda. Aqui,
            reverenciamos com respeito os orixás e entidades espirituais, promovendo o equilíbrio, a cura e o
            desenvolvimento espiritual. Cada linha de trabalho tem seu fundamento, seu axé e sua missão,
            sempre voltados ao bem, à caridade e à valorização da ancestralidade. Nossa casa é um espaço de
            acolhimento, aprendizado e conexão com as forças da natureza e com o sagrado.
          </p>
          <p className="home-intro__p home-intro__p--destaque">Seja bem-vindo(a) ao nosso axé.</p>
        </div>
      </div>
    </section>
  );
};

export default HomeIntro;
