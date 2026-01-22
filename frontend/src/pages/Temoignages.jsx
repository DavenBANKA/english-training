import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Temoignages() {
  const testimonials = [
    {
      name: "Marie D.",
      level: "B2 → C1",
      text: "Grâce à ce test, j'ai pu identifier mes lacunes et suivre une formation adaptée. En 6 mois, je suis passée de B2 à C1 !"
    },
    {
      name: "Thomas L.",
      level: "A2 → B1",
      text: "Le test est rapide et précis. Les recommandations m'ont aidé à choisir la bonne formation CPF pour progresser."
    },
    {
      name: "Sophie M.",
      level: "B1 → B2",
      text: "Excellent outil pour s'autoévaluer avant de postuler à l'étranger. Les résultats sont fiables et détaillés."
    }
  ]

  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Témoignages</h1>
          <p className="page-subtitle">
            Découvrez les retours d'expérience de nos utilisateurs
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="step-card" style={{marginBottom: '30px'}}>
              <h3>{testimonial.name} - {testimonial.level}</h3>
              <p>{testimonial.text}</p>
            </div>
          ))}

          <div className="cta-section-page">
            <h2>À votre tour de progresser !</h2>
            <button className="btn-cta">Commencer le test</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Temoignages
