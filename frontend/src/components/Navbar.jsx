import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleMouseEnter = (menu) => {
    if (window.innerWidth >= 1024) {
      setActiveDropdown(menu)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setActiveDropdown(null)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto'
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
    document.body.style.overflow = 'auto'
  }

  const toggleMobileDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      navigate('/')
      closeMobileMenu()
    }
  }

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            <img src="/logo.jpeg" alt="Logo" className="logo-img" />
            <span className="logo-text">Conseilux Language Academy</span>
          </Link>

          {/* Hamburger Button */}
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className="navbar-menu desktop-menu">
            <li><Link to="/">Accueil</Link></li>

            <li
              className="dropdown"
              onMouseEnter={() => handleMouseEnter('ressources')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="dropdown-trigger">Ressources</span>
              {activeDropdown === 'ressources' && (
                <div className="dropdown-menu">
                  <Link to="/comment-ca-marche">Comment ça marche</Link>
                  <Link to="/temoignages">Témoignages</Link>
                  <Link to="/financements">Financements</Link>
                  <Link to="/faq">Questions fréquentes</Link>
                </div>
              )}
            </li>

            <li
              className="dropdown"
              onMouseEnter={() => handleMouseEnter('apropos')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="dropdown-trigger">À propos</span>
              {activeDropdown === 'apropos' && (
                <div className="dropdown-menu">
                  <Link to="/entreprises">Pour les entreprises</Link>
                  <Link to="/equipe">L'équipe</Link>
                  <Link to="/manifeste">Le manifeste</Link>
                  <Link to="/entreprise">L'entreprise</Link>
                </div>
              )}
            </li>

            <li
              className="dropdown"
              onMouseEnter={() => handleMouseEnter('plus')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="dropdown-trigger">Plus</span>
              {activeDropdown === 'plus' && (
                <div className="dropdown-menu">
                  <Link to="/apprendre-anglais">Apprendre l'anglais</Link>
                  <Link to="/formations">Formations en anglais</Link>
                  <Link to="/cours">Cours d'anglais</Link>
                  <Link to="/test">Test d'anglais</Link>
                  <Link to="/certifications">Certifications anglais</Link>
                  <Link to="/blog">Blog</Link>
                </div>
              )}
            </li>

            {(() => {
              const userEmail = (user?.email || user?.user?.email || user?.user_metadata?.email)?.toLowerCase().trim();
              const isAdmin = userEmail && ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'].includes(userEmail);
              return isAdmin && (
                <li><Link to="/admin" className="admin-link">Page Admin</Link></li>
              );
            })()}
          </ul>

          <div className="navbar-actions">
            {isAuthenticated ? (
              <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
            ) : (
              <>
                <Link to="/login" className="btn-login">Connexion</Link>
                <Link to="/register" className="btn-signup">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
            <img src="/logo.jpeg" alt="Logo" />
            <span>Conseilux Language Academy</span>
          </Link>
          <button className="close-menu-btn" onClick={closeMobileMenu} aria-label="Fermer le menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <ul className="mobile-menu-list">
          <li><Link to="/" onClick={closeMobileMenu}>Accueil</Link></li>
          {(() => {
            const userEmail = (user?.email || user?.user?.email || user?.user_metadata?.email)?.toLowerCase().trim();
            const isAdmin = userEmail && ['contact@conseiluxtraining.com', 'lionesspretty7@gmail.com'].includes(userEmail);
            return isAdmin && (
              <li><Link to="/admin" onClick={closeMobileMenu} className="mobile-admin-link">Page Admin</Link></li>
            );
          })()}

          <li className={`mobile-dropdown ${activeDropdown === 'ressources' ? 'active' : ''}`}>
            <button onClick={() => toggleMobileDropdown('ressources')}>
              Ressources
              <span className="arrow">▼</span>
            </button>
            {activeDropdown === 'ressources' && (
              <ul className="mobile-submenu">
                <li><Link to="/comment-ca-marche" onClick={closeMobileMenu}>Comment ça marche</Link></li>
                <li><Link to="/temoignages" onClick={closeMobileMenu}>Témoignages</Link></li>
                <li><Link to="/financements" onClick={closeMobileMenu}>Financements</Link></li>
                <li><Link to="/faq" onClick={closeMobileMenu}>Questions fréquentes</Link></li>
              </ul>
            )}
          </li>

          <li className={`mobile-dropdown ${activeDropdown === 'apropos' ? 'active' : ''}`}>
            <button onClick={() => toggleMobileDropdown('apropos')}>
              À propos
              <span className="arrow">▼</span>
            </button>
            {activeDropdown === 'apropos' && (
              <ul className="mobile-submenu">
                <li><Link to="/entreprises" onClick={closeMobileMenu}>Pour les entreprises</Link></li>
                <li><Link to="/equipe" onClick={closeMobileMenu}>L'équipe</Link></li>
                <li><Link to="/manifeste" onClick={closeMobileMenu}>Le manifeste</Link></li>
                <li><Link to="/entreprise" onClick={closeMobileMenu}>L'entreprise</Link></li>
              </ul>
            )}
          </li>

          <li className={`mobile-dropdown ${activeDropdown === 'plus' ? 'active' : ''}`}>
            <button onClick={() => toggleMobileDropdown('plus')}>
              Plus
              <span className="arrow">▼</span>
            </button>
            {activeDropdown === 'plus' && (
              <ul className="mobile-submenu">
                <li><Link to="/apprendre-anglais" onClick={closeMobileMenu}>Apprendre l'anglais</Link></li>
                <li><Link to="/formations" onClick={closeMobileMenu}>Formations en anglais</Link></li>
                <li><Link to="/cours" onClick={closeMobileMenu}>Cours d'anglais</Link></li>
                <li><Link to="/test" onClick={closeMobileMenu}>Test d'anglais</Link></li>
                <li><Link to="/certifications" onClick={closeMobileMenu}>Certifications anglais</Link></li>
                <li><Link to="/blog" onClick={closeMobileMenu}>Blog</Link></li>
              </ul>
            )}
          </li>
        </ul>

        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={closeMobileMenu}>Connexion</Link>
              <Link to="/register" className="btn-signup" onClick={closeMobileMenu}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
