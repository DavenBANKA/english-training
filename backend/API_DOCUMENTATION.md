# Documentation API EFSET

## 🔗 Base URL

```
http://localhost:3000/api
```

## 🔐 Authentification

Toutes les routes (sauf `/auth/register` et `/auth/login`) nécessitent un token JWT dans le header:

```
Authorization: Bearer <access_token>
```

---

## 📚 Endpoints

### 🔑 Authentification

#### Inscription

```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {...},
    "session": {...}
  }
}
```

#### Connexion

```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "session": {...},
    "access_token": "eyJhbGc..."
  }
}
```

#### Profil

```http
GET /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Réponse:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_metadata": {...}
    }
  }
}
```

---

### 📝 Questions

#### Récupérer les questions par skill

```http
GET /questions?skill=reading&level=B1&limit=20
```

**Query Parameters:**
- `skill` (required): reading, listening, speaking, writing
- `level` (optional): A1, A2, B1, B2, C1, C2
- `limit` (optional): nombre de questions (défaut: 20)

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_text": "Read the text and answer...",
      "question_type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "difficulty_level": "B1",
      "skills": {
        "name": "reading"
      }
    }
  ]
}
```

---

### 🗣️ Speaking

#### Analyser une réponse orale

```http
POST /speaking/analyze
```

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `question_id`: UUID de la question
- `transcript`: Transcription du texte
- `audio`: Fichier audio (optionnel)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "transcript": "I think that...",
    "corrected_text": "I think that...",
    "grammar_errors": [
      {
        "error": "I thinks",
        "correction": "I think",
        "explanation": "Accord sujet-verbe"
      }
    ],
    "fluency_score": 75,
    "grammar_score": 80,
    "vocabulary_score": 70,
    "pronunciation_score": 85,
    "overall_score": 77,
    "cefr_level": "B2",
    "feedback": "Votre réponse montre..."
  }
}
```

#### Historique Speaking

```http
GET /speaking/submissions
```

---

### ✍️ Writing

#### Analyser une rédaction

```http
POST /writing/analyze
```

**Body:**
```json
{
  "question_id": "uuid",
  "text": "In my opinion, technology has changed..."
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "original_text": "In my opinion...",
    "corrected_text": "In my opinion...",
    "errors": [
      {
        "type": "grammar",
        "error": "has changed",
        "correction": "has been changing",
        "explanation": "Utiliser le present perfect continuous"
      }
    ],
    "coherence_score": 80,
    "grammar_score": 75,
    "vocabulary_score": 85,
    "task_achievement_score": 90,
    "overall_score": 82,
    "cefr_level": "B2",
    "feedback": "Votre rédaction est bien structurée...",
    "strengths": ["Vocabulaire riche", "Bonne organisation"],
    "improvements": ["Attention aux temps", "Varier les connecteurs"]
  }
}
```

#### Historique Writing

```http
GET /writing/submissions
```

---

### ✅ Réponses (Reading/Listening)

#### Soumettre des réponses QCM

```http
POST /answers/submit
```

**Body:**
```json
{
  "test_id": "uuid",
  "answers": [
    {
      "question_id": "uuid1",
      "answer": "A"
    },
    {
      "question_id": "uuid2",
      "answer": "C"
    }
  ]
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "score": 75,
    "cefr_level": "B2",
    "correct": 15,
    "total": 20,
    "details": [
      {
        "question_id": "uuid1",
        "user_answer": "A",
        "correct_answer": "A",
        "is_correct": true
      }
    ]
  }
}
```

---

### 📊 Résultats

#### Mes résultats

```http
GET /results/me
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "overall_score": 78,
      "cefr_level": "B2",
      "reading_score": 80,
      "listening_score": 75,
      "speaking_score": 77,
      "writing_score": 82,
      "skill_scores": {...},
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Calculer résultat global

```http
POST /results/calculate
```

**Body:**
```json
{
  "test_id": "uuid"
}
```

---

## 🎯 Niveaux CECRL

| Niveau | Score | Description |
|--------|-------|-------------|
| A1 | 0-30 | Débutant |
| A2 | 31-45 | Élémentaire |
| B1 | 46-60 | Intermédiaire |
| B2 | 61-75 | Intermédiaire avancé |
| C1 | 76-90 | Avancé |
| C2 | 91-100 | Maîtrise |

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## 📝 Exemples d'utilisation

### JavaScript (Fetch)

```javascript
// Connexion
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  return data.data.access_token;
};

// Analyser Writing
const analyzeWriting = async (token, questionId, text) => {
  const response = await fetch('http://localhost:3000/api/writing/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      question_id: questionId,
      text: text
    })
  });
  return await response.json();
};
```

### Python (Requests)

```python
import requests

# Connexion
response = requests.post('http://localhost:3000/api/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})
token = response.json()['data']['access_token']

# Récupérer questions
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    'http://localhost:3000/api/questions',
    params={'skill': 'reading', 'limit': 10},
    headers=headers
)
questions = response.json()['data']
```
