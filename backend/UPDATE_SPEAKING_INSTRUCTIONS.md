# Instructions pour mettre à jour les questions Speaking

## Étapes à suivre dans Supabase

### 1. Vérifier que la colonne audio_text existe
Si ce n'est pas déjà fait, aller dans **SQL Editor** et exécuter:

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_text TEXT;
```

### 2. Supprimer les anciennes questions speaking et insérer les nouvelles
Copier et exécuter dans **SQL Editor**:

```sql
-- Supprimer les anciennes questions speaking
DELETE FROM questions WHERE skill_id = (SELECT id FROM skills WHERE name = 'speaking');

-- Réinsérer les questions avec audio_text
DO $
DECLARE
  speaking_skill_id UUID;
BEGIN
  SELECT id INTO speaking_skill_id FROM skills WHERE name = 'speaking';

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

END $;
```

## Structure des questions Speaking

Chaque question a:
- Un `audio_text` qui contient la phrase à répéter OU la question à répondre
- Un `question_text` qui affiche l'instruction ("Répétez la phrase..." ou "Répondez à la question...")
- Un `question_type` qui est soit 'repeat' soit 'answer'

## Fonctionnement dans le test

1. L'utilisateur clique sur "Écouter l'audio"
2. L'audio est lu (synthèse vocale du navigateur) - 2 écoutes maximum
3. L'utilisateur enregistre sa réponse vocale
4. Passage à la question suivante

## Vérification

Après l'exécution, vérifier dans **Table Editor** > **questions**:
- Les questions speaking ont toutes un `audio_text` rempli
- Le `question_text` contient l'instruction (pas le texte à lire)
- Le `question_type` est 'repeat' ou 'answer'
