import { supabase } from '../config/supabase.js';

/**
 * Service pour calculer les scores et niveaux CECRL
 */
class ScoringService {
  /**
   * Mapping score -> niveau CECRL
   */
  cefrMapping = {
    A1: { min: 0, max: 30 },
    A2: { min: 31, max: 45 },
    B1: { min: 46, max: 60 },
    B2: { min: 61, max: 75 },
    C1: { min: 76, max: 90 },
    C2: { min: 91, max: 100 }
  };

  /**
   * Convertit un score en niveau CECRL
   * @param {number} score - Score sur 100
   * @returns {string} Niveau CECRL (A1-C2)
   */
  scoreToCEFR(score) {
    for (const [level, range] of Object.entries(this.cefrMapping)) {
      if (score >= range.min && score <= range.max) {
        return level;
      }
    }
    return 'A1';
  }

  /**
   * Calcule le score pour Reading/Listening (QCM)
   * @param {Array} answers - Réponses de l'utilisateur
   * @param {Array} questions - Questions avec réponses correctes
   * @returns {Object} Score et détails
   */
  calculateMCQScore(answers, questions) {
    let correct = 0;
    const total = questions.length;
    const details = [];

    answers.forEach((answer, index) => {
      const question = questions[index];
      const isCorrect = answer === question.correct_answer;
      
      if (isCorrect) correct++;

      details.push({
        question_id: question.id,
        user_answer: answer,
        correct_answer: question.correct_answer,
        is_correct: isCorrect
      });
    });

    const score = Math.round((correct / total) * 100);
    const cefrLevel = this.scoreToCEFR(score);

    return {
      correct,
      total,
      score,
      cefr_level: cefrLevel,
      details
    };
  }

  /**
   * Calcule le résultat global d'un test complet
   * @param {string} userId - ID de l'utilisateur
   * @param {string} testId - ID du test
   * @returns {Promise<Object>} Résultat global avec scores par skill
   */
  async calculateOverallResult(userId, testId) {
    try {
      // Récupérer tous les scores par skill
      const { data: answers, error } = await supabase
        .from('user_answers')
        .select(`
          *,
          questions (
            skill_id,
            skills (name)
          )
        `)
        .eq('user_id', userId)
        .eq('test_id', testId);

      if (error) throw error;

      // Grouper par skill
      const skillScores = {};
      const skills = ['reading', 'listening', 'speaking', 'writing'];

      for (const skill of skills) {
        const skillAnswers = answers.filter(
          a => a.questions.skills.name.toLowerCase() === skill
        );

        if (skillAnswers.length > 0) {
          const avgScore = skillAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / skillAnswers.length;
          skillScores[skill] = {
            score: Math.round(avgScore),
            cefr_level: this.scoreToCEFR(avgScore)
          };
        }
      }

      // Score global (moyenne des 4 skills)
      const scores = Object.values(skillScores).map(s => s.score);
      const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const overallCEFR = this.scoreToCEFR(overallScore);

      // Sauvegarder le résultat
      const { data: result, error: resultError } = await supabase
        .from('results')
        .insert({
          user_id: userId,
          test_id: testId,
          reading_score: skillScores.reading?.score || 0,
          listening_score: skillScores.listening?.score || 0,
          speaking_score: skillScores.speaking?.score || 0,
          writing_score: skillScores.writing?.score || 0,
          overall_score: overallScore,
          cefr_level: overallCEFR,
          skill_scores: skillScores
        })
        .select()
        .single();

      if (resultError) throw resultError;

      return {
        success: true,
        data: {
          result_id: result.id,
          overall_score: overallScore,
          cefr_level: overallCEFR,
          skill_scores: skillScores,
          completed_at: result.created_at
        }
      };
    } catch (error) {
      console.error('Erreur calcul résultat:', error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des résultats d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des résultats
   */
  async getUserResults(userId) {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur récupération résultats:', error);
      throw error;
    }
  }
}

export default new ScoringService();
