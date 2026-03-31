import "./Footer.css"

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div>
                    <div className="footer-message">
                        <img className="footer-logo" src="/images/logo-ile.png" alt="logo"></img>

                        <div className="footer-message-title_container">
                            <h2 className="footer-main_title" >Ilê Sàngó Aganjù e Oṣun Pandá</h2>
                            <p className="footer-sub_title" >Tiago de Sàngó Aganjù e Rosangela de Oṣun Pandá</p>
                        </div>
                    </div>

                    <p className="footer-text">Um espaço sagrado dedicado ao crescimento espiritual, cura e orientação.<br></br> Há mais de 4 anos servindo nossa comunidade com amor e dedicação.
                    </p>
                    <a className="footer-social_link" href="https://www.instagram.com/">Instagram Logo</a>
                    <a className="footer-social_link" href="https://www.facebook.com/">Facebook Logo</a>

                </div>

                <div className="footer-contacts">
                    <h3 className="footer-section-title" >Contato</h3>
                    <ul>
                        <p className="footer-list_item" >Telefone</p>
                        <p className="footer-list_item" >Email</p>
                        <p className="footer-list_item" >Endereço</p>
                    </ul>
                </div>

                <div className="footer-activity">
                    <h3 className="footer-section-title" >Horários</h3>
                    <ul>
                        <p className="footer-list_item" >Horários de Atendimento</p>
                    </ul>
                </div>
            </div>

            <p className="footer__copyright"> © 2025 Ilê Asé Sàngó Aganjù e Osun Pandá. Todos os direitos reservados. </p>
            <a href="https://youtube.com">Política de Privacidade</a>
            <a href="https://youtube.com">Termos de uso</a>

        </div>
    );
}

export default Footer;