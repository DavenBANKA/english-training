import scoringService from '../services/scoring.service.js';

/**
 * Contrôleur pour les résultats
 */
class ResultsController {
  /**
   * Récupérer les résultats de l'utilisateur connecté
   * GET /api/results/me
   */
  async getMyResults(req, res, next) {
    try {
      const userId = req.user.id;
      const results = await scoringService.getUserResults(userId);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calculer le résultat global d'un test
   * POST /api/results/calculate
   */
  async calculateResult(req, res, next) {
    try {
      const { test_id } = req.body;
      const userId = req.user.id;

      if (!test_id) {
        return res.status(400).json({
          success: false,
          error: 'test_id requis'
        });
      }

      const result = await scoringService.calculateOverallResult(userId, test_id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ResultsController();
