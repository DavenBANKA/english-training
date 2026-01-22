import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import html2canvas from 'html2canvas';
import './Certificate.css';

function Certificate() {
  const [results, setResults] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger le nom de l'utilisateur
      const profileResponse = await apiService.getProfile();
      if (profileResponse.success && profileResponse.data.user) {
        setUserName(profileResponse.data.user.full_name || profileResponse.data.user.email || 'Étudiant');
      }

      // Charger les résultats
      const resultsResponse = await apiService.getMyResults();
      if (resultsResponse.success && resultsResponse.data.length > 0) {
        setResults(resultsResponse.data[0]);
      } else {
        setError('Aucun résultat disponible. Veuillez d\'abord passer le test.');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      
      // Si erreur d'authentification, rediriger vers login
      if (err.message.includes('Token') || err.message.includes('Unauthorized')) {
        navigate('/login');
      } else {
        setError('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const convertToImage = async () => {
    setSharing(true);
    try {
      const certificateElement = document.querySelector('.certificate-container');
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error converting to image:', error);
      alert('Erreur lors de la conversion du certificat');
      return null;
    } finally {
      setSharing(false);
    }
  };

  const handleLinkedInShare = async () => {
    const imageData = await convertToImage();
    if (!imageData) return;

    // Télécharger l'image pour que l'utilisateur puisse l'uploader sur LinkedIn
    const link = document.createElement('a');
    link.download = `Certificat_EFSET_${userName.replace(/\s+/g, '_')}.png`;
    link.href = imageData;
    link.click();

    // Ouvrir LinkedIn pour créer un post
    setTimeout(() => {
      const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true';
      window.open(linkedInUrl, '_blank');
      alert('Image téléchargée! Uploadez-la dans votre post LinkedIn.');
    }, 500);
  };

  const handleWhatsAppShare = async () => {
    const imageData = await convertToImage();
    if (!imageData) return;

    // Télécharger l'image
    const link = document.createElement('a');
    link.download = `Certificat_EFSET_${userName.replace(/\s+/g, '_')}.png`;
    link.href = imageData;
    link.click();

    // Ouvrir WhatsApp Web
    setTimeout(() => {
      const text = encodeURIComponent(`🎓 J'ai obtenu mon certificat EFSET avec un score de ${results.overall_score}/100!`);
      const whatsappUrl = `https://web.whatsapp.com/send?text=${text}`;
      window.open(whatsappUrl, '_blank');
      alert('Image téléchargée! Partagez-la sur WhatsApp.');
    }, 500);
  };

  if (loading) {
    return (
      <div className="certificate-loading">
        <div className="loading-spinner"></div>
        <p>Génération du certificat...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="certificate-error">
        <p>{error || 'Aucun résultat disponible. Veuillez d\'abord passer le test.'}</p>
        <button onClick={() => navigate('/test')}>Passer le test</button>
        <button onClick={() => navigate('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <div className="certificate-actions no-print">
        <button className="btn-print" onClick={handlePrint}>
          🖨️ Imprimer le Certificat
        </button>
        <div className="share-container">
          <button className="btn-share" onClick={handleShare} disabled={sharing}>
            {sharing ? '⏳ Préparation...' : '📤 Partager'}
          </button>
          {showShareMenu && (
            <div className="share-menu">
              <button className="share-option linkedin" onClick={handleLinkedInShare}>
                <span className="share-icon">💼</span>
                <span>LinkedIn</span>
              </button>
              <button className="share-option whatsapp" onClick={handleWhatsAppShare}>
                <span className="share-icon">💬</span>
                <span>WhatsApp</span>
              </button>
            </div>
          )}
        </div>
        <button className="btn-home-cert" onClick={handleHome}>
          🏠 Retour à l'Accueil
        </button>
      </div>

      <main className="certificate-container">
        {/* Decorative corners */}
        <div className="decorative-corner corner-tl"></div>
        <div className="decorative-corner corner-tr"></div>
        <div className="decorative-corner corner-bl"></div>
        <div className="decorative-corner corner-br"></div>

        {/* Header */}
        <header className="certificate-header">
          <h1 className="title-font platform-name">CONSEILUX TRAINING AND DEVELOPMENT</h1>
          <div className="ornamental-line"></div>
          <p className="subtitle-text">CENTRE DE FORMATION PROFESSIONNELLE</p>
        </header>

        {/* Certificate Title */}
        <div className="certificate-title-section">
          <h2 className="subtitle-font certificate-title">Certificat de Réussite</h2>
          <p className="certificate-subtitle">Ce certificat atteste que</p>
        </div>

        {/* Learner Name */}
        <div className="learner-section">
          <h3 className="title-font learner-name">{userName}</h3>
        </div>

        {/* Course Description */}
        <div className="course-section">
          <p className="course-intro">a complété avec succès la formation</p>
          <h4 className="subtitle-font course-name">EFSET English Proficiency Assessment</h4>
        </div>

        {/* Skills Section */}
        <div className="skills-section">
          <div className="skill-item">
            <div className="skill-circle">
              <span className="skill-score">{results.listening_score}</span>
              <span className="skill-label">%</span>
            </div>
            <p className="skill-name">Listening</p>
          </div>

          <div className="skill-item">
            <div className="skill-circle">
              <span className="skill-score">{results.reading_score}</span>
              <span className="skill-label">%</span>
            </div>
            <p className="skill-name">Reading</p>
          </div>

          <div className="skill-item">
            <div className="skill-circle">
              <span className="skill-score">{results.writing_score}</span>
              <span className="skill-label">%</span>
            </div>
            <p className="skill-name">Writing</p>
          </div>

          <div className="skill-item">
            <div className="skill-circle">
              <span className="skill-score">{results.speaking_score}</span>
              <span className="skill-label">%</span>
            </div>
            <p className="skill-name">Speaking</p>
          </div>
        </div>

        {/* Global Score */}
        <div className="global-score-section">
          <div className="ornamental-line-small"></div>
          <p className="global-label">Score Global</p>
          <div className="score-wrapper">
            <div className="global-score-badge">
              <span className="global-score-value">{results.overall_score || 0}</span>
              <span className="global-score-max">/100</span>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <footer className="certificate-footer">
          <div className="signature-line"></div>
          <p className="subtitle-font director-name">Ghislain CODJO</p>
          <p className="director-title">Directeur Général</p>
          <p className="company-name">Conseilux Training and Development</p>
        </footer>

        {/* Decorative Seal */}
        <img 
          src="/logo.jpeg" 
          alt="Logo" 
          className="seal"
        />
      </main>
    </div>
  );
}

export default Certificate;
