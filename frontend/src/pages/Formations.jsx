import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Formations() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Formations en anglais</h1>
          <p className="page-subtitle">
            Formations certifiantes et éligibles au CPF pour tous les niveaux
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Nos formations</h2>
            <p>
              Nous proposons des formations d'anglais adaptées à tous les niveaux, du débutant (A1) 
              à la maîtrise (C2). Toutes nos formations sont éligibles au CPF et incluent une certification reconnue.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>Anglais général</h3>
              <p>Formation complète pour améliorer toutes vos compétences linguistiques</p>
            </div>

            <div className="step-card">
              <h3>Anglais professionnel</h3>
              <p>Vocabulaire et situations spécifiques au monde du travail</p>
            </div>

            <div className="step-card">
              <h3>Préparation TOEIC</h3>
              <p>Entraînement intensif pour réussir le test TOEIC</p>
            </div>

            <div className="step-card">
              <h3>Anglais conversationnel</h3>
              <p>Focus sur l'expression orale et la fluidité</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Avantages de nos formations</h2>
            <ul className="features-list-page">
              <li>100% finançables par le CPF</li>
              <li>Formateurs natifs et certifiés</li>
              <li>Horaires flexibles adaptés à votre emploi du temps</li>
              <li>Plateforme e-learning accessible 24/7</li>
              <li>Certification incluse (TOEIC, TOEFL, Cambridge)</li>
              <li>Suivi personnalisé de votre progression</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Trouvez la formation adaptée à votre niveau</h2>
            <button className="btn-cta">Évaluer mon niveau</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Formations
