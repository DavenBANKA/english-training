import { supabase } from '../config/supabase.js';
import scoringService from '../services/scoring.service.js';

/**
 * Contrôleur pour les réponses (Reading/Listening)
 */
class AnswersController {
  /**
   * Soumettre des réponses (QCM)
   * POST /api/answers/submit
   */
  async submit(req, res, next) {
    try {
      const { test_id, answers, response_time, timed_out } = req.body;
      const userId = req.user.id;

      if (!test_id || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: 'test_id et answers (array) requis'
        });
      }

      // Vérifier si le test existe, sinon le créer
      let { data: existingTest } = await supabase
        .from('tests')
        .select('id')
        .eq('id', test_id)
        .single();

      if (!existingTest) {
        // Créer le test s'il n'existe pas
        const { data: newTest, error: testError } = await supabase
          .from('tests')
          .insert({
            id: test_id,
            name: 'Test EFSET',
            description: 'Test complet d\'anglais',
            duration_minutes: 50
          })
          .select()
          .single();

        if (testError) throw testError;
      }

      // Récupérer les questions avec réponses correctes
      const questionIds = answers.map(a => a.question_id);
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('id', questionIds);

      if (questionsError) throw questionsError;

      // Calculer le score
      const userAnswers = answers.map(a => a.answer);
      const scoring = scoringService.calculateMCQScore(userAnswers, questions);

      // Sauvegarder les réponses avec le temps de réponse
      const answersToInsert = scoring.details.map((detail, index) => ({
        user_id: userId,
        test_id,
        question_id: detail.question_id,
        user_answer: detail.user_answer,
        is_correct: detail.is_correct,
        score: detail.is_correct ? 100 : 0,
        response_time: answers[index].response_time || response_time || 0,
        timed_out: answers[index].timed_out || timed_out || false
      }));

      const { error: insertError } = await supabase
        .from('user_answers')
        .insert(answersToInsert);

      if (insertError) throw insertError;

      res.json({
        success: true,
        data: {
          score: scoring.score,
          cefr_level: scoring.cefr_level,
          correct: scoring.correct,
          total: scoring.total,
          details: scoring.details,
          timed_out_count: answersToInsert.filter(a => a.timed_out).length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AnswersController();
