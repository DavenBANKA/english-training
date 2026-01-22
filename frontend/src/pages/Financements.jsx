import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Financements() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Financements</h1>
          <p className="page-subtitle">
            Financez votre formation d'anglais avec le CPF et autres dispositifs
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Le Compte Personnel de Formation (CPF)</h2>
            <p>
              Le CPF vous permet de financer votre formation d'anglais sans débourser un centime. 
              Chaque actif dispose d'un budget formation qu'il peut utiliser librement.
            </p>
            <ul className="features-list-page">
              <li>Formations 100% financées par votre CPF</li>
              <li>Aucun frais à avancer</li>
              <li>Certifications reconnues (TOEIC, TOEFL, Cambridge)</li>
              <li>Formations adaptées à votre niveau</li>
            </ul>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Passez le test</h3>
              <p>Évaluez votre niveau actuel gratuitement</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Consultez votre CPF</h3>
              <p>Vérifiez votre budget disponible sur moncompteformation.gouv.fr</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Choisissez votre formation</h3>
              <p>Sélectionnez une formation adaptée à votre niveau</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Inscrivez-vous</h3>
              <p>Validez votre inscription directement sur le site CPF</p>
            </div>
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

export default Financements
