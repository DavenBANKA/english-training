import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './TestQuestion.css';

function TestWriting() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [texts, setTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [submitting, setSubmitting] = useState(false);
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
      const response = await apiService.getQuestions('writing', null, 2);
      if (response.success) {
        setQuestions(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (questionId, text) => {
    setTexts({
      ...texts,
      [questionId]: text
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
    setSubmitting(true);
    try {
      const testId = localStorage.getItem('current_test_id');
      
      // Soumettre chaque rédaction
      for (const [questionId, text] of Object.entries(texts)) {
        await apiService.analyzeWriting(questionId, text);
      }
      
      localStorage.setItem('writing_completed', 'true');
      
      // Calculer les résultats finaux
      await apiService.calculateResults(testId);
      
      // Rediriger vers la page de résultats
      navigate('/test/results');
    } catch (err) {
      setError('Erreur lors de la soumission des réponses');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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
  const currentText = texts[currentQuestion.id] || '';
  const wordCount = getWordCount(currentText);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-header-content">
          <h1>Expression écrite</h1>
          <div className="test-info">
            <span className="test-timer">⏱️ {formatTime(timeLeft)}</span>
            <span className="test-progress">Rédaction {currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="test-content">
        <div className="question-container">
          <div className="question-text">
            <h2>Rédaction {currentIndex + 1}</h2>
            <p>{currentQuestion.question_text}</p>
            
            <div className="writing-requirements">
              <p><strong>Consignes :</strong></p>
              <ul>
                <li>Minimum 150 mots recommandés</li>
                <li>Structurez votre texte avec une introduction, un développement et une conclusion</li>
                <li>Utilisez un vocabulaire varié et des structures grammaticales appropriées</li>
                <li>Restez dans le sujet demandé</li>
              </ul>
            </div>
          </div>

          <div className="writing-section">
            <div className="writing-header">
              <label htmlFor="writing-text">Votre rédaction :</label>
              <span className={`word-count ${wordCount < 150 ? 'warning' : 'success'}`}>
                {wordCount} mots {wordCount < 150 && '(minimum 150 recommandés)'}
              </span>
            </div>
            <textarea
              id="writing-text"
              value={currentText}
              onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
              placeholder="Commencez à écrire votre réponse ici..."
              rows="15"
              className="writing-textarea"
            />
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
              disabled={submitting || Object.keys(texts).length !== questions.length}
            >
              {submitting ? 'Envoi en cours...' : 'Terminer le test'}
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
              className={`question-number ${index === currentIndex ? 'active' : ''} ${texts[q.id] && getWordCount(texts[q.id]) >= 50 ? 'answered' : ''}`}
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

export default TestWriting;
