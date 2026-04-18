import Banner from '../components/Banner/Banner';
import HomeIntro from '../components/HomeIntro/HomeIntro';
import Eventos from '../components/Eventos/Eventos';
import Catalogo from '../components/Catalogo/Catalogo';
import { PageMeta } from '../components/Seo/PageMeta';

const Home = () => {
  return (
    <div className="App">
      <PageMeta
        title="Início"
        path="/"
        description="Ilê Sàngó Aganjù e Oṣun Pandá — calendário, catálogo e contato em Caxias do Sul."
      />
      <Banner />
      <HomeIntro />
      <Eventos modo="home" />
      <Catalogo modo="home" />
    </div>
  );
};

export default Home;
