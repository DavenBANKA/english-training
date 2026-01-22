import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './TestQuestion.css';

function TestListening() {
  const [questions, setQuestions] = useState([]);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [showReplayChoice, setShowReplayChoice] = useState(false);
  const [passages, setPassages] = useState([]);
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
      console.log('Loading listening questions...');
      const response = await apiService.getQuestions('listening', null, 20);
      console.log('API Response:', response);
      
      if (response.success) {
        const allQuestions = response.data;
        console.log('Questions loaded:', allQuestions.length);
        console.log('First question:', allQuestions[0]);
        
        // Grouper les questions par audio_text (passage)
        const groupedPassages = [];
        const audioTextMap = new Map();
        
        // Si les questions n'ont pas d'audio_text, les grouper par 5
        const hasAudioText = allQuestions.some(q => q.audio_text);
        console.log('Has audio_text:', hasAudioText);
        
        if (hasAudioText) {
          // Grouper par audio_text
          allQuestions.forEach(question => {
            const audioKey = question.audio_text || `passage_${question.id}`;
            if (!audioTextMap.has(audioKey)) {
              audioTextMap.set(audioKey, {
                audioText: question.audio_text,
                audioUrl: question.audio_url,
                questions: []
              });
              groupedPassages.push(audioTextMap.get(audioKey));
            }
            audioTextMap.get(audioKey).questions.push(question);
          });
        } else {
          // Grouper par 5 questions (fallback)
          const questionsPerPassage = 5;
          for (let i = 0; i < allQuestions.length; i += questionsPerPassage) {
            const passageQuestions = allQuestions.slice(i, i + questionsPerPassage);
            if (passageQuestions.length > 0) {
              groupedPassages.push({
                audioText: passageQuestions[0].question_text || 'Audio passage',
                audioUrl: passageQuestions[0].audio_url,
                questions: passageQuestions
              });
            }
          }
        }
        
        console.log('Passages created:', groupedPassages.length);
        setPassages(groupedPassages);
        setQuestions(allQuestions);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl, audioText) => {
    setAudioPlaying(true);
    
    if (audioUrl && !audioUrl.includes('audio-url')) {
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => {
        setAudioPlaying(false);
        handleAudioEnded();
      };
    } else {
      const textToRead = audioText || 'No audio available';
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.onend = () => {
        setAudioPlaying(false);
        handleAudioEnded();
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioEnded = () => {
    const newCount = audioPlayCount + 1;
    setAudioPlayCount(newCount);
    
    if (newCount === 1) {
      // Première écoute terminée, montrer le choix
      setShowReplayChoice(true);
    } else if (newCount === 2) {
      // Deuxième écoute terminée, passer aux questions
      setAudioPlayed(true);
      setShowReplayChoice(false);
    }
  };

  const handleSkipReplay = () => {
    setAudioPlayed(true);
    setShowReplayChoice(false);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    const currentPassage = passages[currentPassageIndex];
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentPassageIndex < passages.length - 1) {
      // Passer au passage suivant
      setCurrentPassageIndex(currentPassageIndex + 1);
      setCurrentQuestionIndex(0);
      setAudioPlayed(false);
      setAudioPlayCount(0);
      setShowReplayChoice(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentPassageIndex > 0) {
      // Retour au passage précédent
      setCurrentPassageIndex(currentPassageIndex - 1);
      const prevPassage = passages[currentPassageIndex - 1];
      setCurrentQuestionIndex(prevPassage.questions.length - 1);
      setAudioPlayed(true);
      setAudioPlayCount(2);
      setShowReplayChoice(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer
      }));

      const testId = localStorage.getItem('current_test_id');
      await apiService.submitAnswers(testId, formattedAnswers);
      
      localStorage.setItem('listening_completed', 'true');
      
      navigate('/test/transition', {
        state: {
          currentSection: 'listening',
          nextSection: '/test/speaking',
          message: 'Assurez-vous que votre microphone est activé'
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

  const getTotalQuestionNumber = () => {
    let total = 0;
    for (let i = 0; i < currentPassageIndex; i++) {
      total += passages[i].questions.length;
    }
    return total + currentQuestionIndex + 1;
  };

  const isLastQuestion = () => {
    return currentPassageIndex === passages.length - 1 && 
           currentQuestionIndex === passages[currentPassageIndex].questions.length - 1;
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

  if (passages.length === 0) {
    return (
      <div className="test-error">
        <p>Aucune question disponible</p>
        <button onClick={() => navigate('/test')}>Retour</button>
      </div>
    );
  }

  const currentPassage = passages[currentPassageIndex];
  const currentQuestion = currentPassage.questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const currentQuestionNumber = getTotalQuestionNumber();

  return (
    <div className="test-page">
      <div className="test-header">
        <div className="test-header-content">
          <h1>Compréhension orale</h1>
          <div className="test-info">
            <span className="test-timer">⏱️ {formatTime(timeLeft)}</span>
            <span className="test-progress">Question {currentQuestionNumber} / {totalQuestions}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}></div>
        </div>
      </div>

      <div className="test-content">
        {!audioPlayed && !showReplayChoice ? (
          <div className="question-container audio-only">
            <div className="audio-section">
              <h2>Passage Audio {currentPassageIndex + 1}</h2>
              <p className="audio-instruction">
                Écoutez attentivement l'enregistrement.<br/>
                Vous pourrez l'écouter 2 fois maximum.
              </p>
              
              <button 
                className="btn-play-audio"
                onClick={() => playAudio(currentPassage.audioUrl, currentPassage.audioText)}
                disabled={audioPlaying}
                title={audioPlaying ? 'Lecture en cours...' : 'Cliquez pour écouter'}
              >
                <img src="/audio.jpg" alt="Play audio" />
              </button>
              
              <p className="audio-play-text">
                {audioPlaying ? '🔊 Lecture en cours...' : 'Cliquez sur l\'image pour écouter'}
              </p>
              
              <p className="audio-warning">
                💡 Vous aurez la possibilité de réécouter une fois
              </p>
            </div>
          </div>
        ) : showReplayChoice ? (
          <div className="question-container audio-only">
            <div className="audio-section">
              <h2>Passage Audio {currentPassageIndex + 1}</h2>
              <p className="audio-instruction">
                Souhaitez-vous réécouter l'enregistrement ?
              </p>
              
              <div className="replay-choice">
                <button 
                  className="btn-replay-audio"
                  onClick={() => playAudio(currentPassage.audioUrl, currentPassage.audioText)}
                  disabled={audioPlaying}
                  title={audioPlaying ? 'Lecture en cours...' : 'Cliquez pour réécouter'}
                >
                  <img src="/audio.jpg" alt="Replay audio" />
                </button>
                
                <p className="replay-text">
                  {audioPlaying ? '🔊 Lecture en cours...' : 'Cliquez pour réécouter (dernière chance)'}
                </p>
                
                <button 
                  className="btn-skip-replay"
                  onClick={handleSkipReplay}
                >
                  Continuer sans réécouter →
                </button>
              </div>
              
              <p className="audio-warning">
                ⚠️ Après cette écoute, vous ne pourrez plus réécouter
              </p>
            </div>
          </div>
        ) : (
          <div className="question-container">
            <div className="passage-info">
              <span className="passage-badge">Texte {currentPassageIndex + 1}</span>
              <span className="question-badge">Question {currentQuestionIndex + 1} / {currentPassage.questions.length}</span>
            </div>

            <div className="question-text">
              <h2>{currentQuestion.question_text}</h2>
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
        )}

        {audioPlayed && (
          <>
            <div className="test-navigation">
              <button 
                className="btn-nav btn-previous" 
                onClick={handlePreviousQuestion}
                disabled={currentPassageIndex === 0 && currentQuestionIndex === 0}
              >
                ← Précédent
              </button>
              
              {isLastQuestion() ? (
                <button 
                  className="btn-nav btn-submit" 
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== totalQuestions}
                >
                  Terminer la section
                </button>
              ) : (
                <button 
                  className="btn-nav btn-next" 
                  onClick={handleNextQuestion}
                >
                  Suivant →
                </button>
              )}
            </div>

            <div className="question-grid">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`question-number ${index === currentQuestionNumber - 1 ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
                  onClick={() => {
                    // Calculer le passage et la question
                    let count = 0;
                    for (let i = 0; i < passages.length; i++) {
                      if (count + passages[i].questions.length > index) {
                        setCurrentPassageIndex(i);
                        setCurrentQuestionIndex(index - count);
                        setAudioPlayed(true);
                        break;
                      }
                      count += passages[i].questions.length;
                    }
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TestListening;
