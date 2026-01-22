import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './TestStart.css'

function Test() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleStartTest = () => {
    if (!isAuthenticated) {
      navigate('/register')
    } else {
      navigate('/test/reading')
    }
  }

  return (
    <div className="test-start-page">
      <Navbar />
      
      <section className="test-hero">
        <div className="test-hero-content">
          <h1 className="test-title">Test d'anglais complet</h1>
          <p className="test-subtitle">
            Évaluez vos 4 compétences linguistiques en 90 minutes
          </p>
        </div>
      </section>

      <section className="test-content">
        <div className="test-container">
          <div className="test-info-section">
            <h2>Comment fonctionne le test ?</h2>
            <p>
              Notre test d'anglais évalue vos compétences selon le référentiel CECRL (A1 à C2). 
              Il se compose de 4 sections qui testent différentes compétences linguistiques.
            </p>
          </div>

          <div className="test-sections-grid">
            <div className="test-section-card">
              <div className="section-icon">📖</div>
              <h3>Compréhension écrite</h3>
              <p className="section-duration">25 minutes</p>
              <p>Lisez des textes et répondez à des questions de compréhension</p>
            </div>

            <div className="test-section-card">
              <div className="section-icon">🎧</div>
              <h3>Compréhension orale</h3>
              <p className="section-duration">25 minutes</p>
              <p>Écoutez des enregistrements et répondez aux questions</p>
            </div>

            <div className="test-section-card">
              <div className="section-icon">🗣️</div>
              <h3>Expression orale</h3>
              <p className="section-duration">20 minutes</p>
              <p>Enregistrez vos réponses orales à des questions</p>
            </div>

            <div className="test-section-card">
              <div className="section-icon">✍️</div>
              <h3>Expression écrite</h3>
              <p className="section-duration">20 minutes</p>
              <p>Rédigez des textes sur des sujets donnés</p>
            </div>
          </div>

          <div className="test-features">
            <h2>Caractéristiques du test</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Test adaptatif</strong>
                  <p>Les questions s'ajustent à votre niveau</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Résultats détaillés</strong>
                  <p>Score par compétence et niveau CECRL global</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Certificat officiel</strong>
                  <p>Téléchargez votre certificat de résultats</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-check">✓</span>
                <div>
                  <strong>Recommandations</strong>
                  <p>Conseils personnalisés pour progresser</p>
                </div>
              </div>
            </div>
          </div>

          <div className="test-requirements">
            <h3>Avant de commencer</h3>
            <ul>
              <li>Assurez-vous d'avoir une connexion internet stable</li>
              <li>Prévoyez environ 90 minutes sans interruption</li>
              <li>Utilisez un casque ou des écouteurs pour la section orale</li>
              <li>Autorisez l'accès au microphone pour l'expression orale</li>
            </ul>
          </div>

          <div className="test-cta">
            <button className="btn-start-test-main" onClick={handleStartTest}>
              Commencer le test complet
            </button>
            <p className="test-note">Durée totale : environ 90 minutes</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Test
