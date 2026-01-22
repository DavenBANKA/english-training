import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Cours() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Cours d'anglais</h1>
          <p className="page-subtitle">
            Cours particuliers et collectifs adaptés à vos besoins
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Nos formules de cours</h2>
            <p>
              Que vous préfériez apprendre seul ou en groupe, en ligne ou en présentiel, 
              nous avons la formule qui vous convient.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>Cours particuliers</h3>
              <p>Accompagnement personnalisé avec un professeur dédié</p>
            </div>

            <div className="step-card">
              <h3>Cours en groupe</h3>
              <p>Apprenez avec d'autres étudiants de votre niveau</p>
            </div>

            <div className="step-card">
              <h3>Cours en ligne</h3>
              <p>Flexibilité totale avec des cours par visioconférence</p>
            </div>

            <div className="step-card">
              <h3>Cours intensifs</h3>
              <p>Progressez rapidement avec des sessions quotidiennes</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Ce qui est inclus</h2>
            <ul className="features-list-page">
              <li>Professeurs natifs et expérimentés</li>
              <li>Matériel pédagogique fourni</li>
              <li>Exercices et devoirs personnalisés</li>
              <li>Suivi régulier de vos progrès</li>
              <li>Accès à notre plateforme e-learning</li>
              <li>Certificat de fin de formation</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Commencez vos cours d'anglais</h2>
            <button className="btn-cta">Évaluer mon niveau</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Cours
