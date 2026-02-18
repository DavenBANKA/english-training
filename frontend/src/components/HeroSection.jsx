import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './HeroSection.css'

function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const handleStartTest = () => {
    if (isAuthenticated) {
      navigate('/test')
    } else {
      navigate('/register')
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="/fonds.jpg"
          alt="Background"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Testez vos compétences
            <br />
            <span className="highlight">linguistiques</span>
          </h1>
          <p className="hero-description">
            Une plateforme professionnelle pour évaluer vos capacités en lecture,
            écoute, expression orale et écrite. Obtenez des résultats précis et
            améliorez vos compétences.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartTest}>Commencer un test</button>
            <button className="btn-secondary" onClick={() => navigate('/comment-ca-marche')}>En savoir plus</button>
            {(() => {
              const userEmail = (user?.email || user?.user?.email || user?.user_metadata?.email)?.toLowerCase().trim();
              const isAdmin = userEmail && ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'].includes(userEmail);
              return isAdmin && (
                <button className="btn-admin-hero" onClick={() => navigate('/admin')}>Page Admin</button>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
