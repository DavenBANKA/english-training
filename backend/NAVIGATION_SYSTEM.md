# 🧭 Système de Navigation - Questions TESTNIV

## 📋 Vue d'ensemble

Le système de navigation permet à l'utilisateur de :
1. ✅ **Répondre et avancer** - Soumettre une réponse et passer automatiquement à la suivante
2. ✅ **Passer une question** - Skip avec confirmation obligatoire
3. ❌ **Pas de retour en arrière** - Progression linéaire uniquement

## 🎯 Comportements

### 1. Répondre et Avancer (Normal)

Quand l'utilisateur répond à une question :

```javascript
// 1. Soumettre la réponse
POST /api/answers/submit
{
  "test_id": "uuid",
  "answers": [{
    "question_id": "uuid",
    "answer": "d",
    "response_time": 15,
    "timed_out": false
  }]
}

// 2. Passer automatiquement à la suivante
POST /api/test/next/:sessionId

// 3. Charger la question suivante
GET /api/test/next-question/:sessionId
```

**Flux:**
```
Utilisateur répond → Submit → Auto-next → Question suivante
```

### 2. Passer une Question (Skip)

Quand l'utilisateur veut passer sans répondre :

#### Étape 1 : Demande de skip (sans confirmation)

```javascript
POST /api/test/skip/:sessionId
{
  "confirmed": false  // Ou ne pas envoyer
}

// Réponse
{
  "success": false,
  "error": "Confirmation requise",
  "message": "Êtes-vous sûr de vouloir passer cette question ? Vous ne pourrez pas y revenir.",
  "requires_confirmation": true
}
```

#### Étape 2 : Skip confirmé

```javascript
POST /api/test/skip/:sessionId
{
  "confirmed": true
}

// Réponse
{
  "success": true,
  "data": {
    "message": "Question passée",
    "current_index": 2,
    "skipped": true
  }
}
```

**Flux:**
```
Utilisateur clique "Passer" 
  → Modal de confirmation
  → Utilisateur confirme
  → Question enregistrée comme "skipped"
  → Passage automatique à la suivante
```

### 3. Timeout Automatique

Quand le timer expire :

```javascript
// Soumission automatique avec timeout
POST /api/answers/submit
{
  "answers": [{
    "question_id": "uuid",
    "answer": "a",  // Réponse par défaut ou null
    "response_time": 20,
    "timed_out": true
  }]
}

// Passage automatique
POST /api/test/next/:sessionId
```

**Flux:**
```
Timer atteint 0s 
  → Auto-submit (timed_out: true)
  → Passage automatique à la suivante
```

## 💻 Implémentation Frontend

### Composant Question avec Navigation

```jsx
import { useState } from 'react';

function QuestionWithNavigation({ question, sessionId, onNext }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soumettre la réponse et avancer
  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Soumettre la réponse
      await api.submitAnswer({
        question_id: question.id,
        answer: selectedAnswer,
        response_time: calculateResponseTime(),
        timed_out: false
      });

      // 2. Passer à la suivante
      await api.moveToNext(sessionId);

      // 3. Charger la question suivante
      onNext();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demander à passer la question
  const handleSkipRequest = () => {
    setShowSkipConfirm(true);
  };

  // Confirmer le skip
  const handleSkipConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // Skip avec confirmation
      await api.skipQuestion(sessionId, { confirmed: true });

      // Charger la question suivante
      onNext();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
      setShowSkipConfirm(false);
    }
  };

  return (
    <div className="question-container">
      {/* Question */}
      <div className="question">
        <h2>{question.question_text}</h2>
        
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option[0])}
              className={selectedAnswer === option[0] ? 'selected' : ''}
              disabled={isSubmitting}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          onClick={handleSkipRequest}
          className="btn-skip"
          disabled={isSubmitting}
        >
          ⏭️ Passer cette question
        </button>

        <button
          onClick={handleSubmit}
          className="btn-submit"
          disabled={!selectedAnswer || isSubmitting}
        >
          {isSubmitting ? 'Envoi...' : 'Valider et Continuer →'}
        </button>
      </div>

      {/* Modal de Confirmation Skip */}
      {showSkipConfirm && (
        <SkipConfirmModal
          onConfirm={handleSkipConfirm}
          onCancel={() => setShowSkipConfirm(false)}
        />
      )}
    </div>
  );
}

export default QuestionWithNavigation;
```

### Modal de Confirmation

