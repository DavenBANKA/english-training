import { supabase } from '../config/supabase.js';

/**
 * Contrôleur pour les questions
 */
class QuestionController {
  /**
   * Récupérer les questions par skill
   */
  async getQuestions(req, res, next) {
    try {
      const { skill, level, limit = 20 } = req.query;

      if (!skill) {
        return res.status(400).json({
          success: false,
          error: 'Le paramètre skill est requis'
        });
      }

      // D'abord, récupérer le skill_id
      const { data: skillData, error: skillError } = await supabase
        .from('skills')
        .select('id')
        .eq('name', skill)
        .single();

      if (skillError || !skillData) {
        return res.status(404).json({
          success: false,
          error: `Skill '${skill}' non trouvé`
        });
      }

      // Ensuite, récupérer les questions pour ce skill
      let query = supabase
        .from('questions')
        .select('*')
        .eq('skill_id', skillData.id)
        .limit(parseInt(limit));

      if (level) {
        query = query.eq('difficulty_level', level);
      }

      const { data, error } = await query;

      if (error) throw error;

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer une question spécifique
   */
  async getQuestionById(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          skills (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Créer une nouvelle question (admin)
   */
  async createQuestion(req, res, next) {
    try {
      const {
        skill_id,
        question_text,
        question_type,
        options,
        correct_answer,
        difficulty_level,
        audio_url
      } = req.body;

      const { data, error } = await supabase
        .from('questions')
        .insert({
          skill_id,
          question_text,
          question_type,
          options,
          correct_answer,
          difficulty_level,
          audio_url
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data: data
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new QuestionController();
