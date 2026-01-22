-- Script d'insertion des questions SPEAKING et WRITING
-- Exécuter APRÈS seed_listening.sql

DO $$
DECLARE
  speaking_skill_id UUID;
  writing_skill_id UUID;
BEGIN
  SELECT id INTO speaking_skill_id FROM skills WHERE name = 'speaking';
  SELECT id INTO writing_skill_id FROM skills WHERE name = 'writing';

  -- ============================================
  -- SPEAKING QUESTIONS (10 questions)
  -- ============================================
  
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

  -- ============================================
  -- WRITING QUESTIONS (5 tasks)
  -- ============================================
  
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level) VALUES
  (writing_skill_id, 'Discuss the importance of adaptability and continuous learning in achieving long-term professional success. (80-120 words)', 'essay', NULL, NULL, 'B2'),
  (writing_skill_id, 'Explain how digital technology has transformed workplace communication and project management in modern organizations. (80-120 words)', 'essay', NULL, NULL, 'B2'),
  (writing_skill_id, 'Analyze the role of leadership in fostering innovation and motivating teams within global companies. (80-120 words)', 'essay', NULL, NULL, 'C1'),
  (writing_skill_id, 'Describe strategies companies can implement to improve employee productivity while maintaining a healthy work-life balance. (80-120 words)', 'essay', NULL, NULL, 'B2'),
  (writing_skill_id, 'Explain how artificial intelligence can enhance decision-making, operational efficiency, and competitiveness in businesses. (80-120 words)', 'essay', NULL, NULL, 'C1');

END $$;
