-- Script simplifié pour ajouter les politiques manquantes
-- Exécuter dans SQL Editor de Supabase

-- ============================================
-- SPEAKING SUBMISSIONS
-- ============================================

DROP POLICY IF EXISTS speaking_select_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_insert_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_update_policy ON speaking_submissions;
DROP POLICY IF EXISTS speaking_delete_policy ON speaking_submissions;

CREATE POLICY speaking_select_policy ON speaking_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY speaking_insert_policy ON speaking_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY speaking_update_policy ON speaking_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY speaking_delete_policy ON speaking_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- WRITING SUBMISSIONS
-- ============================================

DROP POLICY IF EXISTS writing_select_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_insert_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_update_policy ON writing_submissions;
DROP POLICY IF EXISTS writing_delete_policy ON writing_submissions;

CREATE POLICY writing_select_policy ON writing_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY writing_insert_policy ON writing_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY writing_update_policy ON writing_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY writing_delete_policy ON writing_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RESULTS
-- ============================================

DROP POLICY IF EXISTS results_select_policy ON results;
DROP POLICY IF EXISTS results_insert_policy ON results;
DROP POLICY IF EXISTS results_update_policy ON results;
DROP POLICY IF EXISTS results_delete_policy ON results;

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

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('speaking_submissions', 'writing_submissions', 'results')
ORDER BY tablename, policyname;
