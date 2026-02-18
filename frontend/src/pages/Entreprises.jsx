import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Entreprises() {
  return (
    <div className="page">
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Pour les entreprises</h1>
          <p className="page-subtitle">
            Des solutions d'évaluation et de formation pour vos équipes
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Évaluez et formez vos collaborateurs</h2>
            <p>
              Conseilux Language Academy propose des solutions sur mesure pour les entreprises souhaitant évaluer
              et améliorer le niveau d'anglais de leurs équipes.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>Tests d'évaluation</h3>
              <p>Évaluez rapidement le niveau de vos collaborateurs avec nos tests certifiés CECRL</p>
            </div>

            <div className="step-card">
              <h3>Formations sur mesure</h3>
              <p>Programmes adaptés aux besoins spécifiques de votre secteur d'activité</p>
            </div>

            <div className="step-card">
              <h3>Suivi personnalisé</h3>
              <p>Tableaux de bord et rapports détaillés sur la progression de vos équipes</p>
            </div>

            <div className="step-card">
              <h3>Certifications</h3>
              <p>Préparez vos collaborateurs aux certifications TOEIC, TOEFL et Cambridge</p>
            </div>
          </div>

          <div className="cta-section-page">
            <h2>Intéressé par nos solutions entreprise ?</h2>
            <button className="btn-cta">Contactez-nous</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Entreprises
