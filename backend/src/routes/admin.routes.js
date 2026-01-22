import express from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import geminiService from '../services/gemini.service.js';

const router = express.Router();

/**
 * Route admin pour voir les statistiques des clés API Gemini
 * GET /api/admin/gemini-stats
 */
router.get('/gemini-stats', authenticate, requireAdmin, (req, res) => {
  try {
    const stats = geminiService.getAPIStats();
    
    res.json({
      success: true,
      data: {
        ...stats,
        message: `${stats.availableKeys}/${stats.totalKeys} clés disponibles`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
