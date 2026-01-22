# Speaking Test - Flux d'Analyse Simplifié

## Architecture Sans Stockage Audio

Le système analyse l'audio en arrière-plan sans le sauvegarder, permettant à l'utilisateur de continuer immédiatement.

## Flux Complet

### 1. Frontend - Enregistrement
```
User clique "Commencer l'enregistrement"
  ↓
MediaRecorder capture l'audio
  ↓
User clique "Arrêter l'enregistrement"
  ↓
Audio converti en Blob (WAV)
  ↓
✅ Bouton "Suivant" activé IMMÉDIATEMENT
  ↓
User peut passer à la question suivante
```

### 2. Backend - Analyse en Arrière-Plan
```
Frontend envoie audio + question_id
  ↓
Backend reçoit le buffer audio
  ↓
Gemini transcrit l'audio → Texte
  ↓
Gemini analyse le texte transcrit
  ↓
Résultats sauvegardés dans speaking_submissions
  ↓
✅ Analyse terminée (user déjà passé à la suite)
```

## Avantages

✅ **Pas de blocage** - User continue immédiatement
✅ **Pas de stockage** - Pas besoin de bucket Supabase
✅ **Analyse complète** - Transcription + évaluation IA
✅ **Résultats sauvegardés** - Dans la base de données

## Composants

### Frontend (`TestSpeaking.jsx`)

```javascript
const analyzeRecording = async (blob) => {
  // 1. Débloquer immédiatement
  setRecordingComplete(true);
  
  // 2. Analyser en arrière-plan
  try {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');
    formData.append('question_id', currentQuestion.id);
    
    await apiService.analyzeSpeaking(formData);
    console.log('✅ Analysis completed');
  } catch (err) {
    console.error('❌ Error:', err);
    // L'erreur n'empêche pas de continuer
  }
};
```

### Backend Controller

```javascript
async analyze(req, res, next) {
  const { question_id } = req.body;
  const userId = req.user.id;
  const audioBuffer = req.file.buffer;
  
  // Analyser directement sans upload
  const result = await speakingService.analyzeResponseDirect(
    userId,
    question_id,
    audioBuffer
  );
  
  res.json(result);
}
```

### Backend Service

```javascript
async analyzeResponseDirect(userId, questionId, audioBuffer) {
  // 1. Récupérer la question
  const question = await getQuestion(questionId);
  
  // 2. Transcrire avec Gemini
  const transcript = await geminiService.transcribeAudio(audioBuffer);
  
  // 3. Analyser le texte transcrit
  const analysis = await geminiService.analyzeSpeaking(
    transcript,
    question.audio_text,
    question.question_type
  );
  
  // 4. Sauvegarder dans DB
  await saveToDatabase(userId, questionId, transcript, analysis);
  
  return { success: true, data: analysis };
}
```

### Gemini Service

**Méthode 1: Transcription**
```javascript
async transcribeAudio(audioBuffer) {
  const audioBase64 = audioBuffer.toString('base64');
  
  const result = await gemini.generateContent([
    {
      inlineData: {
        mimeType: 'audio/wav',
        data: audioBase64
      }
    },
    { text: 'Transcribe this audio in English. Return ONLY the text.' }
  ]);
  
  return result.response.text().trim();
}
```

**Méthode 2: Analyse du Texte**
```javascript
async analyzeSpeaking(transcript, expectedText, questionType) {
  const prompt = `
    Analyze this English response:
    Expected: ${expectedText}
    Student said: ${transcript}
    Type: ${questionType} (repeat or answer)
    
    Return JSON with:
    - fluency_score (0-100)
    - grammar_score (0-100)
    - vocabulary_score (0-100)
    - pronunciation_score (0-100)
    - overall_score (0-100)
    - cefr_level (A1-C2)
    - feedback (in French)
  `;
  
  const result = await gemini.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

## Base de Données

### Table: `speaking_submissions`

```sql
CREATE TABLE speaking_submissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES questions(id),
  audio_url TEXT NULL,  -- NULL car pas de stockage
  transcript TEXT,      -- Texte transcrit
  corrected_text TEXT,  -- Version corrigée
  grammar_errors JSONB, -- Liste des erreurs
  fluency_score INTEGER,
  grammar_score INTEGER,
  vocabulary_score INTEGER,
  pronunciation_score INTEGER,
  overall_score INTEGER,
  cefr_level VARCHAR(2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Critères d'Évaluation

### 1. Fluidité (Fluency)
- Débit de parole
- Pauses et hésitations
- Cohérence du discours

### 2. Grammaire (Grammar)
- Structures grammaticales
- Temps verbaux
- Accord sujet-verbe

### 3. Vocabulaire (Vocabulary)
- Richesse lexicale
- Précision des termes
- Expressions appropriées

### 4. Prononciation (Pronunciation)
- Clarté de l'articulation
- Accentuation
- Intonation (basée sur le texte)

## Types de Questions

### Type 1: Repeat
- User écoute une phrase
- User répète la phrase
- IA compare avec l'original
- Score basé sur la précision

### Type 2: Answer
- User écoute une question
- User donne une réponse
- IA évalue la pertinence
- Score basé sur la qualité

## Exemple de Résultat

```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "transcript": "Technology has changed how we communicate...",
    "corrected_text": "Technology has changed how we communicate...",
    "grammar_errors": [
      {
        "error": "we communicates",
        "correction": "we communicate",
        "explanation": "Accord sujet-verbe"
      }
    ],
    "fluency_score": 85,
    "grammar_score": 78,
    "vocabulary_score": 82,
    "pronunciation_score": 80,
    "overall_score": 81,
    "cefr_level": "B2",
    "feedback": "Bonne fluidité générale. Attention à l'accord sujet-verbe. Vocabulaire approprié pour le niveau B2."
  }
}
```

## Performance

- **Transcription**: ~2-5 secondes
- **Analyse**: ~3-7 secondes
- **Total**: ~5-12 secondes
- **User bloqué**: 0 secondes ✅

## Logs Console

Frontend:
```
✅ Analysis completed: { overall_score: 81, cefr_level: "B2", ... }
```

Backend:
```
info: Request completed {"method":"POST","url":"/api/speaking/analyze","status":200,"duration":"8234ms"}
```

## Migration Future (Optionnelle)

Si vous voulez ajouter le stockage audio plus tard:

1. Créer bucket Supabase `audio-submissions`
2. Modifier `analyzeResponseDirect` → `analyzeResponse`
3. Ajouter `uploadAudio()` avant transcription
4. Sauvegarder `audio_url` dans DB

Le code est déjà prêt dans `speaking.service.js` (commenté).

## Résumé

✅ **Système actif** - Transcription + analyse fonctionnelle
✅ **Pas de blocage** - User continue immédiatement
✅ **Analyse IA** - Gemini transcrit et évalue
✅ **Résultats sauvegardés** - Dans `speaking_submissions`
✅ **Pas de stockage** - Pas besoin de bucket Supabase
