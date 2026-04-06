import './Whatsapp.css';

const Whatsapp = ({ showScrollTop = false }) => {
  const buttonClassName = `botao_wpp ${showScrollTop ? 'botao_wpp--with-scroll-top' : 'botao_wpp--low'}`;

  return (
    <a
      className={buttonClassName}
      href="https://wa.me/555491556023"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chame-nos no WhatsApp"
    >
      <img className="botao_wpp_ico" src="/images/icons/ico whatsapp 2.png" alt="Ícone do WhatsApp" />
    </a>
  );
};

export default Whatsapp;