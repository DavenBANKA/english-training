# 🎯 Flux du Test TESTNIV - Spécifications Détaillées

## 📚 READING (90 Questions)

### Format
- ✅ **Texte visible** : Question + 4 options (a, b, c, d)
- ✅ **Pas d'audio**
- ✅ **Réponse** : Clic sur une option (QCM)

### Fonctionnement
1. L'utilisateur voit la question écrite
2. L'utilisateur voit les 4 options (a, b, c, d)
3. L'utilisateur clique sur une réponse
4. **Validation automatique** : Correct/Incorrect
5. Passage automatique à la question suivante

### Exemple API
```javascript
GET /api/questions?skill=reading&limit=90

// Réponse
{
  "question_text": "How old are you? I ________",
  "options": ["a) have 30", "b) have 30 years", "c) am 30 years", "d) am 30 years old"],
  "audio_url": null  // Pas d'audio pour Reading
}

// Soumission
POST /api/answers/submit
{
  "question_id": "uuid",
  "answer": "d"  // Réponse choisie
}
```

---

## 🎧 LISTENING (26 Questions)

### Format
- ❌ **Pas de texte visible** pour la question
- ✅ **Audio uniquement** : L'utilisateur écoute la question/histoire
- ✅ **Options visibles** : 4 choix (a, b, c, d) affichés à l'écran
- ✅ **Réponse** : Clic sur une option (QCM)

### Fonctionnement
1. L'utilisateur clique sur "Play" pour écouter l'audio
2. L'audio contient le contexte + la question
3. Les 4 options de réponse sont **affichées à l'écran** (texte)
4. L'utilisateur clique sur une réponse
5. **Validation automatique** : Correct/Incorrect
6. Passage automatique à la question suivante

### Exemple API
```javascript
GET /api/questions?skill=listening&limit=26

// Réponse
{
  "question_text": "Where does Sarah live?",  // Texte pour référence backend
  "audio_url": "https://supabase.co/audio/listening_a1_1.mp3",  // Audio à jouer
  "options": ["a) Paris", "b) London", "c) New York", "d) Berlin"]  // Options VISIBLES
}

// Soumission
POST /api/answers/submit
{
  "question_id": "uuid",
  "answer": "b"  // Réponse choisie
}
```

### Note Importante
- L'audio contient : "Hello, my name is Sarah. I live in London..."
- La question "Where does Sarah live?" peut être dans l'audio OU affichée
- Les options sont TOUJOURS affichées à l'écran

---

## 🗣️ SPEAKING (10 Questions)

### Format
- ❌ **Pas de texte visible**
- ✅ **Audio uniquement** : L'utilisateur écoute
- ✅ **Réponse vocale** : L'utilisateur enregistre sa voix
- ✅ **Évaluation IA** : Gemini analyse prononciation + contenu

### Partie 1 : Listen & Repeat (5 questions)
**Objectif** : Répéter exactement ce qu'on entend

1. L'utilisateur clique sur "Play"
2. L'audio joue une phrase complexe
3. L'utilisateur clique sur "Record" et répète la phrase
4. L'utilisateur clique sur "Stop" et "Submit"
5. **Gemini AI évalue** :
   - ✅ Prononciation
   - ✅ Fluidité
   - ✅ Exactitude (a-t-il bien répété ?)
   - ✅ Intonation

### Partie 2 : Listen & Answer (5 questions)
**Objectif** : Répondre à une question avec ses propres mots

1. L'utilisateur clique sur "Play"
2. L'audio pose une question (ex: "How has technology changed communication?")
3. L'utilisateur clique sur "Record" et répond (20 secondes)
4. L'utilisateur clique sur "Stop" et "Submit"
5. **Gemini AI évalue** :
   - ✅ Prononciation
   - ✅ Grammaire
   - ✅ Vocabulaire
   - ✅ Pertinence de la réponse
   - ✅ Fluidité

### Exemple API
```javascript
GET /api/questions?skill=speaking&limit=10

// Réponse
{
  "question_text": "In today's highly competitive global economy...",  // Pour référence
  "audio_url": "https://supabase.co/audio/speaking_repeat_1.mp3",
  "question_type": "listen_repeat"  // ou "listen_answer"
}

// Soumission
POST /api/speaking/analyze
Content-Type: multipart/form-data

{
  "question_id": "uuid",
  "audio": <fichier audio enregistré>,
  "transcript": "transcription automatique ou manuelle"  // Optionnel
}

// Réponse Gemini
{
  "transcript": "In todays highly competitive...",
  "corrected_text": "In today's highly competitive...",
  "pronunciation_score": 85,
  "fluency_score": 80,
  "grammar_score": 90,
  "overall_score": 85,
  "cefr_level": "B2",
  "feedback": "Bonne prononciation générale. Attention à l'apostrophe dans 'today's'..."
}
```

---

## ✍️ WRITING (5 Tasks)

