import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './PageStyles.css'

function CGV() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <div className="page-header">
          <h1>Conditions Générales de Vente</h1>
          <p className="page-subtitle">Dernière mise à jour : 22 janvier 2026</p>
        </div>

        <div className="page-body">
          <section className="legal-section">
            <h2>Article 1 - Objet</h2>
            <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Conseilux Language Academy, ci-après dénommée "le Prestataire", et toute personne physique ou morale, ci-après dénommée "le Client", souhaitant accéder aux services proposés sur le site englishtraining.fr.</p>
          </section>

          <section className="legal-section">
            <h2>Article 2 - Services proposés</h2>
            <p>Conseilux Language Academy propose les services suivants :</p>
            <ul>
              <li><strong>Tests d'anglais en ligne :</strong> évaluation du niveau d'anglais selon le référentiel CECRL (A1 à C2)</li>
              <li><strong>Formations en anglais :</strong> cours et programmes de formation personnalisés</li>
              <li><strong>Certifications :</strong> préparation aux certifications d'anglais reconnues</li>
              <li><strong>Services pour entreprises :</strong> solutions de formation sur mesure</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Article 3 - Prix</h2>
            <p>Les prix de nos services sont indiqués en euros (€) toutes taxes comprises (TTC).</p>
            <p>Le Prestataire se réserve le droit de modifier ses prix à tout moment. Les prix applicables sont ceux en vigueur au moment de la commande.</p>
            <p>Les prix incluent :</p>
            <ul>
              <li>L'accès à la plateforme de test</li>
              <li>L'évaluation complète des compétences (compréhension orale, compréhension écrite, expression orale, expression écrite)</li>
              <li>Le certificat de résultats avec niveau CECRL</li>
              <li>L'accès aux résultats pendant 5 ans</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Article 4 - Commande</h2>
            <p>Pour passer commande, le Client doit :</p>
            <ol>
              <li>Créer un compte sur la plateforme</li>
              <li>Sélectionner le service souhaité</li>
              <li>Valider son panier</li>
              <li>Procéder au paiement</li>
            </ol>
            <p>La validation de la commande implique l'acceptation pleine et entière des présentes CGV.</p>
            <p>Une confirmation de commande est envoyée par email au Client.</p>
          </section>

          <section className="legal-section">
            <h2>Article 5 - Paiement</h2>
            <p>Le paiement s'effectue en ligne par :</p>
            <ul>
              <li>Carte bancaire (Visa, Mastercard, American Express)</li>
              <li>PayPal</li>
              <li>Virement bancaire (pour les entreprises)</li>
            </ul>
            <p>Le paiement est sécurisé par notre prestataire de paiement certifié PCI-DSS.</p>
            <p>Le service est accessible immédiatement après validation du paiement.</p>
          </section>

          <section className="legal-section">
            <h2>Article 6 - Droit de rétractation</h2>
            <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture d'un contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur.</p>
            <p>En validant votre commande et en commençant le test, vous renoncez expressément à votre droit de rétractation.</p>
            <p>Toutefois, en cas de problème technique empêchant l'accès au service, le Client peut demander un remboursement dans les 48 heures suivant l'achat.</p>
          </section>

          <section className="legal-section">
            <h2>Article 7 - Accès au service</h2>
            <p>L'accès au service nécessite :</p>
            <ul>
              <li>Une connexion internet stable</li>
              <li>Un navigateur web récent (Chrome, Firefox, Safari, Edge)</li>
              <li>Un microphone fonctionnel (pour l'expression orale)</li>
              <li>Une webcam (optionnelle, pour la surveillance du test)</li>
            </ul>
            <p>Le Client est responsable de la compatibilité de son équipement.</p>
          </section>

          <section className="legal-section">
            <h2>Article 8 - Durée du test</h2>
            <p>Le test d'anglais complet dure environ 90 minutes et comprend :</p>
            <ul>
              <li>Compréhension orale : 25 minutes</li>
              <li>Compréhension écrite : 25 minutes</li>
              <li>Expression orale : 20 minutes</li>
              <li>Expression écrite : 20 minutes</li>
            </ul>
            <p>Le test doit être complété en une seule session. Une pause de 5 minutes est autorisée entre les sections.</p>
          </section>

          <section className="legal-section">
            <h2>Article 9 - Résultats</h2>
            <p>Les résultats sont disponibles :</p>
            <ul>
              <li><strong>Compréhension orale et écrite :</strong> immédiatement après le test</li>
              <li><strong>Expression orale et écrite :</strong> sous 48 heures ouvrées</li>
            </ul>
            <p>Le certificat de résultats est téléchargeable au format PDF et reste accessible pendant 5 ans.</p>
          </section>

          <section className="legal-section">
            <h2>Article 10 - Obligations du Client</h2>
            <p>Le Client s'engage à :</p>
            <ul>
              <li>Fournir des informations exactes lors de l'inscription</li>
              <li>Passer le test de manière individuelle et sans aide extérieure</li>
              <li>Ne pas utiliser de traducteurs automatiques ou d'outils d'aide</li>
              <li>Respecter les règles de conduite du test</li>
              <li>Ne pas partager son compte ou ses identifiants</li>
            </ul>
            <p>Tout manquement à ces obligations peut entraîner l'annulation du test sans remboursement.</p>
          </section>

          <section className="legal-section">
            <h2>Article 11 - Obligations du Prestataire</h2>
            <p>Le Prestataire s'engage à :</p>
            <ul>
              <li>Fournir un service de qualité conforme aux standards CECRL</li>
              <li>Assurer la disponibilité de la plateforme (99% du temps)</li>
              <li>Protéger les données personnelles du Client</li>
              <li>Fournir un support technique en cas de problème</li>
              <li>Délivrer les résultats dans les délais annoncés</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Article 12 - Responsabilité</h2>
            <p>Le Prestataire ne peut être tenu responsable :</p>
            <ul>
              <li>Des problèmes techniques liés à l'équipement du Client</li>
              <li>Des interruptions de connexion internet</li>
              <li>De l'utilisation frauduleuse du compte par un tiers</li>
              <li>Des résultats obtenus par le Client</li>
            </ul>
            <p>En cas de dysfonctionnement imputable au Prestataire, la responsabilité est limitée au montant payé par le Client.</p>
          </section>

          <section className="legal-section">
            <h2>Article 13 - Propriété intellectuelle</h2>
            <p>Tous les contenus du site (textes, images, vidéos, questions de test, etc.) sont la propriété exclusive de Conseilux Language Academy.</p>
            <p>Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.</p>
          </section>

          <section className="legal-section">
            <h2>Article 14 - Données personnelles</h2>
            <p>Les données personnelles collectées sont traitées conformément à notre <Link to="/confidentialite">Politique de Confidentialité</Link> et au RGPD.</p>
          </section>

          <section className="legal-section">
            <h2>Article 15 - Réclamations</h2>
            <p>Pour toute réclamation, le Client peut contacter le service client :</p>
            <p><strong>Email :</strong> contact@conseiluxtraining.com</p>
            <p><strong>Téléphone (Fr) :</strong> +33 745644181</p>
            <p><strong>Téléphone (Ben) :</strong> +229 01 96 37 17 07</p>
            <p><strong>Délai de réponse :</strong> 48 heures ouvrées</p>
          </section>

          <section className="legal-section">
            <h2>Article 16 - Médiation</h2>
            <p>En cas de litige, le Client peut recourir gratuitement à un médiateur de la consommation :</p>
            <p><strong>Médiateur :</strong> Association des Médiateurs Européens (AME)</p>
            <p><strong>Site web :</strong> www.mediationconso-ame.com</p>
          </section>

          <section className="legal-section">
            <h2>Article 17 - Droit applicable</h2>
            <p>Les présentes CGV sont régies par le droit français.</p>
            <p>En cas de litige, et après échec de toute tentative de règlement amiable, les tribunaux français seront seuls compétents.</p>
          </section>

          <section className="legal-section">
            <h2>Article 18 - Modifications</h2>
            <p>Le Prestataire se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur au moment de la commande.</p>
          </section>

          <section className="legal-section">
            <h2>Contact</h2>
            <p><strong>Conseilux Language Academy</strong></p>
            <p>123 Avenue des Champs-Élysées</p>
            <p>75008 Paris, France</p>
            <p>Email : contact@conseiluxtraining.com</p>
            <p>Téléphone (Fr) : +33 745644181</p>
            <p>Téléphone (Ben) : +229 01 96 37 17 07</p>
            <p>RCS Paris B 123 456 789</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CGV
