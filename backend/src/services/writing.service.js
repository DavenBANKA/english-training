import { supabase } from '../config/supabase.js';
import geminiService from './gemini.service.js';

/**
 * Service pour gérer les soumissions Writing
 */
class WritingService {
  /**
   * Analyse une rédaction
   * @param {string} userId - ID de l'utilisateur
   * @param {string} questionId - ID de la question
   * @param {string} text - Texte écrit par l'utilisateur
   * @returns {Promise<Object>} Résultat de l'analyse
   */
  async analyzeResponse(userId, questionId, text) {
    try {
      // Validation de base (relaxée pour développement)
      if (!text || text.trim().length < 10) {
        throw new Error('Le texte doit contenir au moins 10 caractères');
      }

      // Récupérer la question/prompt
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .select('question_text')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      // Analyser avec Gemini
      const analysis = await geminiService.analyzeWriting(
        text,
        question.question_text
      );

      // Sauvegarder la soumission
      const { data: submission, error: submissionError } = await supabase
        .from('writing_submissions')
        .insert({
          user_id: userId,
          question_id: questionId,
          original_text: text,
          corrected_text: analysis.corrected_text,
          errors: analysis.errors,
          coherence_score: analysis.coherence_score,
          grammar_score: analysis.grammar_score,
          vocabulary_score: analysis.vocabulary_score,
          task_achievement_score: analysis.task_achievement_score,
          overall_score: analysis.overall_score,
          cefr_level: analysis.cefr_level,
          feedback: analysis.feedback,
          strengths: analysis.strengths,
          improvements: analysis.improvements
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      return {
        success: true,
        data: {
          submission_id: submission.id,
          ...analysis
        }
      };
    } catch (error) {
      console.error('Erreur analyse writing:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des soumissions d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des soumissions
   */
  async getUserSubmissions(userId) {
    try {
      const { data, error } = await supabase
        .from('writing_submissions')
        .select(`
          *,
          questions (
            question_text,
            skill_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur récupération soumissions:', error);
      throw error;
    }
  }
}

export default new WritingService();
