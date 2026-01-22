-- Script pour corriger toutes les politiques RLS
-- Exécuter dans SQL Editor de Supabase

-- ============================================
-- SUPPRIMER LES ANCIENNES POLITIQUES
-- ============================================

DROP POLICY IF EXISTS user_answers_policy ON user_answers;
DROP POLICY IF EXISTS speaking_policy ON speaking_submissions;
DROP POLICY IF EXISTS writing_policy ON writing_submissions;
DROP POLICY IF EXISTS results_policy ON results;

-- ============================================
-- CRÉER LES NOUVELLES POLITIQUES (PERMISSIVES)
-- ============================================

-- Policy pour user_answers (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY user_answers_select_policy ON user_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_answers_insert_policy ON user_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_answers_update_policy ON user_answers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY user_answers_delete_policy ON user_answers
  FOR DELETE USING (auth.uid() = user_id);

-- Policy pour speaking_submissions (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY speaking_select_policy ON speaking_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY speaking_insert_policy ON speaking_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY speaking_update_policy ON speaking_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY speaking_delete_policy ON speaking_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Policy pour writing_submissions (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY writing_select_policy ON writing_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY writing_insert_policy ON writing_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY writing_update_policy ON writing_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY writing_delete_policy ON writing_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Policy pour results (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY results_select_policy ON results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY results_insert_policy ON results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY results_update_policy ON results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY results_delete_policy ON results
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Afficher toutes les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('user_answers', 'speaking_submissions', 'writing_submissions', 'results')
ORDER BY tablename, policyname;
