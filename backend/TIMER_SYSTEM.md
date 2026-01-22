# ⏱️ Système de Timer - Questions TESTNIV

## 📋 Vue d'ensemble

Le système de timer impose une limite de temps pour répondre à chaque question. Si le temps expire, le système passe automatiquement à la question suivante.

## ⏰ Temps par Skill

| Skill | Type de Timer | Durée | Auto-Skip |
|-------|---------------|-------|-----------|
| **Reading** | Par question | 20 secondes | ✅ Oui |
| **Listening** | Par question | 30 secondes | ✅ Oui |
| **Speaking** | Global (toute la section) | 10 minutes (600s) | ✅ Oui |
| **Writing** | Par question | 10 minutes (600s) | ✅ Oui |

### Détails

#### Reading & Listening
- Timer individuel pour chaque question
- Si le temps expire → Passage automatique à la question suivante
- Réponse enregistrée comme "timed_out: true"

#### Speaking
- **Timer global** pour toute la section (10 questions)
- 10 minutes pour compléter les 10 questions Speaking
- Le timer continue pendant toutes les questions
- Si le temps expire → Section terminée automatiquement
- Moyenne: ~1 minute par question

#### Writing
- Timer individuel de 10 minutes par question (5 questions)
- Si le temps expire → Passage automatique à la question suivante
- Total: 50 minutes maximum pour Writing

## 🔧 Implémentation Backend

### 1. Base de Données

Nouvelles colonnes ajoutées :

```sql
-- Table questions
ALTER TABLE questions 
ADD COLUMN time_limit_seconds INTEGER DEFAULT NULL;

-- Table user_answers
ALTER TABLE user_answers 
ADD COLUMN response_time INTEGER DEFAULT 0;
ADD COLUMN timed_out BOOLEAN DEFAULT FALSE;
```

### 2. Configuration des Timers

```sql
-- Reading: 20 secondes par question
UPDATE questions 
SET time_limit_seconds = 20 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'reading');

-- Listening: 30 secondes par question
UPDATE questions 
SET time_limit_seconds = 30 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'listening');

-- Speaking: Timer global de 10 minutes (pas de timer par question)
UPDATE questions 
SET time_limit_seconds = NULL 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'speaking');

-- Writing: 10 minutes (600 secondes) par question
UPDATE questions 
SET time_limit_seconds = 600 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'writing');
```

### 3. API Response

Quand on récupère une question :

```json
{
  "success": true,
  "data": {
    "question": {
      "id": "uuid",
      "question_text": "How old are you? I ________",
      "options": ["a) have 30", "b) have 30 years", ...],
      "time_limit_seconds": 20
    },
    "timer": {
      "enabled": true,
      "seconds": 20,
      "message": "Vous avez 20 secondes pour répondre"
    },
    "progress": {
      "skill": "reading",
      "current": 1,
      "total": 90
    }
  }
}
```

### 4. Soumission avec Timer

```json
POST /api/answers/submit

{
  "test_id": "uuid",
  "answers": [
    {
      "question_id": "uuid",
      "answer": "d",
      "response_time": 15,  // Temps pris en secondes
      "timed_out": false    // Si le timer a expiré
    }
  ]
}
```

## 💻 Implémentation Frontend

### 1. Composant Timer React

