import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function ApprendreAnglais() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Apprendre l'anglais</h1>
          <p className="page-subtitle">
            Méthodes, conseils et ressources pour progresser efficacement
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Par où commencer ?</h2>
            <p>
              Apprendre l'anglais nécessite une approche structurée et adaptée à votre niveau. 
              Commencez par évaluer votre niveau actuel pour identifier vos points forts et vos axes d'amélioration.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>Évaluation</h3>
              <p>Testez votre niveau pour connaître votre point de départ</p>
            </div>

            <div className="step-card">
              <h3>Objectifs</h3>
              <p>Définissez des objectifs clairs et réalisables</p>
            </div>

            <div className="step-card">
              <h3>Pratique régulière</h3>
              <p>Consacrez du temps chaque jour à l'apprentissage</p>
            </div>

            <div className="step-card">
              <h3>Immersion</h3>
              <p>Exposez-vous à l'anglais au quotidien (films, séries, podcasts)</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Nos conseils pour progresser</h2>
            <ul className="features-list-page">
              <li>Pratiquez l'anglais tous les jours, même 15 minutes</li>
              <li>Regardez des films et séries en version originale</li>
              <li>Lisez des articles et livres en anglais</li>
              <li>Conversez avec des natifs ou d'autres apprenants</li>
              <li>Utilisez des applications d'apprentissage</li>
              <li>Suivez une formation structurée adaptée à votre niveau</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Commencez par évaluer votre niveau</h2>
            <button className="btn-cta">Passer le test gratuit</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ApprendreAnglais
