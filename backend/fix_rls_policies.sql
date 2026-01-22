-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS user_answers_policy ON user_answers;
DROP POLICY IF EXISTS speaking_policy ON speaking_submissions;
DROP POLICY IF EXISTS writing_policy ON writing_submissions;
DROP POLICY IF EXISTS results_policy ON results;
DROP POLICY IF EXISTS test_sessions_policy ON test_sessions;

-- Créer des politiques plus permissives pour permettre l'insertion via le backend
-- Les utilisateurs peuvent voir et modifier leurs propres données
CREATE POLICY user_answers_select_policy ON user_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_answers_insert_policy ON user_answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY user_answers_update_policy ON user_answers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_answers_delete_policy ON user_answers
  FOR DELETE USING (auth.uid() = user_id);

-- Speaking submissions
CREATE POLICY speaking_select_policy ON speaking_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY speaking_insert_policy ON speaking_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY speaking_update_policy ON speaking_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY speaking_delete_policy ON speaking_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Writing submissions
CREATE POLICY writing_select_policy ON writing_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY writing_insert_policy ON writing_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY writing_update_policy ON writing_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY writing_delete_policy ON writing_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Results
CREATE POLICY results_select_policy ON results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY results_insert_policy ON results
  FOR INSERT WITH CHECK (true);

CREATE POLICY results_update_policy ON results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY results_delete_policy ON results
  FOR DELETE USING (auth.uid() = user_id);

-- Test sessions
CREATE POLICY test_sessions_select_policy ON test_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY test_sessions_insert_policy ON test_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY test_sessions_update_policy ON test_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY test_sessions_delete_policy ON test_sessions
  FOR DELETE USING (auth.uid() = user_id);
