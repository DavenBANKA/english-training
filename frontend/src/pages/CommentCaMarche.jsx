import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function CommentCaMarche() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Comment ça marche ?</h1>
          <p className="page-subtitle">
            Découvrez notre méthode simple et efficace pour évaluer votre niveau d'anglais
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Un test adaptatif et intelligent</h2>
            <p>
              Notre test utilise une technologie adaptative qui ajuste la difficulté des questions en fonction de vos réponses. 
              Cela permet une évaluation précise de votre niveau en un minimum de temps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Démarrez le test</h3>
              <p>Cliquez sur "Commencer le test" et répondez aux premières questions de niveau A1.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Progression adaptative</h3>
              <p>Le test s'adapte à vos réponses et augmente progressivement la difficulté jusqu'à votre niveau réel.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Arrêt automatique</h3>
              <p>Le test s'arrête après 3 erreurs consécutives pour déterminer précisément votre niveau CECRL.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Résultats instantanés</h3>
              <p>Obtenez immédiatement votre niveau (A1 à C2) avec des recommandations personnalisées.</p>
            </div>
          </div>

          <div className="content-section">
            <h2>Les compétences évaluées</h2>
            <ul className="features-list-page">
              <li>Grammaire anglaise et structures de phrases</li>
              <li>Vocabulaire général et professionnel</li>
              <li>Compréhension écrite de textes variés</li>
              <li>Compréhension orale (si applicable)</li>
            </ul>
          </div>

          <div className="cta-section-page">
            <h2>Prêt à découvrir votre niveau ?</h2>
            <button className="btn-cta">Commencer le test maintenant</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CommentCaMarche
