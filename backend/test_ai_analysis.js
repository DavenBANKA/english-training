/**
 * Script de test pour vérifier l'analyse IA
 * Usage: node test_ai_analysis.js
 */

import { supabase } from './src/config/supabase.js';
import geminiService from './src/services/gemini.service.js';

console.log('🧪 Test de l\'analyse IA\n');

// Test 1: Vérifier RLS
async function testRLS() {
  console.log('1️⃣ Vérification RLS...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('speaking_submissions', 'writing_submissions', 'results')
      `
    });
    
    if (error) {
      console.log('⚠️  Impossible de vérifier RLS automatiquement');
      console.log('   Vérifiez manuellement dans Supabase SQL Editor:');
      console.log('   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = \'public\';');
    } else {
      console.log('✅ RLS vérifié:', data);
    }
  } catch (err) {
    console.log('⚠️  Vérifiez manuellement le RLS dans Supabase');
  }
  
  console.log('');
}

// Test 2: Vérifier Gemini API
async function testGemini() {
  console.log('2️⃣ Test Gemini API...');
  
  try {
    const testText = "Hello, how are you today?";
    const prompt = "What is the weather like?";
    
    const result = await geminiService.analyzeWriting(testText, prompt);
    
    console.log('✅ Gemini fonctionne!');
    console.log('   Score global:', result.overall_score);
    console.log('   Niveau CEFR:', result.cefr_level);
  } catch (err) {
    console.log('❌ Erreur Gemini:', err.message);
    console.log('   Vérifiez vos clés API dans .env');
  }
  
  console.log('');
}

// Test 3: Vérifier les tables
async function testTables() {
  console.log('3️⃣ Vérification des tables...');
  
  const tables = ['speaking_submissions', 'writing_submissions', 'results', 'questions'];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
      } else {
        console.log(`✅ Table ${table}: ${count} lignes`);
      }
    } catch (err) {
      console.log(`❌ Table ${table}: ${err.message}`);
    }
  }
  
  console.log('');
}

// Test 4: Test insertion Speaking
async function testSpeakingInsert() {
  console.log('4️⃣ Test insertion Speaking...');
  
  try {
    // Récupérer un utilisateur de test
    const { data: users } = await supabase.auth.admin.listUsers();
    
    if (!users || users.users.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé. Créez un compte d\'abord.');
      return;
    }
    
    const testUser = users.users[0];
    
    // Récupérer une question speaking
    const { data: questions } = await supabase
      .from('questions')
      .select('id')
      .eq('skill_id', (await supabase.from('skills').select('id').eq('name', 'speaking').single()).data.id)
      .limit(1);
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  Aucune question speaking trouvée');
      return;
    }
    
    // Tenter une insertion
    const { data, error } = await supabase
      .from('speaking_submissions')
      .insert({
        user_id: testUser.id,
        question_id: questions[0].id,
        transcript: 'Test transcript',
        fluency_score: 75,
        grammar_score: 80,
        vocabulary_score: 70,
        pronunciation_score: 85,
        overall_score: 77,
        cefr_level: 'B2',
        feedback: 'Test feedback'
      })
      .select();
    
    if (error) {
      console.log('❌ Erreur insertion:', error.message);
      console.log('   👉 Exécutez disable_rls_dev.sql dans Supabase!');
    } else {
      console.log('✅ Insertion réussie!');
      
      // Nettoyer
      await supabase
        .from('speaking_submissions')
        .delete()
        .eq('id', data[0].id);
    }
  } catch (err) {
    console.log('❌ Erreur:', err.message);
  }
  
  console.log('');
}

// Test 5: Test insertion Writing
async function testWritingInsert() {
  console.log('5️⃣ Test insertion Writing...');
  
  try {
    // Récupérer un utilisateur de test
    const { data: users } = await supabase.auth.admin.listUsers();
    
    if (!users || users.users.length === 0) {
      console.log('⚠️  Aucun utilisateur trouvé');
      return;
    }
    
    const testUser = users.users[0];
    
    // Récupérer une question writing
    const { data: questions } = await supabase
      .from('questions')
      .select('id')
      .eq('skill_id', (await supabase.from('skills').select('id').eq('name', 'writing').single()).data.id)
      .limit(1);
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  Aucune question writing trouvée');
      return;
    }
    
    // Tenter une insertion
    const { data, error } = await supabase
      .from('writing_submissions')
      .insert({
        user_id: testUser.id,
        question_id: questions[0].id,
        original_text: 'Test text',
        coherence_score: 75,
        grammar_score: 80,
        vocabulary_score: 70,
        task_achievement_score: 85,
        overall_score: 77,
        cefr_level: 'B2',
        feedback: 'Test feedback'
      })
      .select();
    
    if (error) {
      console.log('❌ Erreur insertion:', error.message);
      console.log('   👉 Exécutez disable_rls_dev.sql dans Supabase!');
    } else {
      console.log('✅ Insertion réussie!');
      
      // Nettoyer
      await supabase
        .from('writing_submissions')
        .delete()
        .eq('id', data[0].id);
    }
  } catch (err) {
    console.log('❌ Erreur:', err.message);
  }
  
  console.log('');
}

// Exécuter tous les tests
async function runTests() {
  await testRLS();
  await testTables();
  await testGemini();
  await testSpeakingInsert();
  await testWritingInsert();
  
  console.log('✅ Tests terminés!\n');
  console.log('📋 Résumé:');
  console.log('   - Si RLS est activé (rowsecurity = true), exécutez disable_rls_dev.sql');
  console.log('   - Si Gemini échoue, vérifiez vos clés API dans .env');
  console.log('   - Si les insertions échouent, désactivez RLS');
  console.log('\n📖 Voir ENABLE_AI_ANALYSIS.md pour plus de détails');
}

runTests().catch(console.error);
