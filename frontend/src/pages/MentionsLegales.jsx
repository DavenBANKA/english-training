import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function MentionsLegales() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1>Mentions Légales</h1>
        </div>

        <div className="page-body">
          <section className="legal-section">
            <h2>Éditeur du site</h2>
            <p><strong>Raison sociale :</strong> Conseilux Language Academy</p>
            <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
            <p><strong>Capital social :</strong> 10 000 €</p>
            <p><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
            <p><strong>RCS :</strong> Paris B 123 456 789</p>
            <p><strong>SIRET :</strong> 123 456 789 00012</p>
            <p><strong>TVA intracommunautaire :</strong> FR 12 123456789</p>
            <p><strong>Téléphone (Fr) :</strong> +33 745644181</p>
            <p><strong>Téléphone (Ben) :</strong> +229 01 96 37 17 07</p>
            <p><strong>Email :</strong> contact@conseiluxtraining.com</p>
          </section>

          <section className="legal-section">
            <h2>Directeur de la publication</h2>
            <p><strong>Nom :</strong> Jean Dupont</p>
            <p><strong>Qualité :</strong> Président</p>
          </section>

          <section className="legal-section">
            <h2>Hébergement</h2>
            <p><strong>Hébergeur :</strong> OVH</p>
            <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
            <p><strong>Téléphone :</strong> 1007</p>
          </section>

          <section className="legal-section">
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.) est la propriété exclusive de Conseilux Language Academy, sauf mention contraire.</p>
            <p>Toute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Conseilux Language Academy.</p>
          </section>

          <section className="legal-section">
            <h2>Données personnelles</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.</p>
            <p>Pour exercer ces droits, vous pouvez nous contacter à l'adresse : <strong>privacy@conseiluxtraining.com</strong></p>
            <p>Pour plus d'informations, consultez notre <Link to="/confidentialite">Politique de Confidentialité</Link>.</p>
          </section>

          <section className="legal-section">
            <h2>Cookies</h2>
            <p>Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.</p>
          </section>

          <section className="legal-section">
            <h2>Limitation de responsabilité</h2>
            <p>Conseilux Language Academy s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Conseilux Language Academy ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.</p>
            <p>Conseilux Language Academy ne pourra être tenue responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation du site.</p>
          </section>

          <section className="legal-section">
            <h2>Droit applicable</h2>
            <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MentionsLegales
