import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './TestStart.css'

function TestStart() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleStartTest = () => {
    if (!isAuthenticated) {
      navigate('/register')
      return
    }
    navigate('/test/reading')
  }

  return (
    <div className="test-start-page">
      <Navbar />
      
      <main className="test-start-content">
        <div className="test-start-container">
          <div className="test-start-header">
            <h1>Test d'Anglais Complet</h1>
            <p className="test-subtitle">Évaluez vos compétences en anglais selon le référentiel CECRL</p>
          </div>

          <div className="test-overview">
            <div className="test-section-card">
              <div className="section-icon">📖</div>
              <h3>Reading</h3>
              <p className="section-count">90 questions</p>
              <p className="section-desc">Compréhension écrite avec questions à choix multiples</p>
              <div className="section-time">⏱️ ~30 minutes</div>
            </div>

            <div className="test-section-card">
              <div className="section-icon">🎧</div>
              <h3>Listening</h3>
              <p className="section-count">26 questions</p>
              <p className="section-desc">Compréhension orale avec audio et QCM</p>
              <div className="section-time">⏱️ ~20 minutes</div>
            </div>

            <div className="test-section-card">
              <div className="section-icon">🗣️</div>
              <h3>Speaking</h3>
              <p className="section-count">10 questions</p>
              <p className="section-desc">Expression orale avec enregistrement vocal</p>
              <div className="section-time">⏱️ ~15 minutes</div>
            </div>

            <div className="test-section-card">
              <div className="section-icon">✍️</div>
              <h3>Writing</h3>
              <p className="section-count">5 tâches</p>
              <p className="section-desc">Expression écrite (80-120 mots par tâche)</p>
              <div className="section-time">⏱️ ~25 minutes</div>
            </div>
          </div>

          <div className="test-info-box">
            <h3>📋 Informations importantes</h3>
            <ul>
              <li>Le test complet dure environ <strong>90 minutes</strong></li>
              <li>Vous devez compléter toutes les sections dans l'ordre</li>
              <li>Vous ne pouvez pas revenir en arrière sur les questions</li>
              <li>Vos résultats seront disponibles immédiatement après le test</li>
              <li>Assurez-vous d'avoir une connexion internet stable</li>
              <li>Pour le Speaking, vous aurez besoin d'un microphone</li>
            </ul>
          </div>

          <div className="test-start-actions">
            <button className="btn-start-test" onClick={handleStartTest}>
              Commencer le test
            </button>
            <button className="btn-back" onClick={() => navigate('/')}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TestStart
