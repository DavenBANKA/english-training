import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Manifeste() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Le manifeste</h1>
          <p className="page-subtitle">
            Nos valeurs et notre vision de l'apprentissage de l'anglais
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Notre vision</h2>
            <p>
              Nous croyons que chacun devrait avoir accès à une évaluation précise et gratuite de son niveau d'anglais. 
              L'apprentissage des langues ne devrait pas être un luxe, mais un droit accessible à tous.
            </p>
          </div>

          <div className="content-section">
            <h2>Nos engagements</h2>
            <ul className="features-list-page">
              <li>Gratuité totale de l'évaluation, sans inscription obligatoire</li>
              <li>Transparence sur les méthodes d'évaluation</li>
              <li>Respect de la vie privée et des données personnelles</li>
              <li>Qualité et fiabilité des résultats</li>
              <li>Accompagnement personnalisé après le test</li>
            </ul>
          </div>

          <div className="content-section">
            <h2>Notre approche</h2>
            <p>
              Nous utilisons les standards internationaux CECRL pour garantir une évaluation reconnue partout dans le monde. 
              Notre technologie adaptative permet une évaluation précise en un minimum de temps, 
              tout en respectant le rythme de chaque apprenant.
            </p>
          </div>

          <div className="cta-section-page">
            <h2>Découvrez votre niveau dès maintenant</h2>
            <button className="btn-cta">Passer le test</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Manifeste
