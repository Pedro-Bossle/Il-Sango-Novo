import "./Banner.css"

const Banner = () => {
    return (
        <section id="inicio">
            <div className="banner">
                <div className="banner_titulo_container">
                    <h1 className="banner_titulo">Ilê Asé Sàngó Aganjù e Oṣun Pandá</h1>
                    <h3 className="banner_subtitulo">Desde 08 de Outubro de 2022</h3>

                </div>
                <div className="banner_box_container">
                    <div className="banner_box">
                        <h3>Consultas Espirituais</h3>
                        <p>Orientação e aconselhamento espiritual</p>
                    </div>

                    <div className="banner_box">
                        <h3>Sessões</h3>
                        <p>Quimbanda, Umbanda e Nação</p>
                    </div>

                    <div className="banner_box">
                        <h3>Desenvolvimento Mediúnico</h3>
                        <p>Fortalecimento dos dons espirituais</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
export default Banner