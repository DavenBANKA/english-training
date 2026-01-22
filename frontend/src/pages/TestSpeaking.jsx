import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './TestQuestion.css';
import './TestSpeaking.css';

function TestSpeaking() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  
  // Audio states
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [showReplayChoice, setShowReplayChoice] = useState(false);
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
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
      console.log('Loading speaking questions...');
      const response = await apiService.getQuestions('speaking', null, 5);
      console.log('API Response:', response);
      
      if (response.success) {
        setQuestions(response.data);
        console.log('Questions loaded:', response.data.length);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioText) => {
    setAudioPlaying(true);
    
    const utterance = new SpeechSynthesisUtterance(audioText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onend = () => {
      setAudioPlaying(false);
      handleAudioEnded();
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleAudioEnded = () => {
    const newCount = audioPlayCount + 1;
    setAudioPlayCount(newCount);
    
    if (newCount === 1) {
      setShowReplayChoice(true);
    } else if (newCount === 2) {
      setAudioPlayed(true);
      setShowReplayChoice(false);
    }
  };

  const handleSkipReplay = () => {
    setAudioPlayed(true);
    setShowReplayChoice(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        // Analyser automatiquement avec le backend
        await analyzeRecording(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = async (blob) => {
    // Marquer comme complété immédiatement pour permettre de continuer
    setRecordingComplete(true);
    
    // Analyser en arrière-plan
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.wav');
      formData.append('question_id', currentQuestion.id);

      const response = await apiService.analyzeSpeaking(formData);
      
      if (response.success) {
        console.log('✅ Analysis completed:', response.data);
        // Les résultats sont sauvegardés dans la DB
        // On peut les afficher plus tard dans un historique
      }
    } catch (err) {
      console.error('❌ Error analyzing recording:', err);
      // L'erreur n'empêche pas de continuer
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setAudioPlayed(false);
    setAudioPlayCount(0);
    setShowReplayChoice(false);
    setIsRecording(false);
    setRecordingComplete(false);
    setAudioBlob(null);
    setIsAnalyzing(false);
    setAnalysisResult(null);
  };

  const handleSubmit = async () => {
    try {
      localStorage.setItem('speaking_completed', 'true');
      
      navigate('/test/transition', {
        state: {
          currentSection: 'speaking',
          nextSection: '/test/writing',
          message: 'Préparez-vous pour la section d\'écriture'
        }
      });
    } catch (err) {
      setError('Erreur lors de la soumission');
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

  if (questions.length === 0) {
    return (
      <div className="test-error">
        <p>Aucune question disponible</p>
        <button onClick={() => navigate('/test')}>Retour</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="test-page speaking-page">
      <div className="test-header">
        <div className="test-header-content">
          <h1>Expression orale</h1>
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
        {!audioPlayed && !showReplayChoice ? (
          <div className="speaking-container audio-phase">
            <div className="speaking-card">
              <div className="speaking-header">
                <div className="question-badge">Question {currentIndex + 1}</div>
                <h2 className="speaking-title">Écoutez attentivement</h2>
              </div>
              
              <p className="speaking-instruction">
                Vous pourrez écouter l'enregistrement 2 fois maximum
              </p>
              
              <div className="audio-player-container">
                <button 
                  className="btn-audio-premium"
                  onClick={() => playAudio(currentQuestion.audio_text || currentQuestion.question_text)}
                  disabled={audioPlaying}
                >
                  <div className="audio-image-wrapper">
                    <img src="/audio.jpg" alt="Play audio" />
                    {audioPlaying && <div className="audio-pulse"></div>}
                  </div>
                </button>
                
                <p className="audio-status">
                  {audioPlaying ? (
                    <>
                      <span className="status-icon playing">🔊</span>
                      <span className="status-text">Lecture en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">🎧</span>
                      <span className="status-text">Cliquez pour écouter</span>
                    </>
                  )}
                </p>
              </div>
              
              <div className="audio-info-box">
                <span className="info-icon">💡</span>
                <span>Vous aurez la possibilité de réécouter une fois</span>
              </div>
            </div>
          </div>
        ) : showReplayChoice ? (
          <div className="speaking-container replay-phase">
            <div className="speaking-card">
              <div className="speaking-header">
                <div className="question-badge">Question {currentIndex + 1}</div>
                <h2 className="speaking-title">Réécouter ?</h2>
              </div>
              
              <p className="speaking-instruction">
                Souhaitez-vous réécouter l'enregistrement ?
              </p>
              
              <div className="replay-options">
                <button 
                  className="btn-audio-premium replay"
                  onClick={() => playAudio(currentQuestion.audio_text || currentQuestion.question_text)}
                  disabled={audioPlaying}
                >
                  <div className="audio-image-wrapper">
                    <img src="/audio.jpg" alt="Replay audio" />
                    {audioPlaying && <div className="audio-pulse"></div>}
                  </div>
                </button>
                
                <p className="audio-status">
                  {audioPlaying ? (
                    <>
                      <span className="status-icon playing">🔊</span>
                      <span className="status-text">Lecture en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">🔁</span>
                      <span className="status-text">Réécouter (dernière chance)</span>
                    </>
                  )}
                </p>
                
                <button 
                  className="btn-skip-premium"
                  onClick={handleSkipReplay}
                >
                  Continuer sans réécouter →
                </button>
              </div>
              
              <div className="audio-warning-box">
                <span className="warning-icon">⚠️</span>
                <span>Après cette écoute, vous ne pourrez plus réécouter</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="speaking-container recording-phase">
            <div className="speaking-card recording-card">
              <div className="speaking-header">
                <div className="question-badge">Question {currentIndex + 1}</div>
                <h2 className="speaking-title">
                  {currentQuestion.question_type === 'repeat' 
                    ? 'Répétez la phrase'
                    : 'Répondez à la question'}
                </h2>
              </div>
              
              <p className="speaking-instruction">
                {currentQuestion.question_type === 'repeat' 
                  ? 'Répétez exactement la phrase que vous venez d\'entendre'
                  : 'Donnez une réponse complète à la question posée'}
              </p>

              <div className="recording-studio">
                {!recordingComplete ? (
                  <>
                    {!isRecording ? (
                      <div className="recording-ready">
                        <div className="microphone-icon-large">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z" fill="currentColor"/>
                            <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
                          </svg>
                        </div>
                        <p className="recording-prompt">Prêt à enregistrer</p>
                        <button 
                          className="btn-record-premium"
                          onClick={startRecording}
                        >
                          <span className="btn-icon">🎤</span>
                          <span className="btn-text">Commencer l'enregistrement</span>
                        </button>
                      </div>
                    ) : (
                      <div className="recording-active">
                        <div className="recording-visualizer">
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                          <div className="wave-bar"></div>
                        </div>
                        <div className="recording-indicator-premium">
                          <span className="rec-dot"></span>
                          <span className="rec-text">Enregistrement en cours</span>
                        </div>
                        <p className="recording-hint">Parlez clairement dans votre microphone</p>
                        <button 
                          className="btn-stop-premium"
                          onClick={stopRecording}
                        >
                          <span className="btn-icon">⏹️</span>
                          <span className="btn-text">Arrêter l'enregistrement</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="recording-complete">
                    <div className="success-icon-large">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="success-message">Enregistrement sauvegardé !</p>
                    <p className="success-hint">Vous pouvez passer à la question suivante</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {audioPlayed && (
          <>
            <div className="test-navigation-premium">
              <button 
                className="btn-nav-premium btn-previous" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <span className="nav-icon">←</span>
                <span className="nav-text">Précédent</span>
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button 
                  className="btn-nav-premium btn-submit" 
                  onClick={handleSubmit}
                  disabled={!recordingComplete}
                >
                  <span className="nav-text">Terminer la section</span>
                  <span className="nav-icon">✓</span>
                </button>
              ) : (
                <button 
                  className="btn-nav-premium btn-next" 
                  onClick={handleNext}
                  disabled={!recordingComplete}
                >
                  <span className="nav-text">Suivant</span>
                  <span className="nav-icon">→</span>
                </button>
              )}
            </div>

            <div className="question-grid-premium">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`question-number-premium ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'answered' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetQuestion();
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

export default TestSpeaking;
