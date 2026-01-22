import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TestTransition.css';

function TestTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextSection, currentSection, message } = location.state || {};
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      navigate(nextSection);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate, nextSection]);

  const getSectionInfo = (section) => {
    const sections = {
      reading: {
        title: 'Compréhension écrite',
        icon: '📖',
        description: 'Lisez des textes et répondez à des questions',
        duration: '25 minutes',
        questions: '20 questions'
      },
      listening: {
        title: 'Compréhension orale',
        icon: '🎧',
        description: 'Écoutez des enregistrements et répondez aux questions',
        duration: '25 minutes',
        questions: '20 questions'
      },
      speaking: {
        title: 'Expression orale',
        icon: '🗣️',
        description: 'Enregistrez vos réponses orales',
        duration: '20 minutes',
        questions: '5 questions'
      },
      writing: {
        title: 'Expression écrite',
        icon: '✍️',
        description: 'Rédigez des textes sur des sujets donnés',
        duration: '20 minutes',
        questions: '2 rédactions'
      }
    };
    return sections[section] || {};
  };

  const nextInfo = getSectionInfo(nextSection?.split('/').pop());
  const currentInfo = getSectionInfo(currentSection);

  return (
    <div className="transition-page">
      <div className="transition-container">
        {currentSection && (
          <div className="section-completed">
            <div className="completion-icon">✓</div>
            <h2>Section terminée !</h2>
            <p className="completion-message">
              {currentInfo.title} complétée avec succès
            </p>
          </div>
        )}

        <div className="next-section-info">
          <div className="section-icon-large">{nextInfo.icon}</div>
          <h1>Prochaine section</h1>
          <h2 className="section-title">{nextInfo.title}</h2>
          <p className="section-description">{nextInfo.description}</p>

          <div className="section-details">
            <div className="detail-item">
              <span className="detail-icon">⏱️</span>
              <span className="detail-text">{nextInfo.duration}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📝</span>
              <span className="detail-text">{nextInfo.questions}</span>
            </div>
          </div>

          {message && (
            <div className="transition-message">
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="countdown-section">
          <p className="countdown-text">La section commence dans</p>
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
          <button 
            className="btn-start-now"
            onClick={() => navigate(nextSection)}
          >
            Commencer maintenant
          </button>
        </div>

        <div className="progress-indicator">
          <div className="progress-step completed">
            <div className="step-circle">✓</div>
            <span>Reading</span>
          </div>
          <div className={`progress-line ${currentSection === 'reading' ? 'active' : ''}`}></div>
          <div className={`progress-step ${['listening', 'speaking', 'writing'].includes(currentSection) ? 'completed' : nextSection?.includes('listening') ? 'active' : ''}`}>
            <div className="step-circle">{['listening', 'speaking', 'writing'].includes(currentSection) ? '✓' : '2'}</div>
            <span>Listening</span>
          </div>
          <div className={`progress-line ${['listening', 'speaking'].includes(currentSection) ? 'active' : ''}`}></div>
          <div className={`progress-step ${['speaking', 'writing'].includes(currentSection) ? 'completed' : nextSection?.includes('speaking') ? 'active' : ''}`}>
            <div className="step-circle">{['speaking', 'writing'].includes(currentSection) ? '✓' : '3'}</div>
            <span>Speaking</span>
          </div>
          <div className={`progress-line ${currentSection === 'speaking' ? 'active' : ''}`}></div>
          <div className={`progress-step ${currentSection === 'writing' ? 'completed' : nextSection?.includes('writing') ? 'active' : ''}`}>
            <div className="step-circle">{currentSection === 'writing' ? '✓' : '4'}</div>
            <span>Writing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestTransition;
