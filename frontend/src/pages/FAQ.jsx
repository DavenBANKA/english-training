import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FAQSection from '../components/FAQSection'
import './PageStyles.css'

function FAQ() {
  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Questions fréquentes</h1>
          <p className="page-subtitle">
            Trouvez les réponses à toutes vos questions sur notre test d'anglais
          </p>
        </div>
      </section>

      <FAQSection />

      <Footer />
    </div>
  )
}

export default FAQ
