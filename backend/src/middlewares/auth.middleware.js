import { supabase } from '../config/supabase.js';

/**
 * Middleware d'authentification JWT via Supabase
 * Vérifie le token Bearer et attache l'utilisateur à req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token manquant ou invalide'
      });
    }

    const token = authHeader.substring(7);

    // Vérification du token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Erreur authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification'
    });
  }
};

/**
 * Middleware pour vérifier le rôle admin
 */
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    // Vérifier le rôle dans les métadonnées utilisateur ou l'email spécifique
    const adminEmails = ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'];
    const isAdmin = req.user.user_metadata?.role === 'admin' ||
      req.user.app_metadata?.role === 'admin' ||
      adminEmails.includes(req.user.email);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Accès réservé aux administrateurs'
      });
    }

    next();
  } catch (error) {
    console.error('Erreur vérification admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};
