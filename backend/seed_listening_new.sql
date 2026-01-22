-- Script d'insertion des questions LISTENING avec audio_text
-- Ce script ajoute automatiquement la colonne audio_text si elle n'existe pas

-- Ajouter la colonne audio_text si elle n'existe pas
ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_text TEXT;

DO $$
DECLARE
  listening_skill_id UUID;
BEGIN
  SELECT id INTO listening_skill_id FROM skills WHERE name = 'listening';

  -- Supprimer les anciennes questions listening si elles existent
  DELETE FROM questions WHERE skill_id = listening_skill_id;

  -- ============================================
  -- PASSAGE 1: Sarah's Life (A1 Level - 5 questions)
  -- ============================================
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text) VALUES
  (listening_skill_id, 'Where does Sarah live?', 'multiple_choice', '["a) Paris", "b) London", "c) New York", "d) Berlin"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.'),
  (listening_skill_id, 'Where does she work?', 'multiple_choice', '["a) In a supermarket", "b) In an office", "c) In a small shop", "d) In a restaurant"]', 'c', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.'),
  (listening_skill_id, 'What time does she start work?', 'multiple_choice', '["a) 8 AM", "b) 9 AM", "c) 10 AM", "d) 11 AM"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.'),
  (listening_skill_id, 'What does she like?', 'multiple_choice', '["a) Dancing", "b) Music", "c) Cooking", "d) Reading"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.'),
  (listening_skill_id, 'What instrument does she play?', 'multiple_choice', '["a) Piano", "b) Guitar", "c) Drums", "d) Violin"]', 'b', 'A1', 'Hello, my name is Sarah. I live in London. I work in a small shop. I start work at 9 AM every day. I really like music and I play the guitar in my free time.');

  -- ============================================
  -- PASSAGE 2: Tom's Commute (A2 Level - 5 questions)
  -- ============================================
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text) VALUES
  (listening_skill_id, 'What day is it today?', 'multiple_choice', '["a) Monday", "b) Tuesday", "c) Friday", "d) Wednesday"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.'),
  (listening_skill_id, 'Why is Tom taking the train?', 'multiple_choice', '["a) He doesn''t like driving", "b) His car is at the garage", "c) The train is faster", "d) He likes trains"]', 'b', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.'),
  (listening_skill_id, 'How is the train?', 'multiple_choice', '["a) Fast and empty", "b) Slow and crowded", "c) Clean and expensive", "d) Comfortable and quiet"]', 'b', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.'),
  (listening_skill_id, 'What time does he usually arrive?', 'multiple_choice', '["a) 8:30", "b) 9:00", "c) 7:45", "d) 8:00"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.'),
  (listening_skill_id, 'Will he be late today?', 'multiple_choice', '["a) Yes", "b) No", "c) Maybe", "d) Unknown"]', 'a', 'A2', 'Today is Monday and I am taking the train to work because my car is at the garage. The train is slow and crowded. I usually arrive at 8:30 but today I will be late.');

  -- ============================================
  -- PASSAGE 3: Mountain Hiking (B1 Level - 6 questions)
  -- ============================================
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text) VALUES
  (listening_skill_id, 'What activity did they do?', 'multiple_choice', '["a) Camping", "b) Hiking", "c) Swimming", "d) Cycling"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.'),
  (listening_skill_id, 'What was the weather like at first?', 'multiple_choice', '["a) Rainy", "b) Sunny", "c) Windy", "d) Cloudy"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.'),
  (listening_skill_id, 'What happened suddenly?', 'multiple_choice', '["a) They got lost", "b) It started raining", "c) They met other people", "d) They saw an animal"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.'),
  (listening_skill_id, 'Where did they wait?', 'multiple_choice', '["a) In a car", "b) Under a tree", "c) At home", "d) In a shelter"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.'),
  (listening_skill_id, 'Did they reach the top?', 'multiple_choice', '["a) Yes", "b) No", "c) Maybe", "d) Unknown"]', 'a', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.'),
  (listening_skill_id, 'How long did they wait under the tree?', 'multiple_choice', '["a) 30 minutes", "b) One hour", "c) Two hours", "d) 15 minutes"]', 'b', 'B1', 'Last weekend we went hiking in the mountains. The weather was sunny at first, but suddenly it started raining heavily. We waited under a tree for about one hour until the rain stopped. Despite the rain, we managed to reach the top and the view was amazing.');

  -- ============================================
  -- PASSAGE 4: Remote Work Conference (B2 Level - 5 questions)
  -- ============================================
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text) VALUES
  (listening_skill_id, 'What was the main topic of the conference?', 'multiple_choice', '["a) Team-building", "b) Remote work and productivity", "c) Office design", "d) Marketing strategies"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.'),
  (listening_skill_id, 'What problem do some employees face when working from home?', 'multiple_choice', '["a) Too many meetings", "b) Isolation", "c) Long commutes", "d) Slow internet"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.'),
  (listening_skill_id, 'What solution did the speaker suggest?', 'multiple_choice', '["a) Full remote", "b) Returning to office", "c) Hybrid models", "d) Flexible hours"]', 'c', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.'),
  (listening_skill_id, 'Who works more efficiently from home?', 'multiple_choice', '["a) Everyone", "b) Some employees", "c) No one", "d) Only managers"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.'),
  (listening_skill_id, 'The tone of the speaker was mainly…', 'multiple_choice', '["a) Critical", "b) Balanced", "c) Negative", "d) Humorous"]', 'b', 'B2', 'At yesterday''s conference, we discussed remote work and productivity. While some employees feel isolated when working from home, others work more efficiently. The speaker suggested that hybrid models, combining office and remote work, might be the best solution. The tone of the presentation was balanced, acknowledging both advantages and challenges.');

  -- ============================================
  -- PASSAGE 5: Sustainable Consumption (C1 Level - 5 questions)
  -- ============================================
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_text) VALUES
  (listening_skill_id, 'What trend is mentioned?', 'multiple_choice', '["a) Cheaper products", "b) Sustainable product consumption", "c) Luxury product demand", "d) Online shopping"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.'),
  (listening_skill_id, 'What is driving this trend?', 'multiple_choice', '["a) Marketing", "b) Environmental awareness and regulations", "c) Price reductions", "d) Social media"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.'),
  (listening_skill_id, 'What happens to companies that don''t adapt?', 'multiple_choice', '["a) They grow faster", "b) They lose market share", "c) Nothing changes", "d) They get fined"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.'),
  (listening_skill_id, 'What benefit is mentioned for companies adopting sustainability?', 'multiple_choice', '["a) Better supply chains", "b) Stronger brand loyalty", "c) Lower production costs", "d) Higher employee retention"]', 'b', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.'),
  (listening_skill_id, 'How would you describe the tone of the passage?', 'multiple_choice', '["a) Persuasive and analytical", "b) Informal", "c) Emotional", "d) Humorous"]', 'a', 'C1', 'Recent market research indicates a significant trend towards sustainable product consumption. This shift is being driven primarily by increased environmental awareness among consumers and stricter government regulations. Companies that fail to adapt are losing market share, while those embracing sustainability are building stronger brand loyalty. The tone of this analysis is persuasive and analytical.');

END $$;
