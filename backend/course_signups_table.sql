-- Script SQL pour créer la table d'inscription aux cours
   
CREATE TABLE IF NOT EXISTS course_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser le tri par date de création
CREATE INDEX IF NOT EXISTS idx_course_signups_created_at ON course_signups(created_at);

-- Optionnel : Activer la sécurité au niveau des lignes (RLS) mais on ne met pas de politiques restrictives
-- car cela sera utilisé par Supabase Admin (service_role) qui bypass automatiquement le RLS.
ALTER TABLE course_signups ENABLE ROW LEVEL SECURITY;