```jsx
function SkipConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>⚠️ Passer cette question ?</h3>
        <p>
          Êtes-vous sûr de vouloir passer cette question ?
        </p>
        <p className="warning">
          <strong>Attention :</strong> Vous ne pourrez pas y revenir.
          La question sera comptée comme incorrecte.
        </p>

        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-cancel">
            ❌ Annuler
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            ✅ Oui, passer
          </button>
        </div>
      </div>
    </div>
  );
}
```

### CSS

```css
.question-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  gap: 20px;
}

.btn-skip {
  padding: 12px 24px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.btn-skip:hover:not(:disabled) {
  background: #7f8c8d;
}

.btn-submit {
  padding: 12px 32px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
  flex: 1;
}

.btn-submit:hover:not(:disabled) {
  background: #2980b9;
}

.btn-submit:disabled,
.btn-skip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin-top: 0;
  color: #e74c3c;
}

.modal-content .warning {
  background: #fff3cd;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  margin: 15px 0;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.btn-cancel {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-cancel:hover {
  background: #bdc3c7;
}

.btn-confirm {
  background: #e74c3c;
  color: white;
}

.btn-confirm:hover {
  background: #c0392b;
}
```

## 📊 Tracking des Actions

Le backend enregistre :

```sql
-- user_answers
response_time: INTEGER    -- Temps pris pour répondre
timed_out: BOOLEAN        -- Si le timer a expiré
skipped: BOOLEAN          -- Si la question a été passée
```

### Statistiques Possibles

```javascript
// Questions passées par utilisateur
SELECT COUNT(*) FROM user_answers 
WHERE user_id = 'uuid' AND skipped = true;

// Taux de timeout
SELECT 
  COUNT(*) FILTER (WHERE timed_out = true) * 100.0 / COUNT(*) as timeout_rate
FROM user_answers 
WHERE user_id = 'uuid';

// Temps moyen de réponse
SELECT AVG(response_time) 
FROM user_answers 
WHERE user_id = 'uuid' AND skipped = false;
```

## 🎯 Flux Complet

```
┌─────────────────────────────────────┐
│  Question affichée                  │
│  Timer démarre                      │
└─────────────────────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Utilisateur choisit │
    └─────────────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
   ┌────────┐  ┌────────┐
   │Répondre│  │ Passer │
   └────────┘  └────────┘
        │           │
        │           ▼
        │    ┌──────────────┐
        │    │ Confirmation │
        │    │  requise?    │
        │    └──────────────┘
        │           │
        │      ┌────┴────┐
        │      │         │
        │      ▼         ▼
        │   ┌───┐    ┌──────┐
        │   │Oui│    │Annuler│
        │   └───┘    └──────┘
        │      │         │
        ▼      ▼         │
   ┌─────────────┐      │
   │  Enregistrer│      │
   │   réponse   │      │
   └─────────────┘      │
        │               │
        ▼               │
   ┌─────────────┐      │
   │ Passer à la │◄─────┘
   │  suivante   │
   └─────────────┘
        │
        ▼
   ┌─────────────┐
   │  Question   │
   │  suivante   │
   └─────────────┘
```

## ✅ Règles Importantes

1. ✅ **Pas de retour en arrière** - Une fois passé, on ne peut pas revenir
2. ✅ **Confirmation obligatoire** - Pour éviter les clics accidentels
3. ✅ **Skip enregistré** - Compté comme incorrect dans les stats
4. ✅ **Timer continue** - Le skip ne stoppe pas le timer global (Speaking)
5. ✅ **Auto-submit au timeout** - Pas besoin de confirmation

## 🎨 UX Recommandations

1. **Bouton "Passer"** - Couleur neutre (gris), moins visible que "Valider"
2. **Modal de confirmation** - Claire et explicite sur les conséquences
3. **Bouton "Valider"** - Couleur primaire (bleu), bien visible
4. **Désactiver pendant submit** - Éviter les double-clics
5. **Feedback visuel** - Loading state pendant la soumission

## 📱 Responsive

```css
@media (max-width: 768px) {
  .navigation-buttons {
    flex-direction: column-reverse;
  }

  .btn-skip,
  .btn-submit {
    width: 100%;
  }

  .modal-content {
    margin: 20px;
    max-width: calc(100% - 40px);
  }
}
```

## 🎉 Résultat

Le système de navigation est maintenant complet :
- ✅ Répondre et avancer automatiquement
- ✅ Passer avec confirmation obligatoire
- ✅ Pas de retour en arrière
- ✅ Tracking complet (skip, timeout, response_time)
- ✅ UX claire et sécurisée

**Prêt pour l'implémentation frontend ! 🚀**
