import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Entreprise() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">L'entreprise</h1>
          <p className="page-subtitle">
            English Training, votre partenaire pour l'apprentissage de l'anglais
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Qui sommes-nous ?</h2>
            <p>
              English Training est une plateforme innovante dédiée à l'évaluation et à la formation en anglais. 
              Fondée en 2020, nous avons déjà accompagné plus de 50 000 apprenants dans leur parcours linguistique.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <h3>50 000+</h3>
              <p>Utilisateurs satisfaits</p>
            </div>

            <div className="step-card">
              <h3>95%</h3>
              <p>Taux de satisfaction</p>
            </div>

            <div className="step-card">
              <h3>100%</h3>
              <p>Gratuit et sans engagement</p>
            </div>

            <div className="step-card">
              <h3>24/7</h3>
              <p>Disponible à tout moment</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Nos partenaires</h2>
            <p>
              Nous travaillons en étroite collaboration avec les organismes de formation certifiés, 
              les entreprises et les institutions éducatives pour offrir les meilleures opportunités d'apprentissage.
            </p>
          </div>

          <div className="cta-section-page">
            <h2>Commencez votre parcours aujourd'hui</h2>
            <button className="btn-cta">Évaluer mon niveau</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Entreprise
