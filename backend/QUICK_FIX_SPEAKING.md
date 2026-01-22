# Quick Fix - Speaking Test

## What Was Done

✅ **Backend Fixed**: Question controller now correctly filters speaking questions
✅ **Backend Restarted**: Server running on port 3000
✅ **Frontend Ready**: Speaking page already configured to use `audio_text`
✅ **SQL Script Created**: `update_speaking_questions.sql` ready to execute

## What You Need to Do NOW

### Execute this SQL in Supabase (2 minutes):

1. Open Supabase → SQL Editor
2. Copy and paste this entire script:

```sql
-- Add audio_text column if not exists
ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_text TEXT;

-- Delete old speaking questions
DELETE FROM questions WHERE skill_id = (SELECT id FROM skills WHERE name = 'speaking');

-- Insert new speaking questions
DO $$
DECLARE
  speaking_skill_id UUID;
BEGIN
  SELECT id INTO speaking_skill_id FROM skills WHERE name = 'speaking';

  -- Part 1: Repeat (5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_url, audio_text) VALUES
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'C1', NULL, 'In today''s highly competitive global economy, companies must continuously adapt their strategies to remain innovative, efficient, and sustainable over time.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'C1', NULL, 'Effective leadership requires strong communication skills, strategic thinking, and the ability to guide teams through complex and rapidly changing environments.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'The integration of digital technologies has significantly transformed how organizations operate, collaborate, and deliver value to their customers.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'Continuous professional development is essential for individuals who want to remain relevant and competitive in an evolving global job market.'),
  (speaking_skill_id, 'Répétez la phrase que vous venez d''entendre', 'repeat', NULL, NULL, 'B2', NULL, 'Many organizations are investing in artificial intelligence to improve decision-making processes, optimize operations, and enhance overall productivity.');

  -- Part 2: Answer (5 questions)
  INSERT INTO questions (skill_id, question_text, question_type, options, correct_answer, difficulty_level, audio_url, audio_text) VALUES
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'How has technology changed the way professionals communicate and collaborate in modern organizations?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'Why is adaptability considered an essential skill for success in today''s professional environment?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'C1', NULL, 'What qualities do you believe are most important for effective leadership in a global company?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'B2', NULL, 'How can organizations improve employee productivity while maintaining a healthy work-life balance?'),
  (speaking_skill_id, 'Répondez à la question que vous venez d''entendre', 'answer', NULL, NULL, 'C1', NULL, 'What role does innovation play in ensuring the long-term success of a business?');

END $$;

-- Verify
SELECT COUNT(*) as total_speaking_questions FROM questions WHERE skill_id = (SELECT id FROM skills WHERE name = 'speaking');
```

3. Click "Run"
4. You should see: `total_speaking_questions: 10`

## Test It

1. Go to your app: http://localhost:5173
2. Login
3. Start test → Complete Reading → Complete Listening
4. On Speaking page, you should now see:
   - 10 speaking questions (not listening!)
   - Audio button with `audio.jpg` image
   - Text-to-speech reads the question/phrase
   - Can listen 2 times max
   - Record your voice response

## Done! 🎉

The Speaking test should now work correctly with proper speaking questions.
