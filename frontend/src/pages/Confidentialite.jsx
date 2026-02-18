import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function Confidentialite() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1>Politique de Confidentialité</h1>
          <p className="page-subtitle">Dernière mise à jour : 22 janvier 2026</p>
        </div>

        <div className="page-body">
          <section className="legal-section">
            <h2>Introduction</h2>
            <p>Conseilux Language Academy accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, partageons et protégeons vos informations personnelles.</p>
          </section>

          <section className="legal-section">
            <h2>Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul>
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
              <li><strong>Données de connexion :</strong> adresse IP, type de navigateur, pages visitées</li>
              <li><strong>Données de test :</strong> résultats aux tests d'anglais, réponses, scores, niveau CECRL</li>
              <li><strong>Données de paiement :</strong> informations de facturation (traitées par nos prestataires de paiement sécurisés)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Finalités du traitement</h2>
            <p>Vos données sont collectées pour les finalités suivantes :</p>
            <ul>
              <li>Création et gestion de votre compte utilisateur</li>
              <li>Fourniture des services de test d'anglais</li>
              <li>Évaluation de votre niveau d'anglais et génération de résultats</li>
              <li>Communication concernant nos services</li>
              <li>Amélioration de nos services et de l'expérience utilisateur</li>
              <li>Respect de nos obligations légales</li>
              <li>Envoi de newsletters (avec votre consentement)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>L'exécution du contrat :</strong> pour la fourniture de nos services</li>
              <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing</li>
              <li><strong>Notre intérêt légitime :</strong> pour l'amélioration de nos services</li>
              <li><strong>Obligations légales :</strong> pour la conservation de certaines données</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Durée de conservation</h2>
            <p>Vos données sont conservées pendant :</p>
            <ul>
              <li><strong>Données de compte :</strong> pendant toute la durée de votre compte actif + 3 ans après la dernière activité</li>
              <li><strong>Résultats de tests :</strong> 5 ans à compter de la date du test</li>
              <li><strong>Données de facturation :</strong> 10 ans conformément aux obligations légales</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Partage des données</h2>
            <p>Vos données peuvent être partagées avec :</p>
            <ul>
              <li><strong>Prestataires de services :</strong> hébergement, paiement, analyse</li>
              <li><strong>Partenaires commerciaux :</strong> uniquement avec votre consentement explicite</li>
              <li><strong>Autorités légales :</strong> en cas d'obligation légale</li>
            </ul>
            <p>Nous ne vendons jamais vos données personnelles à des tiers.</p>
          </section>

          <section className="legal-section">
            <h2>Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données (droit à l'oubli)</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous à : <strong>privacy@conseiluxtraining.com</strong></p>
          </section>

          <section className="legal-section">
            <h2>Sécurité des données</h2>
            <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre :</p>
            <ul>
              <li>L'accès non autorisé</li>
              <li>La divulgation</li>
              <li>La modification</li>
              <li>La destruction</li>
            </ul>
            <p>Nos mesures incluent le chiffrement SSL/TLS, l'authentification sécurisée, et des audits de sécurité réguliers.</p>
          </section>

          <section className="legal-section">
            <h2>Cookies</h2>
            <p>Nous utilisons des cookies pour :</p>
            <ul>
              <li>Assurer le bon fonctionnement du site</li>
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic et l'utilisation du site</li>
              <li>Personnaliser votre expérience</li>
            </ul>
            <p>Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.</p>
          </section>

          <section className="legal-section">
            <h2>Transferts internationaux</h2>
            <p>Vos données peuvent être transférées et stockées dans des pays en dehors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont en place conformément au RGPD.</p>
          </section>

          <section className="legal-section">
            <h2>Modifications de la politique</h2>
            <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.</p>
          </section>

          <section className="legal-section">
            <h2>Contact</h2>
            <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
            <p><strong>Email :</strong> privacy@conseiluxtraining.com</p>
            <p><strong>Adresse :</strong> Conseilux Language Academy, 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
            <p><strong>Délégué à la Protection des Données :</strong> dpo@conseiluxtraining.com</p>
          </section>

          <section className="legal-section">
            <h2>Réclamation</h2>
            <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :</p>
            <p><strong>Site web :</strong> www.cnil.fr</p>
            <p><strong>Adresse :</strong> 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Confidentialite
