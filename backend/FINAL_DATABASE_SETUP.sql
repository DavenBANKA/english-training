-- ========================================================================================
-- MASTER SETUP SCRIPT FOR EFSET SUPABASE DATABASE
-- This script contains ALL the structure, security policies, and seed data (questions)
-- ========================================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES
-- ========================================================================================

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
  audio_text TEXT,
  time_limit_seconds INTEGER DEFAULT NULL,
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
  response_time INTEGER DEFAULT 0,
  timed_out BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
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
  id UUID PRIMARY KEY PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Table for test sessions
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
  skill_time_limit_seconds INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. INDEXES
-- ========================================================================================
CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_user ON speaking_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_user ON writing_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_user ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================================
-- Enable RLS
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing if any
DROP POLICY IF EXISTS user_answers_policy ON user_answers;
DROP POLICY IF EXISTS speaking_policy ON speaking_submissions;
DROP POLICY IF EXISTS writing_policy ON writing_submissions;
DROP POLICY IF EXISTS results_policy ON results;
DROP POLICY IF EXISTS test_sessions_policy ON test_sessions;

DROP POLICY IF EXISTS user_answers_select_policy ON user_answers;
DROP POLICY IF EXISTS user_answers_insert_policy ON user_answers;
DROP POLICY IF EXISTS user_answers_update_policy ON user_answers;
DROP POLICY IF EXISTS user_answers_delete_policy ON user_answers;

DROP POLICY IF EXISTS speaking_select_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_insert_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_update_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_delete_policy ON speaking_submissions;

DROP POLICY IF EXISTS writing_select_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_insert_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_update_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_delete_policy ON writing_submissions;

DROP POLICY IF EXISTS results_select_policy ON results;
DROP POLICY IF EXISTS results_insert_policy ON results;
DROP POLICY IF EXISTS results_update_policy ON results;
DROP POLICY IF EXISTS results_delete_policy ON results;

