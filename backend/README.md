# API EFSET - Backend

API backend professionnelle pour plateforme d'évaluation du niveau d'anglais type EFSET.

## 🚀 Stack Technique

- **Node.js** (ESM)
- **Express.js** - Framework web
- **Supabase** - Auth, PostgreSQL, Storage
- **Gemini AI** - Analyse et notation IA
- **JWT** - Authentification

## 📁 Structure du Projet

```
backend/
├── src/
│   ├── app.js                 # Configuration Express
│   ├── server.js              # Point d'entrée
│   ├── config/
│   │   ├── supabase.js        # Configuration Supabase
│   │   └── gemini.js          # Configuration Gemini AI
│   ├── routes/                # Routes API
│   ├── controllers/           # Contrôleurs
│   ├── services/              # Logique métier
│   ├── middlewares/           # Middlewares
│   └── utils/                 # Utilitaires
├── .env                       # Variables d'environnement
└── package.json
```

## 🔧 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du dossier backend:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Server
PORT=3000
NODE_ENV=development
```

## 🗄️ Base de Données Supabase

### Tables à créer:

```sql
-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tests
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id),
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  options JSONB,
  correct_answer TEXT,
  difficulty_level VARCHAR(10),
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Answers
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  test_id UUID REFERENCES tests(id),
  question_id UUID REFERENCES questions(id),
  user_answer TEXT,
  is_correct BOOLEAN,
  score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Speaking Submissions
CREATE TABLE speaking_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES questions(id),
  audio_url TEXT,
  transcript TEXT,
  corrected_text TEXT,
  grammar_errors JSONB,
  fluency_score INTEGER,
  grammar_score INTEGER,
  vocabulary_score INTEGER,
  pronunciation_score INTEGER,
  overall_score INTEGER,
  cefr_level VARCHAR(2),
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Writing Submissions
CREATE TABLE writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES questions(id),
  original_text TEXT,
  corrected_text TEXT,
  errors JSONB,
  coherence_score INTEGER,
  grammar_score INTEGER,
  vocabulary_score INTEGER,
  task_achievement_score INTEGER,
  overall_score INTEGER,
  cefr_level VARCHAR(2),
  feedback TEXT,
  strengths JSONB,
  improvements JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  test_id UUID REFERENCES tests(id),
  reading_score INTEGER,
  listening_score INTEGER,
  speaking_score INTEGER,
  writing_score INTEGER,
  overall_score INTEGER,
  cefr_level VARCHAR(2),
  skill_scores JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Storage Bucket:

Créer un bucket `audio-submissions` dans Supabase Storage pour les fichiers audio.

## 🚀 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 📡 Endpoints API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur

### Questions
- `GET /api/questions?skill=reading` - Questions par skill
- `GET /api/questions/:id` - Question spécifique
- `POST /api/questions` - Créer question (admin)

### Speaking
- `POST /api/speaking/analyze` - Analyser réponse orale
- `GET /api/speaking/submissions` - Historique

### Writing
- `POST /api/writing/analyze` - Analyser rédaction
- `GET /api/writing/submissions` - Historique

### Answers (Reading/Listening)
- `POST /api/answers/submit` - Soumettre réponses QCM

### Results
- `GET /api/results/me` - Mes résultats
- `POST /api/results/calculate` - Calculer résultat global

## 🔐 Authentification

Toutes les routes (sauf register/login) nécessitent un token JWT:

```
Authorization: Bearer <token>
```

## 🤖 Intégration Gemini AI

L'API utilise Gemini 1.5 Pro pour:
- Analyser les réponses Speaking/Writing
- Corriger les erreurs grammaticales
- Fournir un feedback pédagogique
- Calculer les scores et niveaux CECRL

## 📊 Niveaux CECRL

- **A1**: 0-30 points
- **A2**: 31-45 points
- **B1**: 46-60 points
- **B2**: 61-75 points
- **C1**: 76-90 points
- **C2**: 91-100 points

## 🛡️ Sécurité

- Authentification JWT via Supabase
- Validation des entrées
- Gestion centralisée des erreurs
- Rate limiting recommandé en production
- CORS configuré

## 📝 Licence

MIT
