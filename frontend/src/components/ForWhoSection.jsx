import React from 'react'
import './ForWhoSection.css'

function ForWhoSection() {
  return (
    <section className="for-who-section">
      <div className="for-who-container">
        <div className="for-who-content">
          <div className="image-column">
            <div className="image-wrapper-who">
              <img src="/qui.jpg" alt="Pour qui" className="who-image" />
            </div>
          </div>

          <div className="text-column">
            <h2 className="for-who-title">Pour qui ?</h2>
            
            <p className="for-who-intro">
              Ce test d'adresse à toute personne souhaitant connaître son niveau d'anglais :
            </p>

            <ul className="for-who-list">
              <li>Étudiants en préparation de TOEIC, IELTS, Cambridge, etc.</li>
              <li>Salariés et professionnels visant une <strong>formation CPF</strong></li>
              <li>Futurs expatriés ou candidats à une université étrangère</li>
              <li>Curieux qui veulent s'autoévaluer avant de se (re)lancer</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForWhoSection
