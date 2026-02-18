import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './WhyTestSection.css'

function WhyTestSection() {
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
    <section className="why-test-section">
      <div className="why-test-container">
        <div className="why-test-content">
          <div className="left-content">
            <h2 className="why-test-title">
              Pourquoi faire ce<br />test avec Conseilux Language Academy ?
            </h2>

            <ul className="why-test-list">
              <li><strong>Inscription gratuite et rapide</strong></li>
              <li>Test complet : environ 90 minutes</li>
              <li>Aligné sur les référentiels CECRL (A1 à C2)</li>
              <li>Évaluation précise pour orienter vers une <strong>formation CPF</strong></li>
              <li>Certificat détaillé et recommandations personnalisées</li>
            </ul>
          </div>

          <div className="right-content">
            <div className="cta-box">
              <p className="cta-text">
                <strong>Connaître votre niveau, c'est le premier pas vers des progrès concrets.</strong>
              </p>
              <p className="cta-subtext">
                Cliquez ci-dessous pour démarrer<br />votre test d'anglais en ligne
              </p>
              <button className="btn-start-main" onClick={handleStartTest}>Je commence le test</button>
              <p className="cta-info">Gratuit et sans inscription</p>
            </div>

            <div className="flag-decoration">
              <img src="/american-flag.jpg" alt="American Flag" className="flag-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyTestSection
