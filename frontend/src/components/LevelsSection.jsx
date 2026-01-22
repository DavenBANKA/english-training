import React from 'react'
import './LevelsSection.css'

function LevelsSection() {
  return (
    <section className="levels-section">
      <div className="levels-container">
        <h2 className="levels-title">
          Vous souhaitez connaître votre niveau d'anglais selon l'échelle CECRL (Cadre Européen Commun de Référence pour les Langues) ? Notre test de positionnement vous permet <strong>d'estimer gratuitement votre niveau</strong> — de <strong>A1 (débutant)</strong> à <strong>C2 (maîtrise)</strong> — en moins de 30 minutes.
        </h2>

        <h3 className="ideal-title">Idéal pour :</h3>

        <div className="levels-cards">
          <div className="level-card">
            <div className="card-content">
              <p>
                Suivre une <strong>formation en anglais</strong> éligible au CPF
              </p>
            </div>
          </div>

          <div className="level-card">
            <div className="card-content">
              <p>
                Préparer un <strong>examen ou une certification</strong> (TOEIC, TOEFL, Linguaskill, Cambridge...)
              </p>
            </div>
          </div>

          <div className="level-card">
            <div className="card-content">
              <p>
                Se situer avant un <strong>séjour à l'étranger, des études</strong>, ou une <strong>reconversion professionnelle</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LevelsSection
