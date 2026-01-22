import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Gestionnaire de rotation des clés API Gemini
 * Bascule automatiquement vers la clé suivante en cas d'erreur de quota
 */
class GeminiAPIManager {
  constructor() {
    // Récupérer toutes les clés API depuis .env
    const apiKeysString = process.env.GEMINI_API_KEYS;
    
    if (!apiKeysString) {
      throw new Error('Missing GEMINI_API_KEYS environment variable');
    }

    // Parser les clés (séparées par des virgules)
    this.apiKeys = apiKeysString.split(',').map(key => key.trim()).filter(key => key);
    
    if (this.apiKeys.length === 0) {
      throw new Error('No valid Gemini API keys found');
    }

    this.currentKeyIndex = 0;
    this.failedKeys = new Set();
    
    console.log(`✅ ${this.apiKeys.length} clés Gemini API chargées`);
  }

  /**
   * Obtient la clé API courante
   */
  getCurrentKey() {
    return this.apiKeys[this.currentKeyIndex];
  }

  /**
   * Passe à la clé suivante
   */
  rotateKey() {
    const previousIndex = this.currentKeyIndex;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    
    console.log(`🔄 Rotation de clé API: ${previousIndex} → ${this.currentKeyIndex}`);
    
    // Si on a fait un tour complet, réinitialiser les clés échouées
    if (this.currentKeyIndex === 0) {
      console.log('♻️  Réinitialisation des clés échouées');
      this.failedKeys.clear();
    }
    
    return this.getCurrentKey();
  }

  /**
   * Marque une clé comme échouée
   */
  markKeyAsFailed(keyIndex) {
    this.failedKeys.add(keyIndex);
    console.log(`❌ Clé ${keyIndex} marquée comme échouée`);
  }

  /**
   * Obtient un modèle Gemini avec la clé courante
   */
  getModel() {
    const apiKey = this.getCurrentKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    return genAI.getGenerativeModel({
      model: 'gemini-flash-lite-latest',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });
  }

  /**
   * Génère du contenu avec rotation automatique en cas d'erreur
   */
  async generateContentWithRotation(prompt, maxRetries = null) {
    const retries = maxRetries || this.apiKeys.length;
    let lastError = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const model = this.getModel();
        const result = await model.generateContent(prompt);
        
        // Succès - réinitialiser le compteur d'échecs pour cette clé
        this.failedKeys.delete(this.currentKeyIndex);
        
        return result;
      } catch (error) {
        lastError = error;
        const errorMessage = error.message || '';
        
        // Vérifier si c'est une erreur de quota
        if (errorMessage.includes('quota') || 
            errorMessage.includes('RESOURCE_EXHAUSTED') ||
            errorMessage.includes('429')) {
          
          console.warn(`⚠️  Quota atteint pour la clé ${this.currentKeyIndex}`);
          this.markKeyAsFailed(this.currentKeyIndex);
          
          // Rotation vers la clé suivante
          this.rotateKey();
          
          // Attendre un peu avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          continue;
        }
        
        // Si ce n'est pas une erreur de quota, propager l'erreur
        throw error;
      }
    }

    // Si toutes les tentatives ont échoué
    throw new Error(`Toutes les clés API Gemini ont échoué. Dernière erreur: ${lastError?.message}`);
  }

  /**
   * Obtient les statistiques des clés
   */
  getStats() {
    return {
      totalKeys: this.apiKeys.length,
      currentKeyIndex: this.currentKeyIndex,
      failedKeys: Array.from(this.failedKeys),
      availableKeys: this.apiKeys.length - this.failedKeys.size
    };
  }
}

// Instance singleton
export const geminiManager = new GeminiAPIManager();

// Export pour compatibilité
export const geminiModel = geminiManager.getModel();

export default geminiManager;