-- Policy pour user_answers (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY user_answers_select_policy ON user_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_answers_insert_policy ON user_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_answers_update_policy ON user_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_answers_delete_policy ON user_answers FOR DELETE USING (auth.uid() = user_id);

-- Policy pour speaking_submissions (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY speaking_select_policy ON speaking_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY speaking_insert_policy ON speaking_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY speaking_update_policy ON speaking_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY speaking_delete_policy ON speaking_submissions FOR DELETE USING (auth.uid() = user_id);

-- Policy pour writing_submissions (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY writing_select_policy ON writing_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY writing_insert_policy ON writing_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY writing_update_policy ON writing_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY writing_delete_policy ON writing_submissions FOR DELETE USING (auth.uid() = user_id);

-- Policy pour results (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY results_select_policy ON results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY results_insert_policy ON results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY results_update_policy ON results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY results_delete_policy ON results FOR DELETE USING (auth.uid() = user_id);

-- Policy pour test_sessions
CREATE POLICY test_sessions_policy ON test_sessions FOR ALL USING (auth.uid() = user_id);

-- 5. INITIAL DATA (SKILLS & TESTS)
-- ========================================================================================
INSERT INTO skills (name, description) VALUES
  ('reading', 'Compréhension écrite'),
  ('listening', 'Compréhension orale'),
  ('speaking', 'Expression orale'),
  ('writing', 'Expression écrite')
ON CONFLICT (name) DO NOTHING;

INSERT INTO tests (name, description, duration_minutes) VALUES
  ('English Placement Test', 'Test complet d''évaluation de niveau CECRL (A1-C2)', 60)
ON CONFLICT (name) DO NOTHING;

-- 6. QUESTION SEED DATA
-- ========================================================================================
DO $$
DECLARE
  reading_skill_id UUID;
  listening_skill_id UUID;
  speaking_skill_id UUID;
  writing_skill_id UUID;
BEGIN
  -- Récupérer les IDs des skills
  SELECT id INTO reading_skill_id FROM skills WHERE name = 'reading';
  SELECT id INTO listening_skill_id FROM skills WHERE name = 'listening';
  SELECT id INTO speaking_skill_id FROM skills WHERE name = 'speaking';
  SELECT id INTO writing_skill_id FROM skills WHERE name = 'writing';

  -- READING QUESTIONS (90 questions)
  -- --------------------------------------------------------------------------------------
  
  -- Q1-Q15 (A1 Level)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (reading_skill_id, 'How old are you? I ________', 'multiple_choice', '["a) have 30", "b) have 30 years", "c) am 30 years", "d) am 30 years old"]', 'd', 'A1', 20),
  (reading_skill_id, 'Please, _________ you speak slower?', 'multiple_choice', '["a) could", "b) will", "c) do", "d) are"]', 'a', 'A1', 20),
  (reading_skill_id, 'London is the capital of the United ________ .', 'multiple_choice', '["a) country", "b) land", "c) headquarters", "d) Kingdom"]', 'd', 'A1', 20),
  (reading_skill_id, 'I''ll wait for you _________.', 'multiple_choice', '["a) house", "b) at home", "c) home", "d) to home"]', 'b', 'A1', 20),
  (reading_skill_id, 'I love _________ abroad.', 'multiple_choice', '["a) to travelling", "b) travel", "c) to travel", "d) is travelling"]', 'c', 'A1', 20),
  (reading_skill_id, 'I am so ____________. I need to eat something.', 'multiple_choice', '["a) thirsty", "b) sleepy", "c) hungry", "d) exhausted"]', 'c', 'A1', 20),
  (reading_skill_id, 'Where _______ you from? - Australia.', 'multiple_choice', '["a) do", "b) is", "c) come", "d) are"]', 'd', 'A1', 20),
  (reading_skill_id, 'I live ______ Los Angeles.', 'multiple_choice', '["a) to", "b) in", "c) at", "d) of"]', 'b', 'A1', 20),
  (reading_skill_id, 'How ____ you spell your name, please? - R-I-C-H-A-R-D-S.', 'multiple_choice', '["a) are", "b) does", "c) write", "d) do"]', 'd', 'A1', 20),
  (reading_skill_id, 'They _______ go to the cinema.', 'multiple_choice', '["a) tomorrow", "b) rarely", "c) much", "d) rare"]', 'b', 'A1', 20),
  (reading_skill_id, 'My sister ______ born on the 1st of April 1995.', 'multiple_choice', '["a) is", "b) was", "c) had", "d) has been"]', 'b', 'A1', 20),
  (reading_skill_id, 'Is this a small city? - No, it''s ______ big.', 'multiple_choice', '["a) only", "b) but", "c) also", "d) quite"]', 'd', 'A1', 20),
  (reading_skill_id, 'English is a lot _________ than French.', 'multiple_choice', '["a) easy", "b) easier", "c) more easy", "d) more easier"]', 'a', 'A1', 20),
  (reading_skill_id, '_________ long have you worked here?', 'multiple_choice', '["a) how", "b) what", "c) where", "d) why"]', 'a', 'A1', 20),
  (reading_skill_id, 'It costs $100! It''s _______ expensive!', 'multiple_choice', '["a) to", "b) lot", "c) much", "d) too"]', 'c', 'A1', 20);

  -- Q16-Q30 (A2 Level)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (reading_skill_id, 'He usually ________ at 7am.', 'multiple_choice', '["a) got up", "b) get up", "c) gets up", "d) don''t get up"]', 'c', 'A2', 20),
  (reading_skill_id, 'How _______ does this cost?', 'multiple_choice', '["a) many", "b) far", "c) long", "d) much"]', 'd', 'A2', 20),
  (reading_skill_id, 'Do your parents live here? -Yes, that''s ______ house over there.', 'multiple_choice', '["a) their", "b) there", "c) other", "d) our"]', 'a', 'A2', 20),
  (reading_skill_id, 'This lesson is too ________. Could you help me?', 'multiple_choice', '["a) easy", "b) tiring", "c) hard", "d) boring"]', 'c', 'A2', 20),
  (reading_skill_id, 'Yesterday, I _______ to the restaurant with my boyfriend.', 'multiple_choice', '["a) go", "b) to go", "c) went", "d) have gone"]', 'c', 'A2', 20),
  (reading_skill_id, 'Look at these mountains. What a lovely _______!', 'multiple_choice', '["a) landscape", "b) overview", "c) picture", "d) sight"]', 'a', 'A2', 20),
  (reading_skill_id, 'I didn''t sleep well last night. I''m very _________ today.', 'multiple_choice', '["a) well", "b) hectic", "c) tired", "d) happy"]', 'c', 'A2', 20),
  (reading_skill_id, '_________ you talk to him last week?', 'multiple_choice', '["a) do", "b) does", "c) did", "d) have"]', 'c', 'A2', 20),
  (reading_skill_id, 'It''s cold outside. You should ________ your coat?', 'multiple_choice', '["a) take in", "b) put off", "c) put on", "d) take off"]', 'c', 'A2', 20),
  (reading_skill_id, 'Hurry up! The appointment is ______ 10.', 'multiple_choice', '["a) to", "b) at", "c) from", "d) /"]', 'b', 'A2', 20),
  (reading_skill_id, 'I''m looking __________ the summer holidays.', 'multiple_choice', '["a) forward", "b) before", "c) for", "d) forward to"]', 'd', 'A2', 20),
  (reading_skill_id, 'This is the best tea I''ve ______ tasted.', 'multiple_choice', '["a) never", "b) ever", "c) already", "d) still"]', 'b', 'A2', 20),
  (reading_skill_id, 'He hasn''t played since he ______ the accident', 'multiple_choice', '["a) had", "b) has had", "c) has", "d) had had"]', 'a', 'A2', 20),
  (reading_skill_id, 'It''s all right, we _______ hurry. We have plenty of time.', 'multiple_choice', '["a) mustn''t", "b) shouldn''t", "c) can''t", "d) needn''t"]', 'd', 'A2', 20),
  (reading_skill_id, 'Our manager wants _______ to his office right now.', 'multiple_choice', '["a) that you come", "b) you come to", "c) you come", "d) you to come"]', 'd', 'A2', 20);

  -- Q31-Q45 (B1 Level)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (reading_skill_id, 'This table ___________ of wood.', 'multiple_choice', '["a) are making", "b) are made", "c) made", "d) is made"]', 'd', 'B1', 20),
  (reading_skill_id, 'It won''t work __________ you charge the battery.', 'multiple_choice', '["a) unless", "b) whereas", "c) because", "d) but"]', 'a', 'B1', 20),
  (reading_skill_id, 'He only has __________ friends.', 'multiple_choice', '["a) much", "b) quite", "c) such", "d) few"]', 'd', 'B1', 20),
  (reading_skill_id, 'The TV is too loud. Please, _____________.', 'multiple_choice', '["a) turn down", "b) turn it up", "c) turn it down", "d) turn down it"]', 'c', 'B1', 20),
  (reading_skill_id, 'I''m looking forward _____________ him.', 'multiple_choice', '["a) meet", "b) meeting", "c) to meet", "d) to meeting"]', 'd', 'B1', 20),
  (reading_skill_id, 'Yesterday, I was so upset that I __________ sleep…', 'multiple_choice', '["a) can", "b) can''t", "c) couldn''t", "d) could"]', 'c', 'B1', 20),
  (reading_skill_id, 'If I had known, I ___________ you!', 'multiple_choice', '["a) tell", "b) would tell", "c) would have told", "d) told"]', 'c', 'B1', 20),
  (reading_skill_id, 'You _____________ eat healthy if you don''t want to put on weight.', 'multiple_choice', '["a) have", "b) must to", "c) must", "d) might"]', 'c', 'B1', 20),
  (reading_skill_id, 'I ___________ him for ages!', 'multiple_choice', '["a) see", "b) saw", "c) didn''t see", "d) haven''t seen"]', 'd', 'B1', 20),
  (reading_skill_id, 'This man speaks a lot of ___________ languages : Chinese, Spanish, French, etc.', 'multiple_choice', '["a) abroad", "b) foreigner", "c) foreign", "d) stranger"]', 'c', 'B1', 20),
  (reading_skill_id, 'How _______________ is it from here? - Only 1 mile.', 'multiple_choice', '["a) long", "b) far", "c) much", "d) many"]', 'b', 'B1', 20),
  (reading_skill_id, 'I ________ drink beer than wine.', 'multiple_choice', '["a) would like more", "b) prefer", "c) like", "d) would rather"]', 'd', 'B1', 20),
  (reading_skill_id, 'You can stay ___________ you remain quiet.', 'multiple_choice', '["a) as long", "b) as long as", "c) as soon as", "d) as such"]', 'b', 'B1', 20),
  (reading_skill_id, 'they ____________ right now.', 'multiple_choice', '["a) are travelling", "b) travel", "c) have travelled", "d) travelled"]', 'a', 'B1', 20),
  (reading_skill_id, 'Listening to podcasts while driving allows me to ____________________', 'multiple_choice', '["a) kill two birds with one stone", "b) be a couch potato", "c) beat around the bush", "d) put all my eggs in the same basket"]', 'a', 'B1', 20);

  -- Q46-Q60 (B2 Level)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (reading_skill_id, 'I have been studying English _______ 5 years.', 'multiple_choice', '["a) for", "b) since", "c) within", "d) along"]', 'a', 'B2', 20),
  (reading_skill_id, 'My colleague has been on holiday for two weeks and now she needs to _______________', 'multiple_choice', '["a) catch in", "b) catch", "c) catch up", "d) catch for"]', 'c', 'B2', 20),
  (reading_skill_id, 'Stop ___________ that! It''s not true.', 'multiple_choice', '["a) to say", "b) to saying", "c) say", "d) saying"]', 'd', 'B2', 20),
  (reading_skill_id, 'If we hadn''t missed our flight __________ by the pool right now.', 'multiple_choice', '["a) we''d sit", "b) we''d have sat", "c) we''d been sitting", "d) we''d be sitting"]', 'd', 'B2', 20),
  (reading_skill_id, 'Take extreme care ____________ this bottle.', 'multiple_choice', '["a) to open", "b) when to open", "c) for opening", "d) when opening"]', 'd', 'B2', 20),
  (reading_skill_id, '______________ I known this was going to be so boring, I would never have come.', 'multiple_choice', '["a) should", "b) had", "c) would", "d) if"]', 'b', 'B2', 20),
  (reading_skill_id, 'Let''s call him. He ______________ for us.', 'multiple_choice', '["a) maybe is waiting", "b) might be waiting", "c) waits maybe", "d) can be waiting"]', 'b', 'B2', 20),
  (reading_skill_id, 'The penguin _____________ the only species able to survive in such conditions', 'multiple_choice', '["a) is thought to be", "b) in thinking to be", "c) is thinking to be", "d) is thought that is"]', 'a', 'B2', 20),
  (reading_skill_id, 'I don''t mind _______________ with you.', 'multiple_choice', '["a) to go", "b) to going", "c) going", "d) go"]', 'c', 'B2', 20),
  (reading_skill_id, 'Tomorrow, I ____________ to do any sport.', 'multiple_choice', '["a) can''t", "b) couldn''t", "c) won''t", "d) won''t be able"]', 'd', 'B2', 20),
  (reading_skill_id, 'I hate swimming. - _________________', 'multiple_choice', '["a) neither do I", "b) me too", "c) me as well", "d) same to me"]', 'a', 'B2', 20),
  (reading_skill_id, 'I _____________ to go skiing with my parents but now I go on my own.', 'multiple_choice', '["a) use", "b) used", "c) am used", "d) am using"]', 'b', 'B2', 20),
  (reading_skill_id, 'They''d learn the language quite quickly iF they lived in the country, _________________?', 'multiple_choice', '["a) would be", "b) would they", "c) wouldn''t they", "d) will they"]', 'c', 'B2', 20),
  (reading_skill_id, 'I''m so ____________. I don''t feel like doing anything today...', 'multiple_choice', '["a) ugly", "b) rewarding", "c) lazy", "d) noisy"]', 'c', 'B2', 20),
  (reading_skill_id, 'If I could I ___________ more often.', 'multiple_choice', '["a) train", "b) am training", "c) would train", "d) would have trained"]', 'c', 'B2', 20);

  -- Q61-Q90 (C1 Level)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (reading_skill_id, 'When I __________ rich, I''ll buy a new house by the beach.', 'multiple_choice', '["a) was", "b) will be", "c) am going to be", "d) am"]', 'd', 'C1', 20),
  (reading_skill_id, 'I am tempted, but I feel it may be inappropriate to ____________.', 'multiple_choice', '["a) do so", "b) to be doing so", "c) do such", "d) do this so"]', 'a', 'C1', 20),
  (reading_skill_id, 'Did you remember _______________ off the heat before we left?', 'multiple_choice', '["a) turn", "b) turning", "c) to turn", "d) turning it"]', 'c', 'C1', 20),
  (reading_skill_id, 'Have you found a job __________?', 'multiple_choice', '["a) soon", "b) still", "c) longer", "d) yet"]', 'd', 'C1', 20),
  (reading_skill_id, 'This is my ____________', 'multiple_choice', '["a) parent''s car", "b) parents'' car", "c) parents car", "d) car of parents"]', 'b', 'C1', 20),
  (reading_skill_id, 'She has two sisters but she doesn''t speak to _____________ of them.', 'multiple_choice', '["a) both", "b) either", "c) neither", "d) any"]', 'b', 'C1', 20),
  (reading_skill_id, 'The gas station is 10 miles __________...........', 'multiple_choice', '["a) far", "b) distance", "c) long", "d) away"]', 'd', 'C1', 20),
  (reading_skill_id, 'I''d like to _____________ for the job, do you have a form for me?', 'multiple_choice', '["a) postulate", "b) candidate", "c) apply", "d) write"]', 'c', 'C1', 20),
  (reading_skill_id, 'You''re so _____________ in that dress! Are you going out on a date?', 'multiple_choice', '["a) outstanding", "b) breathless", "c) stunning", "d) uncanny"]', 'c', 'C1', 20),
  (reading_skill_id, 'You shouldn''t believe what this guy says. He isn''t _____________ at all.', 'multiple_choice', '["a) trustworthy", "b) spooky", "c) available", "d) skillful"]', 'a', 'C1', 20),
  (reading_skill_id, 'I''m so busy right now... I''ll probably go on holiday _________________ .', 'multiple_choice', '["a) when it comes", "b) come rain or shine", "c) when pigs fly", "d) easy come easy go"]', 'c', 'C1', 20),
  (reading_skill_id, 'I have ______________.  I''m getting married!', 'multiple_choice', '["a) good news", "b) a good new", "c) a good news", "d) a good piece of news"]', 'd', 'C1', 20),
  (reading_skill_id, 'This girl is so funny. She _____________.', 'multiple_choice', '["a) cracks me up", "b) laughs", "c) smiles", "d) jokes"]', 'a', 'C1', 20),
  (reading_skill_id, 'I''m afraid we''ll have to _____________ our appointment. I won''t be available tomorrow as planned. What about Wednesday instead?', 'multiple_choice', '["a) postpone", "b) cancel", "c) pencil in", "d) update"]', 'a', 'C1', 20),
  (reading_skill_id, 'When I came home, my husband ________________.', 'multiple_choice', '["a) have already cooked", "b) had already cooked", "c) has already cooked", "d) cooked already"]', 'b', 'C1', 20),
  (reading_skill_id, 'He is ____________ travelling throughout Asia.', 'multiple_choice', '["a) actually", "b) effectively", "c) promptly", "d) currently"]', 'd', 'C1', 20),
  (reading_skill_id, 'It''s hard to study _________________ I want.', 'multiple_choice', '["a) as much", "b) as much than", "c) as much as", "d) as many as"]', 'c', 'C1', 20),
  (reading_skill_id, 'No way?! It''s already 8pm?! __________.', 'multiple_choice', '["a) time goes", "b) time flies", "c) time after time", "d) sometimes"]', 'b', 'C1', 20),
  (reading_skill_id, 'Mum, could you help me? No, I have other __________ to fry!', 'multiple_choice', '["a) cats", "b) fish", "c) dogs", "d) horses"]', 'b', 'C1', 20),
  (reading_skill_id, 'This book _________________ by a German writer.', 'multiple_choice', '["a) is write", "b) writing", "c) is writing", "d) was written"]', 'd', 'C1', 20),
  (reading_skill_id, 'I ___________________ as a teacher since 2015.', 'multiple_choice', '["a) has worked", "b) have been working", "c) work", "d) am working"]', 'b', 'C1', 20),
  (reading_skill_id, 'I was born on ________________ 1990.', 'multiple_choice', '["a) the first of December", "b) the one December", "c) the first December", "d) one of December"]', 'a', 'C1', 20),
  (reading_skill_id, 'I''m not sure yet... I __________ come to the party as well, I''ll let you know.', 'multiple_choice', '["a) can", "b) might", "c) will", "d) must"]', 'b', 'C1', 20),
  (reading_skill_id, '_____________ the bad weather there were a lot of runners participating in the competition.', 'multiple_choice', '["a) because of", "b) despite", "c) rather than", "d) unless"]', 'b', 'C1', 20),
  (reading_skill_id, '_________________ you give me a hand, please?', 'multiple_choice', '["a) could", "b) must", "c) will", "d) shall"]', 'a', 'C1', 20),
  (reading_skill_id, 'There is only ____________ coffee left.', 'multiple_choice', '["a) much", "b) many", "c) few", "d) little"]', 'd', 'C1', 20),
  (reading_skill_id, 'I think you''d better go ________ the hospital. You look dreadful!', 'multiple_choice', '["a) at", "b) from", "c) to", "d) /"]', 'c', 'C1', 20),
  (reading_skill_id, 'He''s a very ___________ boy. He speaks more than 5 languages!', 'multiple_choice', '["a) dummy", "b) clever", "c) shy", "d) understanding"]', 'b', 'C1', 20),
  (reading_skill_id, 'I __________ I could come but unfortunately I have a lot of homework…', 'multiple_choice', '["a) wish", "b) want", "c) would rather", "d) hope"]', 'a', 'C1', 20),
  (reading_skill_id, 'Practice makes perfect! Never stop learning, the more you learn the __________ you''ll become.', 'multiple_choice', '["a) best", "b) better", "c) good", "d) well"]', 'b', 'C1', 20);

  -- LISTENING QUESTIONS (With Audio Text)
  -- --------------------------------------------------------------------------------------
  
  -- PASSAGE 1: Sarah's Life (A1 Level - 5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text, time_limit_seconds) VALUES
  (listening_skill_id, 'Where does Sarah live?', 'multiple_choice', '["a) Paris", "b) London", "c) New York", "d) Berlin"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.', 30),
  (listening_skill_id, 'Where does she work?', 'multiple_choice', '["a) In a supermarket", "b) In an office", "c) In a small shop", "d) In a restaurant"]', 'c', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.', 30),
  (listening_skill_id, 'What time does she start work?', 'multiple_choice', '["a) 8 AM", "b) 9 AM", "c) 10 AM", "d) 11 AM"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.', 30),
  (listening_skill_id, 'What does she like?', 'multiple_choice', '["a) Dancing", "b) Music", "c) Cooking", "d) Reading"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.', 30),
  (listening_skill_id, 'What instrument does she play?', 'multiple_choice', '["a) Piano", "b) Guitar", "c) Drums", "d) Violin"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.', 30);

  -- PASSAGE 2: Tom's Commute (A2 Level - 5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text, time_limit_seconds) VALUES
  (listening_skill_id, 'What day is it today?', 'multiple_choice', '["a) Monday", "b) Tuesday", "c) Friday", "d) Wednesday"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.', 30),
  (listening_skill_id, 'Why is Tom taking the train?', 'multiple_choice', '["a) He doesn''t like driving", "b) His car is at the garage", "c) The train is faster", "d) He likes trains"]', 'b', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.', 30),
  (listening_skill_id, 'How is the train?', 'multiple_choice', '["a) Fast and empty", "b) Slow and crowded", "c) Clean and expensive", "d) Comfortable and quiet"]', 'b', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.', 30),
  (listening_skill_id, 'What time does he usually arrive?', 'multiple_choice', '["a) 8:30", "b) 9:00", "c) 7:45", "d) 8:00"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.', 30),
  (listening_skill_id, 'Will he be late today?', 'multiple_choice', '["a) Yes", "b) No", "c) Maybe", "d) Unknown"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.', 30);

  -- PASSAGE 3: Mountain Hiking (B1 Level - 6 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text, time_limit_seconds) VALUES
  (listening_skill_id, 'What activity did they do?', 'multiple_choice', '["a) Camping", "b) Hiking", "c) Swimming", "d) Cycling"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30),
  (listening_skill_id, 'What was the weather like at first?', 'multiple_choice', '["a) Rainy", "b) Sunny", "c) Windy", "d) Cloudy"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30),
  (listening_skill_id, 'What happened suddenly?', 'multiple_choice', '["a) They got lost", "b) It started raining", "c) They met other people", "d) They saw an animal"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30),
  (listening_skill_id, 'Where did they wait?', 'multiple_choice', '["a) In a car", "b) Under a tree", "c) At home", "d) In a shelter"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30),
  (listening_skill_id, 'Did they reach the top?', 'multiple_choice', '["a) Yes", "b) No", "c) Maybe", "d) Unknown"]', 'a', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30),
  (listening_skill_id, 'How long did they wait under the tree?', 'multiple_choice', '["a) 30 minutes", "b) One hour", "c) Two hours", "d) 15 minutes"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.', 30);

  -- PASSAGE 4: Remote Work Conference (B2 Level - 5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text, time_limit_seconds) VALUES
  (listening_skill_id, 'What was the main topic of the conference?', 'multiple_choice', '["a) Team-building", "b) Remote work and productivity", "c) Office design", "d) Marketing strategies"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.', 30),
  (listening_skill_id, 'What problem do some employees face when working from home?', 'multiple_choice', '["a) Too many meetings", "b) Isolation", "c) Long commutes", "d) Slow internet"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.', 30),
  (listening_skill_id, 'What solution did the speaker suggest?', 'multiple_choice', '["a) Full remote", "b) Returning to office", "c) Hybrid models", "d) Flexible hours"]', 'c', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.', 30),
  (listening_skill_id, 'Who works more efficiently from home?', 'multiple_choice', '["a) Everyone", "b) Some employees", "c) No one", "d) Only managers"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.', 30),
  (listening_skill_id, 'The tone of the speaker was mainly…', 'multiple_choice', '["a) Critical", "b) Balanced", "c) Negative", "d) Humorous"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.', 30);

  -- PASSAGE 5: Sustainable Consumption (C1 Level - 5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text, time_limit_seconds) VALUES
  (listening_skill_id, 'What trend is mentioned?', 'multiple_choice', '["a) Cheaper products", "b) Sustainable product consumption", "c) Luxury product demand", "d) Online shopping"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.', 30),
  (listening_skill_id, 'What is driving this trend?', 'multiple_choice', '["a) Marketing", "b) Environmental awareness and regulations", "c) Price reductions", "d) Social media"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.', 30),
  (listening_skill_id, 'What happens to companies that don''t adapt?', 'multiple_choice', '["a) They grow faster", "b) They lose market share", "c) Nothing changes", "d) They get fined"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.', 30),
  (listening_skill_id, 'What benefit is mentioned for companies adopting sustainability?', 'multiple_choice', '["a) Better supply chains", "b) Stronger brand loyalty", "c) Lower production costs", "d) Higher employee retention"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.', 30),
  (listening_skill_id, 'How would you describe the tone of the passage?', 'multiple_choice', '["a) Persuasive and analytical", "b) Informal", "c) Emotional", "d) Humorous"]', 'a', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.', 30);


  -- SPEAKING QUESTIONS (Listen & Repeat / Listen & Answer)
  -- --------------------------------------------------------------------------------------
  
  -- Part 1: Listen & Repeat (5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_url, audio_text) VALUES
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'C1', NULL, 'In today''s highly competitive global economy, companies must continuously adapt their strategies to remain innovative, efficient, and sustainable over time.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'C1', NULL, 'Effective leadership requires strong communication skills, strategic thinking, and the ability to guide teams through complex and rapidly changing environments.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'The integration of digital technologies has significantly transformed how organizations operate, collaborate, and deliver value to their customers.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'Continuous professional development is essential for individuals who want to remain relevant and competitive in an evolving global job market.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'Many organizations are investing in artificial intelligence to improve decision-making processes, optimize operations, and enhance overall productivity.');

  -- Part 2: Listen & Answer (5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_url, audio_text) VALUES
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'How has technology changed the way professionals communicate and collaborate in modern organizations?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'Why is adaptability considered an essential skill for success in today''s professional environment?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'C1', NULL, 'What qualities do you believe are most important for effective leadership in a global company?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'How can organizations improve employee productivity while maintaining a healthy work-life balance?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'C1', NULL, 'What role does innovation play in ensuring the long-term success of a business?');


  -- WRITING QUESTIONS (5 tasks)
  -- --------------------------------------------------------------------------------------
  
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, time_limit_seconds) VALUES
  (writing_skill_id, 'Discuss the importance of adaptability and continuous learning in achieving long-term professional success. (80-120 words)', 'essay', NULL, NULL, 'B2', 600),
  (writing_skill_id, 'Explain how digital technology has transformed workplace communication and project management in modern organizations. (80-120 words)', 'essay', NULL, NULL, 'B2', 600),
  (writing_skill_id, 'Analyze the role of leadership in fostering innovation and motivating teams within global companies. (80-120 words)', 'essay', NULL, NULL, 'C1', 600),
  (writing_skill_id, 'Describe strategies companies can implement to improve employee productivity while maintaining a healthy work-life balance. (80-120 words)', 'essay', NULL, NULL, 'B2', 600),
  (writing_skill_id, 'Explain how artificial intelligence can enhance decision-making, operational efficiency, and competitiveness in businesses. (80-120 words)', 'essay', NULL, NULL, 'C1', 600);

END $$;

-- 7. VERIFICATION
-- ========================================================================================
SELECT skills.name, COUNT(*) as question_count 
FROM questions 
JOIN skills ON questions.skill_id = skills.id 
GROUP BY skills.name;
