import './Card.css'

const Card = () => {
    return (
        <div className="card-section">

            <div className="card tiago">
                <div className="card-titulo-container">
                    <img className="card-foto" src="./images/tiago.jpg" alt="Tiago de Xango Aganju" />
                    <div>
                        <h3 className="card-nome">Tiago de Sàngó Aganjù</h3>
                        <h5 className="card-sub">X Anos de Experiência</h5>
                    </div>
                </div>
                <p className="card-historia">Iniciado por XX na tradição X em X, feito Mestre de Quimbanda Malei pelo feitor X da casa X (Outras informações caso queiram)</p>
            </div>

            <div className="card rosangela">
                <div className="card-titulo-container">
                    <img className="card-foto" src="./images/rosangela.png" alt="Rosangela de Oxum Panda" />
                    <div>
                        <h3 className="card-nome">Rosangela de Oṣun Pandá</h3>
                        <h5 className="card-sub">X Anos de Experiência</h5>
                    </div>
                </div>
                <p className="card-historia">Iniciado por XX na tradição X em X, feito Mestre de Quimbanda Malei pelo feitor X da casa X (Outras informações caso queiram)</p>
            </div>
        </div>
    )
}

export default Card;