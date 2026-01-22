import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HowItWorksSection.css'

function HowItWorksSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleStartTest = () => {
    if (isAuthenticated) {
      navigate('/test')
    } else {
      navigate('/register')
    }
  }

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-content">
          <div className="left-column">
            <h2 className="section-title">Comment ça fonctionne ?</h2>
            
            <ul className="features-list">
              <li>Le test commence au <strong>niveau A1</strong> et progresse jusqu'à <strong>C2</strong></li>
              <li>Il est <strong>adaptatif</strong> : les questions s'ajustent selon vos réponses</li>
              <li>Il s'arrête automatiquement après <strong>3 erreurs</strong></li>
              <li>Vous obtenez un <strong>score clair</strong> et un <strong>niveau CECRL estimé</strong></li>
            </ul>

            <div className="cecrl-levels">
              <div className="transition-image-container">
                <img src="/transi.jpg" alt="Transition" className="transition-image" />
              </div>
              <div className="cecrl-content">
                <h3 className="cecrl-title">COMPRENDRE LES NIVEAUX CECRL</h3>
                <ul className="levels-list">
                  <li><strong>A1</strong> - Mots simples, phrases courtes</li>
                  <li><strong>A2</strong> - Échanges basiques en contexte familier</li>
                  <li><strong>B1</strong> - Compréhension globale, expression autonome</li>
                  <li><strong>B2</strong> - Discours clair, compréhension de nuances</li>
                  <li><strong>C1</strong> - Aisance à l'oral et à l'écrit, vocabulaire professionnel</li>
                  <li><strong>C2</strong> - Maîtrise complète, expression spontanée et précise</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="right-column">
            <h2 className="section-title">Compétences évaluées</h2>
            
            <p className="competences-intro">
              Ce test sous forme de QCM à choix multiples évalue :
            </p>

            <ul className="competences-list">
              <li>
                <span className="check-icon">✓</span>
                Grammaire anglaise
              </li>
              <li>
                <span className="check-icon">✓</span>
                Vocabulaire de base et professionnel
              </li>
              <li>
                <span className="check-icon">✓</span>
                Compréhension écrite
              </li>
              <li>
                <span className="check-icon">✓</span>
                Compréhension orale
              </li>
            </ul>

            <button className="btn-start-test" onClick={handleStartTest}>Je commence le test</button>
            <p className="test-info">Inscription gratuite et rapide</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
