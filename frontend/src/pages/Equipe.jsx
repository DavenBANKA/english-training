import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Equipe() {
  return (
    <div className="page">
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">L'équipe</h1>
          <p className="page-subtitle">
            Une équipe passionnée au service de votre apprentissage
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Notre mission</h2>
            <p>
              Chez Conseilux Language Academy, nous croyons que l'apprentissage de l'anglais doit être accessible à tous.
              Notre équipe d'experts en pédagogie et en technologie travaille chaque jour pour vous offrir
              les meilleurs outils d'évaluation et de formation.
            </p>
          </div>

          <div className="content-section">
            <h2>Notre expertise</h2>
            <ul className="features-list-page">
              <li>Plus de 10 ans d'expérience dans l'enseignement de l'anglais</li>
              <li>Équipe certifiée et formée aux standards CECRL</li>
              <li>Développeurs spécialisés en EdTech</li>
              <li>Partenariats avec les plus grandes institutions</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Rejoignez des milliers d'apprenants</h2>
            <button className="btn-cta">Commencer maintenant</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Equipe
