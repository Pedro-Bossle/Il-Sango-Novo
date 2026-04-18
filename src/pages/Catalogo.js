import CatalogoComponent from '../components/Catalogo/Catalogo';
import { PageMeta } from '../components/Seo/PageMeta';

const Catalogo = () => {
  return (
    <>
      <PageMeta title="Catálogo" path="/catalogo" description="Catálogo institucional do Ilê Sàngó Aganjù e Oṣun Pandá." />
      <CatalogoComponent modo="catalogo" />
    </>
  );
};
export default Catalogo;
