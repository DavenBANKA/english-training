import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import CommentCaMarche from './pages/CommentCaMarche'
import Temoignages from './pages/Temoignages'
import Financements from './pages/Financements'
import FAQ from './pages/FAQ'
import Entreprises from './pages/Entreprises'
import Equipe from './pages/Equipe'
import Manifeste from './pages/Manifeste'
import Entreprise from './pages/Entreprise'
import ApprendreAnglais from './pages/ApprendreAnglais'
import Formations from './pages/Formations'
import Cours from './pages/Cours'
import Test from './pages/Test'
import TestReading from './pages/TestReading'
import TestListening from './pages/TestListening'
import TestSpeaking from './pages/TestSpeaking'
import TestWriting from './pages/TestWriting'
import TestResults from './pages/TestResults'
import TestTransition from './pages/TestTransition'
import Certificate from './pages/Certificate'
import Certifications from './pages/Certifications'
import Blog from './pages/Blog'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'
import CGV from './pages/CGV'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
          <Route path="/temoignages" element={<Temoignages />} />
          <Route path="/financements" element={<Financements />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/manifeste" element={<Manifeste />} />
          <Route path="/entreprise" element={<Entreprise />} />
          <Route path="/apprendre-anglais" element={<ApprendreAnglais />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test/reading" element={<TestReading />} />
          <Route path="/test/listening" element={<TestListening />} />
          <Route path="/test/speaking" element={<TestSpeaking />} />
          <Route path="/test/writing" element={<TestWriting />} />
          <Route path="/test/results" element={<TestResults />} />
          <Route path="/test/certificate" element={<Certificate />} />
          <Route path="/test/transition" element={<TestTransition />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgv" element={<CGV />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
