import "./About.css"
import Card from "../Card/Card.js"

const About = () => {
    return (
        <section id="about">
            <div className="about-section">
                <h2 className="about-title">Nossos Dirigentes Espirituais</h2>
                <p className="about-desc">Conheça os guias espirituais que conduzem nossa casa com amor, sabedoria e dedicação</p>
                <Card></Card>
                <h3 className="about-mission-title">Nossa Missão</h3>
                <p className="about-mission-text">Servir como ponte entre o mundo material e espiritual, oferecendo orientação, cura e desenvolvimento espiritual a todos que buscam luz em suas jornadas.<br></br> O Ilê Sàngó Aganjù e Oṣun Pandá é um espaço de acolhimento, respeito e transformação.</p>
            </div>
        </section>
    )
}

export default About;