### Format
- ✅ **Texte visible** : Question/sujet affiché
- ❌ **Pas d'audio**
- ✅ **Réponse écrite** : Zone de texte (80-120 mots)
- ✅ **Évaluation IA** : Gemini analyse grammaire + contenu

### Fonctionnement
1. L'utilisateur voit le sujet écrit à l'écran
2. L'utilisateur tape sa réponse (80-120 mots)
3. Un compteur de mots est affiché en temps réel
4. L'utilisateur clique sur "Submit"
5. **Gemini AI évalue** :
   - ✅ Grammaire
   - ✅ Vocabulaire
   - ✅ Cohérence
   - ✅ Réalisation de la tâche (a-t-il répondu au sujet ?)
   - ✅ Structure

### Exemple API
```javascript
GET /api/questions?skill=writing&limit=5

// Réponse
{
  "question_text": "Discuss the importance of adaptability and continuous learning in achieving long-term professional success. (80-120 words)",
  "question_type": "essay",
  "audio_url": null
}

// Soumission
POST /api/writing/analyze
{
  "question_id": "uuid",
  "text": "In today's rapidly changing world, adaptability has become..."  // 100 mots
}

// Réponse Gemini
{
  "original_text": "In today's rapidly changing world...",
  "corrected_text": "In today's rapidly changing world...",
  "errors": [
    {
      "type": "grammar",
      "error": "has became",
      "correction": "has become",
      "explanation": "Participe passé irrégulier"
    }
  ],
  "coherence_score": 85,
  "grammar_score": 80,
  "vocabulary_score": 90,
  "task_achievement_score": 95,
  "overall_score": 87,
  "cefr_level": "B2",
  "feedback": "Excellente structure et vocabulaire riche...",
  "strengths": ["Vocabulaire varié", "Bonne organisation"],
  "improvements": ["Attention aux verbes irréguliers"]
}
```

---

## 🔄 Navigation Entre Questions

### Règle Générale
**Une fois qu'on répond à une question, on passe automatiquement à la suivante.**

### Implémentation Frontend
```javascript
// Après soumission d'une réponse
const submitAnswer = async () => {
  await api.submitAnswer(currentQuestion, userAnswer);
  
  // Passer à la question suivante
  currentQuestionIndex++;
  
  if (currentQuestionIndex < totalQuestions) {
    loadNextQuestion();
  } else {
    // Test terminé
    showResults();
  }
};
```

### Pas de Retour en Arrière
- ❌ L'utilisateur ne peut pas revenir à une question précédente
- ✅ Chaque réponse est finale
- ✅ Progression linéaire : Q1 → Q2 → Q3 → ... → Fin

---

## 📊 Résumé des Formats

| Skill | Question | Options | Réponse | Évaluation |
|-------|----------|---------|---------|------------|
| **Reading** | ✅ Texte | ✅ Texte (4 choix) | Clic | Auto (Correct/Incorrect) |
| **Listening** | ❌ Audio | ✅ Texte (4 choix) | Clic | Auto (Correct/Incorrect) |
| **Speaking** | ❌ Audio | ❌ Aucune | 🎤 Audio | IA (Score + Feedback) |
| **Writing** | ✅ Texte | ❌ Aucune | ⌨️ Texte | IA (Score + Feedback) |

---

## 🎯 Endpoints API Résumé

```javascript
// 1. Récupérer les questions
GET /api/questions?skill=reading&limit=90
GET /api/questions?skill=listening&limit=26
GET /api/questions?skill=speaking&limit=10
GET /api/questions?skill=writing&limit=5

// 2. Soumettre les réponses
POST /api/answers/submit          // Reading + Listening (QCM)
POST /api/speaking/analyze        // Speaking (Audio + IA)
POST /api/writing/analyze         // Writing (Texte + IA)

// 3. Résultats
GET /api/results/me               // Tous les résultats
POST /api/results/calculate       // Calculer score global
```

---

## 🚀 Flux Complet du Test

```
1. Utilisateur se connecte
   ↓
2. Démarre le test
   ↓
3. READING (90 questions)
   - Lit question → Clique réponse → Question suivante
   ↓
4. LISTENING (26 questions)
   - Écoute audio → Clique réponse → Question suivante
   ↓
5. SPEAKING (10 questions)
   - Écoute audio → Enregistre voix → IA évalue → Question suivante
   ↓
6. WRITING (5 tâches)
   - Lit sujet → Tape réponse → IA évalue → Tâche suivante
   ↓
7. Calcul du score global
   ↓
8. Affichage du niveau CECRL (A1-C2)
```

---

## 💡 Points Clés pour le Frontend

1. **Listening** : Afficher les options en texte même si la question est en audio
2. **Speaking** : Implémenter un enregistreur audio (MediaRecorder API)
3. **Writing** : Compteur de mots en temps réel (80-120 mots)
4. **Navigation** : Pas de retour en arrière, progression linéaire
5. **Timer** : Optionnel pour chaque section
6. **Progress Bar** : Afficher "Question 5/90" pour chaque section
