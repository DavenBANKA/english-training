import React, { useState } from 'react'
import './CourseSignupSection.css'

function CourseSignupSection() {
  const [showPopup, setShowPopup] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Créer le contenu de l'email
      const emailBody = `
Nouvelle inscription aux cours d'anglais

Prénom: ${formData.firstName}
Nom: ${formData.lastName}
Email: ${formData.email}
Pays: ${formData.country}

Date: ${new Date().toLocaleString('fr-FR')}
      `.trim()

      // Ouvrir le client email avec mailto
      const mailtoLink = `mailto:contact@conseiluxtraining.com?subject=${encodeURIComponent('Nouvelle inscription aux cours d\'anglais')}&body=${encodeURIComponent(emailBody)}`
      window.open(mailtoLink, '_blank')

      // Afficher le message de succès
      setSubmitStatus('success')
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          country: ''
        })
        setShowPopup(false)
        setSubmitStatus(null)
      }, 2000)

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="course-signup-section">
        <div className="course-signup-container">
          <div className="course-signup-card">
            <h3 className="course-signup-title">
              Intéressé par nos cours d'anglais ?
            </h3>
            <p className="course-signup-description">
              Inscrivez-vous pour recevoir plus d'informations sur nos formations personnalisées
            </p>
            <button 
              className="course-signup-btn"
              onClick={() => setShowPopup(true)}
            >
              S'inscrire aux cours
            </button>
          </div>
        </div>
      </section>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="popup-close"
              onClick={() => setShowPopup(false)}
              aria-label="Fermer"
            >
              ×
            </button>

            <h2 className="popup-title">Inscription aux cours d'anglais</h2>
            <p className="popup-subtitle">
              Remplissez ce formulaire et nous vous contacterons rapidement
            </p>

            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre prénom"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="votre.email@exemple.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Pays *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  placeholder="Votre pays"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="submit-message success">
                  ✓ Votre demande a été envoyée avec succès !
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="submit-message error">
                  ✗ Une erreur est survenue. Veuillez réessayer.
                </div>
              )}

              <button 
                type="submit" 
                className="popup-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CourseSignupSection
