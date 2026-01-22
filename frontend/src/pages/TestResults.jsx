import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './TestResults.css';

function TestResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadResults();
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success && response.data.user) {
        setUserName(response.data.user.full_name || response.data.user.email || 'Étudiant');
      }
    } catch (err) {
      console.error('Error loading user name:', err);
      setUserName(user?.full_name || user?.email || 'Étudiant');
    }
  };

  const loadResults = async () => {
    try {
      const response = await apiService.getMyResults();
      if (response.success && response.data.length > 0) {
        // Prendre le résultat le plus récent
        setResults(response.data[0]);
      } else {
        setError('Aucun résultat disponible');
      }
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  const getCEFRColor = (level) => {
    const colors = {
      'A1': '#ef4444',
      'A2': '#f97316',
      'B1': '#eab308',
      'B2': '#22c55e',
      'C1': '#3b82f6',
      'C2': '#8b5cf6'
    };
    return colors[level] || '#64748b';
  };

  const getCEFRDescription = (level) => {
    const descriptions = {
      'A1': 'Débutant',
      'A2': 'Élémentaire',
      'B1': 'Intermédiaire',
      'B2': 'Intermédiaire Avancé',
      'C1': 'Avancé',
      'C2': 'Maîtrise'
    };
    return descriptions[level] || 'Non évalué';
  };

  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner"></div>
        <p>Calcul de vos résultats...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="results-error">
        <p>{error || 'Aucun résultat disponible'}</p>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Header avec félicitations */}
        <div className="results-header">
          <div className="confetti">🎉</div>
          <h1 className="results-title">
            Félicitations {userName} !
          </h1>
          <p className="results-subtitle">Vous avez terminé le test d'anglais</p>
        </div>

        {/* Score global */}
        <div className="results-overall">
          <div className="overall-card">
            <p className="overall-label">Score Global</p>
            <div className="overall-score">{results.overall_score}</div>
            <div className="overall-level" style={{ backgroundColor: getCEFRColor(results.cefr_level) }}>
              <span className="level-code">{results.cefr_level}</span>
              <span className="level-desc">{getCEFRDescription(results.cefr_level)}</span>
            </div>
          </div>
        </div>

        {/* Scores par compétence */}
        <div className="results-skills">
          <h2 className="skills-title">Détail par Compétence</h2>
          
          <div className="skills-grid">
            {/* Reading */}
            <div className="skill-card">
              <div className="skill-icon">📖</div>
              <h3 className="skill-name">Compréhension Écrite</h3>
              <div className="skill-score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="circle-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="circle-progress"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - results.reading_score / 100)}`
                    }}
                  />
                </svg>
                <div className="circle-text">{results.reading_score}</div>
              </div>
            </div>

            {/* Listening */}
            <div className="skill-card">
              <div className="skill-icon">🎧</div>
              <h3 className="skill-name">Compréhension Orale</h3>
              <div className="skill-score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="circle-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="circle-progress"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - results.listening_score / 100)}`
                    }}
                  />
                </svg>
                <div className="circle-text">{results.listening_score}</div>
              </div>
            </div>

            {/* Speaking */}
            <div className="skill-card">
              <div className="skill-icon">🎤</div>
              <h3 className="skill-name">Expression Orale</h3>
              <div className="skill-score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="circle-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="circle-progress"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - results.speaking_score / 100)}`
                    }}
                  />
                </svg>
                <div className="circle-text">{results.speaking_score}</div>
              </div>
            </div>

            {/* Writing */}
            <div className="skill-card">
              <div className="skill-icon">✍️</div>
              <h3 className="skill-name">Expression Écrite</h3>
              <div className="skill-score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="circle-bg" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    className="circle-progress"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - results.writing_score / 100)}`
                    }}
                  />
                </svg>
                <div className="circle-text">{results.writing_score}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button className="btn-download" onClick={() => navigate('/test/certificate')}>
            📜 Voir le Certificat
          </button>
          <button className="btn-home" onClick={() => navigate('/')}>
            🏠 Retour à l'Accueil
          </button>
        </div>

        {/* Info supplémentaire */}
        <div className="results-info">
          <p className="info-text">
            💡 Vos résultats ont été sauvegardés et sont disponibles dans votre profil
          </p>
          <p className="info-date">
            Test complété le {new Date(results.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestResults;
