import React, { useState } from 'react'
import './FAQSection.css'

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Quel est le meilleur test de niveau d'anglais ?",
      answer: "Notre test English Training est aligné sur les référentiels CECRL (A1 à C2) et offre une évaluation complète de vos 4 compétences : Listening, Reading, Writing et Speaking. Il est rapide (10-15 minutes) et utilise l'IA pour analyser vos réponses écrites et orales."
    },
    {
      question: "Le test de niveau d'anglais English Training est-il gratuit ?",
      answer: "Le test nécessite une inscription gratuite pour sauvegarder vos résultats et générer votre certificat personnalisé. Une fois inscrit, vous pouvez passer le test complet et accéder à votre certificat détaillé avec vos scores par compétence."
    },
    {
      question: "Combien de temps dure le test ?",
      answer: "Le test dure environ 90 minutes. Il évalue en profondeur vos 4 compétences (Listening, Reading, Writing, Speaking) et vous fournit immédiatement votre niveau CECRL estimé de A1 à C2."
    },
    {
      question: "Est-ce un test officiel ?",
      answer: "Notre test est un outil d'évaluation aligné sur les standards CECRL (Cadre Européen Commun de Référence pour les Langues). Il vous permet de connaître votre niveau actuel et de vous orienter vers des formations certifiantes comme le TOEIC, TOEFL ou Cambridge si nécessaire."
    },
    {
      question: "Que faire après le test ?",
      answer: "Après le test, vous recevrez instantanément votre niveau CECRL (A1 à C2), un certificat détaillé avec vos scores par compétence (Listening, Reading, Writing, Speaking), et des recommandations personnalisées pour améliorer votre anglais, incluant des suggestions de formations CPF adaptées à votre niveau."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-content">
          <div className="faq-header">
            <h2 className="faq-title">Vous souhaitez<br />en savoir plus ?</h2>
            <p className="faq-subtitle">
              Voici nos réponses aux questions les plus fréquentes
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
