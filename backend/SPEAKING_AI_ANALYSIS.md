# Speaking Test - Analyse IA Automatique

## Fonctionnement

Le test Speaking enregistre l'audio de l'utilisateur, l'envoie au backend, et l'IA Gemini:
1. **Transcrit** l'audio en texte
2. **Analyse** la réponse selon les critères EFSET
3. **Retourne** un score détaillé avec feedback

## Architecture

### Frontend (`TestSpeaking.jsx`)

1. **Enregistrement Audio**:
   - Utilise `MediaRecorder` API
   - Enregistre en format WAV
   - Bouton Start/Stop avec animations premium

2. **Envoi au Backend**:
   - Crée un `FormData` avec l'audio
   - Envoie à `/api/speaking/analyze`
   - Affiche un spinner pendant l'analyse

3. **Affichage des Résultats**:
   - Score global + niveau CECRL
   - 4 scores détaillés (Fluidité, Grammaire, Vocabulaire, Prononciation)
   - Barres de progression animées
   - Feedback pédagogique de l'IA

### Backend

#### 1. Route (`speaking.routes.js`)
```javascript
POST /api/speaking/analyze
- Authentification requise
- Upload audio avec Multer (max 10MB)
- Formats acceptés: MP3, WAV, OGG, WebM
```

#### 2. Controller (`speaking.controller.js`)
- Reçoit l'audio et `question_id`
- Upload l'audio vers Supabase Storage
- Appelle le service d'analyse

#### 3. Service (`speaking.service.js`)
- Upload l'audio vers Supabase
- Récupère la question (texte attendu + type)
- Appelle Gemini pour transcription
- Appelle Gemini pour analyse
- Sauvegarde dans `speaking_submissions`

#### 4. Gemini Service (`gemini.service.js`)

**Méthode 1: `transcribeAudio(audioBuffer)`**
- Convertit l'audio en base64
- Envoie à Gemini avec prompt de transcription
- Retourne le texte transcrit

**Méthode 2: `analyzeSpeaking(transcript, expectedText, questionType)`**
- Analyse selon le type:
  - **repeat**: Compare avec la phrase originale
  - **answer**: Évalue la pertinence de la réponse
- Retourne JSON avec:
  - `transcript`: Texte transcrit
  - `corrected_text`: Version corrigée
  - `grammar_errors`: Liste des erreurs
  - `fluency_score`: 0-100
  - `grammar_score`: 0-100
  - `vocabulary_score`: 0-100
  - `pronunciation_score`: 0-100
  - `overall_score`: 0-100
  - `cefr_level`: A1-C2
  - `feedback`: Feedback en français

## Types de Questions

### Type 1: Repeat (Répéter)
- L'étudiant écoute une phrase
- Il doit la répéter exactement
- L'IA évalue la précision et la prononciation

### Type 2: Answer (Répondre)
- L'étudiant écoute une question
- Il doit donner une réponse complète
- L'IA évalue la pertinence et la qualité

## Critères d'Évaluation

1. **Fluidité** (Fluency):
   - Débit de parole
   - Pauses et hésitations
   - Cohérence du discours

2. **Grammaire** (Grammar):
   - Structures grammaticales
   - Temps verbaux
   - Accord sujet-verbe

3. **Vocabulaire** (Vocabulary):
   - Richesse lexicale
   - Précision des termes
   - Expressions idiomatiques

4. **Prononciation** (Pronunciation):
   - Clarté de l'articulation
   - Accentuation
   - Intonation

## Stockage

### Supabase Storage
- Bucket: `audio-submissions`
- Path: `speaking/{user_id}/{timestamp}_{filename}`
- Format: WAV, MP3, OGG, WebM

### Base de données
Table: `speaking_submissions`
- `user_id`: UUID de l'utilisateur
- `question_id`: UUID de la question
- `audio_url`: URL publique de l'audio
- `transcript`: Transcription du texte
- `corrected_text`: Version corrigée
- `grammar_errors`: JSON des erreurs
- `fluency_score`: 0-100
- `grammar_score`: 0-100
- `vocabulary_score`: 0-100
- `pronunciation_score`: 0-100
- `overall_score`: 0-100
- `cefr_level`: A1-C2
- `feedback`: Feedback pédagogique

## Design Premium

### États Visuels

1. **Ready to Record**:
   - Grande icône microphone bleue
   - Animation de flottement
   - Bouton "Commencer l'enregistrement"

2. **Recording**:
   - Visualiseur audio (5 barres animées)
   - Indicateur REC avec point rouge clignotant
   - Bouton "Arrêter l'enregistrement"

3. **Analyzing**:
   - Spinner circulaire bleu
   - Icône robot animée
   - Texte "Analyse en cours..."

4. **Results**:
   - Icône de succès verte
   - Score global avec niveau CECRL
   - 4 barres de progression détaillées
   - Feedback dans une boîte jaune

### Animations
- `fadeIn`: Apparition douce
- `slideUp`: Montée des résultats
- `fillBar`: Remplissage des barres de progression
- `spin`: Rotation du spinner
- `pulse`: Pulsation de l'icône
- `wave`: Ondulation des barres audio

## Flux Complet

1. User clique "Écouter" → Audio TTS joue
2. User peut réécouter 1 fois
3. User clique "Commencer l'enregistrement"
4. User parle dans le micro
5. User clique "Arrêter l'enregistrement"
6. Frontend envoie audio au backend
7. Backend upload audio vers Supabase
8. Gemini transcrit l'audio
9. Gemini analyse la transcription
10. Backend sauvegarde dans DB
11. Frontend affiche les résultats
12. User peut passer à la question suivante

## Configuration Requise

### Backend
- Gemini API keys configurées
- Supabase Storage bucket `audio-submissions` créé
- Table `speaking_submissions` créée

### Frontend
- Accès au microphone autorisé
- Navigateur supportant MediaRecorder API
- Connexion internet stable

## Limites

- Taille max audio: 10MB
- Formats: MP3, WAV, OGG, WebM
- Rate limiting: 10 requêtes/minute (AI)
- Timeout: 60 secondes pour l'analyse

## Améliorations Futures

- [ ] Support de plus de formats audio
- [ ] Analyse de la prononciation réelle (pas juste basée sur le texte)
- [ ] Comparaison avec des modèles natifs
- [ ] Détection automatique de la langue
- [ ] Feedback audio avec exemples
- [ ] Historique des enregistrements
- [ ] Graphiques de progression
