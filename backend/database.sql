-- Script SQL pour créer les tables Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- Table Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Tests
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50),
  options JSONB,
  correct_answer TEXT,
  difficulty_level VARCHAR(10),
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table User Answers
CREATE TABLE IF NOT EXISTS user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table Speaking Submissions
CREATE TABLE IF NOT EXISTS speaking_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
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

-- Table Writing Submissions
CREATE TABLE IF NOT EXISTS writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
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

-- Table Results
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  reading_score INTEGER,
  listening_score INTEGER,
  speaking_score INTEGER,
  writing_score INTEGER,
  overall_score INTEGER,
  cefr_level VARCHAR(2),
  skill_scores JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertion des skills de base
INSERT INTO skills (name, description) VALUES
  ('reading', 'Compréhension écrite'),
  ('listening', 'Compréhension orale'),
  ('speaking', 'Expression orale'),
  ('writing', 'Expression écrite')
ON CONFLICT (name) DO NOTHING;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_user ON speaking_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_user ON writing_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);

-- Activer Row Level Security
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS user_answers_policy ON user_answers;
DROP POLICY IF EXISTS speaking_policy ON speaking_submissions;
DROP POLICY IF EXISTS writing_policy ON writing_submissions;
DROP POLICY IF EXISTS results_policy ON results;

-- Créer les politiques RLS
CREATE POLICY user_answers_policy ON user_answers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY speaking_policy ON speaking_submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY writing_policy ON writing_submissions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY results_policy ON results
  FOR ALL USING (auth.uid() = user_id);

-- Table pour gérer les sessions de test
CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  current_skill VARCHAR(50) DEFAULT 'reading',
  current_question_index INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  skill_started_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les sessions
CREATE INDEX IF NOT EXISTS idx_test_sessions_user ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);

-- RLS pour test_sessions
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS test_sessions_policy ON test_sessions;

CREATE POLICY test_sessions_policy ON test_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Ajouter une colonne pour le temps de réponse
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS response_time INTEGER DEFAULT 0;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS timed_out BOOLEAN DEFAULT FALSE;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS skipped BOOLEAN DEFAULT FALSE;

-- Ajouter une colonne pour le temps limite par question
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER DEFAULT NULL;

-- Ajouter une colonne pour le temps limite global par skill dans test_sessions
ALTER TABLE test_sessions ADD COLUMN IF NOT EXISTS skill_time_limit_seconds INTEGER DEFAULT NULL;
ALTER TABLE test_sessions ADD COLUMN IF NOT EXISTS skill_started_at TIMESTAMP DEFAULT NULL;

-- Mettre à jour les questions Reading avec un timer de 20 secondes
UPDATE questions 
SET time_limit_seconds = 20 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'reading');

-- Mettre à jour les questions Listening avec un timer de 30 secondes
UPDATE questions 
SET time_limit_seconds = 30 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'listening');

-- Speaking: Pas de timer par question (timer global de 10 min pour toute la section)
UPDATE questions 
SET time_limit_seconds = NULL 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'speaking');

-- Writing: 10 minutes (600 secondes) par question
UPDATE questions 
SET time_limit_seconds = 600 
WHERE skill_id = (SELECT id FROM skills WHERE name = 'writing');
