import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Blog() {
  const articles = [
    {
      title: "10 astuces pour améliorer votre anglais rapidement",
      excerpt: "Découvrez nos conseils pratiques pour progresser efficacement en anglais au quotidien.",
      date: "15 janvier 2026"
    },
    {
      title: "Comment choisir la bonne certification d'anglais ?",
      excerpt: "TOEIC, TOEFL, Cambridge... Guide complet pour faire le bon choix selon vos objectifs.",
      date: "10 janvier 2026"
    },
    {
      title: "Les erreurs courantes des francophones en anglais",
      excerpt: "Identifiez et corrigez les fautes les plus fréquentes pour améliorer votre anglais.",
      date: "5 janvier 2026"
    }
  ]

  return (
    <div className="page">
      <Navbar />
      
      <section className="page-hero">
        <div className="page-hero-content">
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">
            Conseils, astuces et actualités pour apprendre l'anglais
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="content-container">
          <div className="content-section">
            <h2>Derniers articles</h2>
          </div>

          {articles.map((article, index) => (
            <div key={index} className="step-card" style={{marginBottom: '30px'}}>
              <p style={{fontSize: '14px', color: '#718096', marginBottom: '10px'}}>{article.date}</p>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button className="btn-cta" style={{marginTop: '15px', padding: '12px 30px', fontSize: '16px'}}>
                Lire l'article
              </button>
            </div>
          ))}

          <div className="cta-section-page">
            <h2>Commencez votre apprentissage</h2>
            <button className="btn-cta">Passer le test gratuit</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Blog
