import { supabase } from '../config/supabase.js';

/**
 * Contrôleur pour gérer le flux du test
 */
class TestController {
  /**
   * Démarrer un nouveau test
   * POST /api/test/start
   */
  async startTest(req, res, next) {
    try {
      const userId = req.user.id;

      // Créer un nouveau test
      const { data: test, error } = await supabase
        .from('tests')
        .insert({
          name: 'TESTNIV - English Assessment',
          description: 'Test complet des 4 compétences linguistiques',
          duration_minutes: 120
        })
        .select()
        .single();

      if (error) throw error;

      // Créer une session de test pour l'utilisateur
      const { data: session, error: sessionError } = await supabase
        .from('test_sessions')
        .insert({
          user_id: userId,
          test_id: test.id,
          current_skill: 'reading',
          current_question_index: 0,
          status: 'in_progress',
          skill_started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      res.json({
        success: true,
        data: {
          test_id: test.id,
          session_id: session.id,
          message: 'Test démarré. Commencez par la section Reading.'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer la question suivante
   * GET /api/test/next-question/:sessionId
   */
  async getNextQuestion(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      // Récupérer la session
      const { data: session, error: sessionError } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) throw sessionError;

      if (session.status === 'completed') {
        return res.json({
          success: true,
          data: {
            completed: true,
            message: 'Test terminé'
          }
        });
      }

      // Récupérer les questions pour le skill actuel
      const { data: skillData } = await supabase
        .from('skills')
        .select('id')
        .eq('name', session.current_skill)
        .single();

      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('skill_id', skillData.id)
        .order('created_at');

      if (questionsError) throw questionsError;

      // Vérifier si on a terminé ce skill
      if (session.current_question_index >= questions.length) {
        // Passer au skill suivant
        const skillOrder = ['reading', 'listening', 'speaking', 'writing'];
        const currentIndex = skillOrder.indexOf(session.current_skill);
        
        if (currentIndex < skillOrder.length - 1) {
          const nextSkill = skillOrder[currentIndex + 1];
          
          // Mettre à jour la session avec le nouveau skill et réinitialiser le timer
          await supabase
            .from('test_sessions')
            .update({
              current_skill: nextSkill,
              current_question_index: 0,
              skill_started_at: new Date().toISOString()
            })
            .eq('id', sessionId);

          return res.json({
            success: true,
            data: {
              skill_completed: true,
              next_skill: nextSkill,
              message: `Section ${session.current_skill} terminée. Passez à ${nextSkill}.`
            }
          });
        } else {
          // Test terminé
          await supabase
            .from('test_sessions')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', sessionId);

          return res.json({
            success: true,
            data: {
              completed: true,
              message: 'Test terminé ! Calcul des résultats...'
            }
          });
        }
      }

      // Calculer le temps restant pour le skill (Speaking uniquement)
      let skillTimeRemaining = null;
      if (session.current_skill === 'speaking' && session.skill_started_at) {
        const skillTimeLimit = 600; // 10 minutes = 600 secondes
        const elapsed = Math.floor((Date.now() - new Date(session.skill_started_at).getTime()) / 1000);
        skillTimeRemaining = Math.max(0, skillTimeLimit - elapsed);
      }

      // Retourner la question actuelle
      const currentQuestion = questions[session.current_question_index];

      res.json({
        success: true,
        data: {
          question: {
            id: currentQuestion.id,
            question_text: currentQuestion.question_text,
            question_type: currentQuestion.question_type,
            options: currentQuestion.options,
            audio_url: currentQuestion.audio_url,
            difficulty_level: currentQuestion.difficulty_level,
            time_limit_seconds: currentQuestion.time_limit_seconds
          },
          progress: {
            skill: session.current_skill,
            current: session.current_question_index + 1,
            total: questions.length
          },
          timer: {
            // Timer par question (Reading, Listening, Writing)
            question_timer: currentQuestion.time_limit_seconds ? {
              enabled: true,
              seconds: currentQuestion.time_limit_seconds,
              message: `Vous avez ${currentQuestion.time_limit_seconds} secondes pour répondre`
            } : null,
            // Timer global pour le skill (Speaking uniquement)
            skill_timer: session.current_skill === 'speaking' ? {
              enabled: true,
              seconds: skillTimeRemaining,
              total_seconds: 600,
              message: `Temps restant pour toute la section Speaking: ${Math.floor(skillTimeRemaining / 60)}:${(skillTimeRemaining % 60).toString().padStart(2, '0')}`
            } : null
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Passer à la question suivante (après soumission)
   * POST /api/test/next/:sessionId
   */
  async moveToNext(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      // Incrémenter l'index de la question
      const { data, error } = await supabase
        .from('test_sessions')
        .update({
          current_question_index: supabase.raw('current_question_index + 1')
        })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: {
          message: 'Passé à la question suivante',
          current_index: data.current_question_index
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Passer une question (skip) - Nécessite confirmation
   * POST /api/test/skip/:sessionId
   */
  async skipQuestion(req, res, next) {
    try {
      const { sessionId } = req.params;
      const { confirmed } = req.body;
      const userId = req.user.id;

      // Vérifier la confirmation
      if (!confirmed) {
        return res.status(400).json({
          success: false,
          error: 'Confirmation requise',
          message: 'Êtes-vous sûr de vouloir passer cette question ? Vous ne pourrez pas y revenir.',
          requires_confirmation: true
        });
      }

      // Récupérer la session
      const { data: session, error: sessionError } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessionError) throw sessionError;

      // Récupérer la question actuelle
      const { data: skillData } = await supabase
        .from('skills')
        .select('id')
        .eq('name', session.current_skill)
        .single();

      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('skill_id', skillData.id)
        .order('created_at');

      const currentQuestion = questions[session.current_question_index];

      // Enregistrer la question comme "skipped"
      await supabase
        .from('user_answers')
        .insert({
          user_id: userId,
          test_id: session.test_id,
          question_id: currentQuestion.id,
          user_answer: null,
          is_correct: false,
          score: 0,
          skipped: true,
          response_time: 0
        });

      // Passer à la question suivante
      const { data, error } = await supabase
        .from('test_sessions')
        .update({
          current_question_index: supabase.raw('current_question_index + 1')
        })
        .eq('id', sessionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: {
          message: 'Question passée',
          current_index: data.current_question_index,
          skipped: true
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir le statut de la session
   * GET /api/test/status/:sessionId
   */
  async getStatus(req, res, next) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const { data: session, error } = await supabase
        .from('test_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestController();