```jsx
import { useState, useEffect } from 'react';

function QuestionTimer({ timeLimit, onTimeout, onTick }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        onTick(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout, onTick]);

  const percentage = (timeLeft / timeLimit) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className={isUrgent ? 'urgent' : ''}>
          {timeLeft}s
        </span>
      </div>
      <div className="timer-bar">
        <div 
          className={`timer-progress ${isUrgent ? 'urgent' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default QuestionTimer;
```

### 2. Utilisation dans le Test

```jsx
function ReadingTest() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const handleTimeout = async () => {
    // Timer expiré - soumettre automatiquement
    const responseTime = Math.floor((Date.now() - startTime) / 1000);
    
    await submitAnswer({
      question_id: currentQuestion.id,
      answer: selectedAnswer || 'a', // Réponse par défaut si aucune sélection
      response_time: responseTime,
      timed_out: true
    });

    // Passer à la question suivante
    loadNextQuestion();
  };

  const handleSubmit = async () => {
    const responseTime = Math.floor((Date.now() - startTime) / 1000);
    
    await submitAnswer({
      question_id: currentQuestion.id,
      answer: selectedAnswer,
      response_time: responseTime,
      timed_out: false
    });

    loadNextQuestion();
  };

  return (
    <div className="reading-test">
      {currentQuestion?.time_limit_seconds && (
        <QuestionTimer
          timeLimit={currentQuestion.time_limit_seconds}
          onTimeout={handleTimeout}
          onTick={(time) => console.log(`${time}s restantes`)}
        />
      )}

      <div className="question">
        <h2>{currentQuestion?.question_text}</h2>
        
        <div className="options">
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option[0])}
              className={selectedAnswer === option[0] ? 'selected' : ''}
            >
              {option}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={!selectedAnswer}>
          Valider
        </button>
      </div>
    </div>
  );
}
```

### 3. CSS pour le Timer

```css
.timer-container {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.timer-display {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.timer-display .urgent {
  color: #e74c3c;
  animation: pulse 1s infinite;
}

.timer-bar {
  width: 200px;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background: #3498db;
  transition: width 1s linear;
}

.timer-progress.urgent {
  background: #e74c3c;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

## 🎯 Flux Complet

```
1. Frontend récupère la question
   ↓
2. Vérifie si time_limit_seconds existe
   ↓
3. Si oui, démarre le timer (20s pour Reading)
   ↓
4. Utilisateur sélectionne une réponse
   ↓
5a. Utilisateur clique "Valider" avant expiration
    → Soumettre avec timed_out: false
   ↓
5b. Timer expire (0s)
    → Soumettre automatiquement avec timed_out: true
   ↓
6. Backend enregistre response_time et timed_out
   ↓
7. Passer automatiquement à la question suivante
```

## 📊 Statistiques Timer

Le backend enregistre :
- **response_time** : Temps pris pour répondre (en secondes)
- **timed_out** : Si le timer a expiré (true/false)

Ces données permettent d'analyser :
- Temps moyen de réponse par niveau
- Taux de timeout par utilisateur
- Questions les plus difficiles (temps élevé)

## 🔔 Notifications Utilisateur

### Alertes Visuelles

```jsx
// À 10 secondes
if (timeLeft === 10) {
  showNotification('⏰ 10 secondes restantes');
}

// À 5 secondes
if (timeLeft === 5) {
  showNotification('⚠️ 5 secondes !', 'warning');
}

// Timeout
if (timeLeft === 0) {
  showNotification('⏱️ Temps écoulé ! Passage à la question suivante', 'error');
}
```

### Sons (Optionnel)

```jsx
// À 5 secondes
if (timeLeft === 5) {
  playSound('tick.mp3');
}

// Timeout
if (timeLeft === 0) {
  playSound('timeout.mp3');
}
```

## ⚙️ Configuration Avancée

### Désactiver le Timer (Mode Pratique)

```javascript
// Backend - Endpoint admin
POST /api/admin/toggle-timer
{
  "enabled": false  // Désactiver pour tous les utilisateurs
}

// Ou par utilisateur
POST /api/test/start
{
  "practice_mode": true  // Pas de timer en mode pratique
}
```

### Ajuster le Temps

```sql
-- Augmenter à 30 secondes pour Reading
UPDATE questions 
SET time_limit_seconds = 30 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'reading');
```

## 📱 Responsive

Le timer doit être visible sur mobile :

```css
@media (max-width: 768px) {
  .timer-container {
    top: 10px;
    right: 10px;
    padding: 10px;
  }

  .timer-display {
    font-size: 18px;
  }

  .timer-bar {
    width: 150px;
  }
}
```

## ✅ Checklist Implémentation

- [x] Colonne `time_limit_seconds` ajoutée
- [x] Colonne `response_time` ajoutée
- [x] Colonne `timed_out` ajoutée
- [x] Reading configuré à 20s
- [x] Listening configuré à 30s
- [x] API retourne le timer
- [x] Backend enregistre le temps de réponse
- [ ] Frontend: Composant Timer
- [ ] Frontend: Auto-submit au timeout
- [ ] Frontend: Alertes visuelles
- [ ] Frontend: CSS responsive
- [ ] Tests: Vérifier le timeout
- [ ] Tests: Vérifier l'enregistrement

## 🎉 Résultat

Le système de timer est maintenant configuré :
- ✅ 20 secondes par question Reading
- ✅ 30 secondes par question Listening
- ✅ Passage automatique à la question suivante
- ✅ Enregistrement du temps de réponse
- ✅ Tracking des timeouts

**Prêt pour l'implémentation frontend ! 🚀**


## 🎤 Timer Global Speaking (10 minutes)

### Fonctionnement

Le Speaking a un **timer global** pour toute la section :
- 10 questions Speaking
- 10 minutes au total (600 secondes)
- Le timer démarre au début de la section
- Continue pendant toutes les questions
- Si le temps expire → Section terminée automatiquement

### API Response

```json
{
  "question": {
    "id": "uuid",
    "question_text": "Repeat: In today's highly...",
    "time_limit_seconds": null  // Pas de timer par question
  },
  "timer": {
    "question_timer": null,  // Pas de timer par question
    "skill_timer": {
      "enabled": true,
      "seconds": 480,  // Temps restant (8 minutes)
      "total_seconds": 600,  // Total (10 minutes)
      "message": "Temps restant pour toute la section Speaking: 8:00"
    }
  }
}
```

### Frontend Implementation

```jsx
function SpeakingSection() {
  const [skillTimeLeft, setSkillTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSkillTimeLeft(prev => {
        if (prev <= 0) {
          // Temps écoulé - terminer la section
          finishSpeakingSection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="speaking-section">
      {/* Timer global affiché en permanence */}
      <div className="global-timer">
        <h3>⏱️ Temps restant (Speaking)</h3>
        <div className={`time ${skillTimeLeft <= 60 ? 'urgent' : ''}`}>
          {formatTime(skillTimeLeft)}
        </div>
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(skillTimeLeft / 600) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions Speaking */}
      <SpeakingQuestion 
        question={currentQuestion}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## ✍️ Timer Writing (10 minutes par question)

### Fonctionnement

Chaque question Writing a son propre timer :
- 5 questions Writing
- 10 minutes par question (600 secondes)
- Timer redémarre pour chaque nouvelle question
- Si le temps expire → Passage automatique à la question suivante

### API Response

```json
{
  "question": {
    "id": "uuid",
    "question_text": "Discuss the importance of adaptability...",
    "time_limit_seconds": 600  // 10 minutes
  },
  "timer": {
    "question_timer": {
      "enabled": true,
      "seconds": 600,
      "message": "Vous avez 10 minutes pour répondre"
    },
    "skill_timer": null  // Pas de timer global
  }
}
```

### Frontend Implementation

```jsx
function WritingQuestion({ question, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  return (
    <div className="writing-question">
      {/* Timer + Word Count */}
      <div className="writing-header">
        <div className={`timer ${timeLeft <= 60 ? 'urgent' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className={`word-count ${wordCount < 80 || wordCount > 120 ? 'warning' : 'valid'}`}>
          📝 {wordCount} / 80-120 mots
        </div>
      </div>

      {/* Question */}
      <div className="question-text">
        <h3>{question.question_text}</h3>
      </div>

      {/* Text Area */}
      <textarea
        onChange={handleTextChange}
        placeholder="Écrivez votre réponse ici (80-120 mots)..."
        rows={15}
      />

      <button 
        onClick={handleSubmit}
        disabled={wordCount < 80 || wordCount > 120}
      >
        Soumettre
      </button>
    </div>
  );
}
```

## 📊 Résumé des Timers

| Section | Questions | Timer Type | Durée | Total Max |
|---------|-----------|------------|-------|-----------|
| Reading | 90 | Par question | 20s | 30 min |
| Listening | 26 | Par question | 30s | 13 min |
| Speaking | 10 | Global | 10 min | 10 min |
| Writing | 5 | Par question | 10 min | 50 min |
| **TOTAL** | **131** | - | - | **~103 min** |

## 🎯 Comportements Spécifiques

### Reading & Listening
```
Question 1 → 20s → Auto-skip si timeout
Question 2 → 20s → Auto-skip si timeout
...
```

### Speaking
```
Section démarre → Timer global 10:00
Question 1 → Pas de timer individuel
Question 2 → Pas de timer individuel
...
Question 10 → Fin ou timeout global
```

### Writing
```
Question 1 → Timer 10:00 → Auto-skip si timeout
Question 2 → Timer 10:00 (redémarre) → Auto-skip si timeout
...
Question 5 → Timer 10:00 → Fin
```

## ✅ Checklist Mise à Jour

- [x] Reading: 20s par question
- [x] Listening: 30s par question
- [x] Speaking: 10 min global (pas de timer par question)
- [x] Writing: 10 min par question
- [x] Base de données mise à jour
- [x] API retourne les bons timers
- [x] Documentation complète
- [ ] Frontend: Timer global Speaking
- [ ] Frontend: Timer Writing avec word count
- [ ] Tests: Vérifier tous les timers

🎉 **Système de timer complet et configuré !**
