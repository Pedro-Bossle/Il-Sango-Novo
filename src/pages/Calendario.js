import Eventos from '../components/Eventos/Eventos';
import { PageMeta } from '../components/Seo/PageMeta';

const Calendario = () => {
  return (
    <>
      <PageMeta
        title="Calendário"
        path="/eventos"
        description="Calendário de eventos e giras do Ilê Sàngó Aganjù e Oṣun Pandá."
      />
      <Eventos modo="calendario" />
    </>
  );
};

export default Calendario;
