import React, { lazy, Suspense } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import './Home.css'

// Lazy load des sections non critiques
const LevelsSection = lazy(() => import('../components/LevelsSection'))
const HowItWorksSection = lazy(() => import('../components/HowItWorksSection'))
const ForWhoSection = lazy(() => import('../components/ForWhoSection'))
const WhyTestSection = lazy(() => import('../components/WhyTestSection'))
const FAQSection = lazy(() => import('../components/FAQSection'))
const Footer = lazy(() => import('../components/Footer'))

function Home() {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <Suspense fallback={<div className="section-loading"></div>}>
        <LevelsSection />
        <HowItWorksSection />
        <ForWhoSection />
        <WhyTestSection />
        <FAQSection />
        <Footer />
      </Suspense>
    </div>
  )
}

export default Home
