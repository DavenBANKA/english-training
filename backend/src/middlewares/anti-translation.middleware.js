/**
 * Middleware pour empêcher la traduction automatique
 * Ajoute des headers HTTP spécifiques
 */
export const preventTranslation = (req, res, next) => {
  // Indiquer que le contenu est en anglais
  res.setHeader('Content-Language', 'en');
  
  // Indiquer que le contenu ne doit pas être traduit
  res.setHeader('X-Translated', 'false');
  
  // Header pour Google Translate
  res.setHeader('X-Google-Translate', 'notranslate');
  
  next();
};

/**
 * Middleware pour ajouter des instructions anti-traduction dans les réponses JSON
 */
export const addTranslationWarning = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Ajouter un avertissement dans toutes les réponses contenant des questions
    if (data.data && (data.data.question || data.data.questions)) {
      data.translation_warning = {
        message: 'Do not translate this content. Automatic translation will invalidate your test results.',
        attributes: 'Add translate="no" and class="notranslate" to HTML elements'
      };
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};
