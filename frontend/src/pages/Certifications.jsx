import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Certifications() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Certifications anglais</h1>
          <p className="page-subtitle">
            Préparez et passez les certifications reconnues internationalement
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Les principales certifications</h2>
            <p>
              Les certifications d'anglais sont essentielles pour valoriser votre CV, 
              postuler à l'étranger ou accéder à certaines formations.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>TOEIC</h3>
              <p>La certification la plus demandée en entreprise. Score de 10 à 990 points.</p>
            </div>

            <div className="step-card">
              <h3>TOEFL</h3>
              <p>Requis pour les études universitaires aux États-Unis et au Canada.</p>
            </div>

            <div className="step-card">
              <h3>Cambridge</h3>
              <p>Certifications reconnues mondialement (FCE, CAE, CPE).</p>
            </div>

            <div className="step-card">
              <h3>Linguaskill</h3>
              <p>Test adaptatif en ligne de Cambridge, résultats en 48h.</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Nos préparations aux certifications</h2>
            <ul className="features-list-page">
              <li>Formations spécifiques à chaque certification</li>
              <li>Tests blancs et examens d'entraînement</li>
              <li>Stratégies et astuces pour maximiser votre score</li>
              <li>Correction détaillée de vos erreurs</li>
              <li>Financement CPF disponible</li>
              <li>Passage de l'examen inclus</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Préparez votre certification</h2>
            <button className="btn-cta">Évaluer mon niveau</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Certifications
