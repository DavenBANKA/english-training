import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './TestQuestion.css';

function TestReading() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const loadQuestions = async () => {
    try {
      const response = await apiService.getQuestions('reading', null, 20);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer
      }));

      const testId = localStorage.getItem('current_test_id') || crypto.randomUUID();
      localStorage.setItem('current_test_id', testId);

      await apiService.submitAnswers(testId, formattedAnswers);
      
      localStorage.setItem('reading_completed', 'true');
      
      // Rediriger vers la page de transition
      navigate('/test/transition', {
        state: {
          currentSection: 'reading',
          nextSection: '/test/listening',
          message: 'Préparez-vous pour la section d\'écoute'
        }
      });
    } catch (err) {
      setError('Erreur lors de la soumission des réponses');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="test-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-error">
        <p>{error}</p>
        <button onClick={() => navigate('/test')}>Retour</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-header-content">
          <h1>Compréhension écrite</h1>
          <div className="test-info">
            <span className="test-timer">⏱️ {formatTime(timeLeft)}</span>
            <span className="test-progress">Question {currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="test-content">
        <div className="question-container">
          <div className="question-text">
            <h2>Question {currentIndex + 1}</h2>
            <p>{currentQuestion.question_text}</p>
          </div>

          <div className="options-container">
            {currentQuestion.options && currentQuestion.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswer(currentQuestion.id, option)}
                />
                <span className="option-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button 
            className="btn-nav btn-previous" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Précédent
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button 
              className="btn-nav btn-submit" 
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
            >
              Terminer la section
            </button>
          ) : (
            <button 
              className="btn-nav btn-next" 
              onClick={handleNext}
            >
              Suivant →
            </button>
          )}
        </div>

        <div className="question-grid">
          {questions.map((q, index) => (
            <button
              key={q.id}
              className={`question-number ${index === currentIndex ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestReading;
