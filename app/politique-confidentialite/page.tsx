import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Portail Habitat",
  description: "Découvrez comment Portail Habitat protège vos données personnelles et respecte votre vie privée selon le RGPD.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/politique-confidentialite",
  },
};

export default function PolitiqueConfidentialite() {
  return (
    <LegalPage 
      title="Politique de Confidentialité"
      subtitle="Dernière mise à jour : 9 décembre 2024"
    >
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-8">
        <p className="text-purple-800">
          <strong>Engagement :</strong> Portail Habitat s'engage à protéger vos données personnelles 
          et à respecter votre vie privée conformément au RGPD et à la loi Informatique et Libertés.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Responsable du traitement
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p className="text-gray-700">
          <strong>Nicolas CASTERA</strong><br />
          Entrepreneur individuel<br />
          SIRET : 832 414 650 00024<br />
          Adresse : 22 RUE DE LIBOURNE, 33100 BORDEAUX<br />
          Email : casteranicolas.contact@gmail.com
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Données collectées
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">2.1 Données des particuliers</h3>
        <p className="mb-4">Lors d'une demande de devis, nous collectons :</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Identité :</strong> Nom, prénom</li>
          <li><strong>Contact :</strong> Email, téléphone, adresse postale</li>
          <li><strong>Projet :</strong> Type de travaux, description, budget estimé, surface</li>
          <li><strong>Localisation :</strong> Ville, code postal, département</li>
          <li><strong>Préférences :</strong> Délais souhaités, critères de sélection</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">2.2 Données des professionnels</h3>
        <p className="mb-4">Lors de l'inscription, nous collectons :</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Identité :</strong> Nom, prénom, raison sociale</li>
          <li><strong>Entreprise :</strong> SIRET, forme juridique, activité</li>
          <li><strong>Contact :</strong> Email, téléphone, adresse</li>
          <li><strong>Professionnel :</strong> Spécialités, zone d'intervention, tarifs</li>
          <li><strong>Assurances :</strong> Justificatifs d'assurance professionnelle</li>
          <li><strong>Marketing :</strong> Photos de réalisations, descriptions</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">2.3 Données techniques</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Navigation :</strong> Adresse IP, navigateur, pages visitées</li>
          <li><strong>Cookies :</strong> Préférences, statistiques de visite</li>
          <li><strong>Performance :</strong> Temps de chargement, erreurs techniques</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        3. Finalités du traitement
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">3.1 Mise en relation</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Transmission des demandes de devis aux professionnels adaptés</li>
          <li>Facilitation des échanges entre particuliers et professionnels</li>
          <li>Suivi de la qualité des mises en relation</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">3.2 Gestion des comptes</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Création et gestion des profils professionnels</li>
          <li>Authentification et sécurisation des accès</li>
          <li>Support technique et commercial</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">3.3 Amélioration des services</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Analyse des performances de la plateforme</li>
          <li>Développement de nouvelles fonctionnalités</li>
          <li>Personnalisation de l'expérience utilisateur</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">3.4 Communication</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Envoi de notifications liées aux demandes</li>
          <li>Information sur les évolutions du service</li>
          <li>Newsletter (avec consentement explicite)</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Base légale du traitement
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">Les traitements de données personnelles sont fondés sur :</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Exécution du contrat :</strong> Mise en relation et gestion des services</li>
          <li><strong>Intérêt légitime :</strong> Amélioration des services, sécurité, statistiques</li>
          <li><strong>Consentement :</strong> Newsletter, cookies non essentiels</li>
          <li><strong>Obligation légale :</strong> Conservation des factures, déclarations fiscales</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Destinataires des données
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">5.1 Destinataires internes</h3>
        <p className="mb-4">
          Seul Nicolas CASTERA, en tant qu'entrepreneur individuel, a accès aux données 
          dans le cadre de la gestion de la plateforme.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">5.2 Destinataires externes</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Professionnels partenaires :</strong> Coordonnées des particuliers pour les demandes de devis</li>
          <li><strong>Prestataires techniques :</strong> Hébergement (Vercel), paiement (Stripe), emails (SendGrid)</li>
          <li><strong>Autorités :</strong> En cas d'obligation légale ou de demande judiciaire</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.3 Transferts hors UE</h3>
        <p>
          Certains prestataires (Vercel, Stripe) peuvent traiter des données hors Union Européenne. 
          Ces transferts sont encadrés par des clauses contractuelles types ou des décisions d'adéquation.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Durée de conservation
      </h2>
      <div className="text-gray-700 mb-6">
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-3 text-left">Type de données</th>
              <th className="border border-gray-300 p-3 text-left">Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3">Demandes de devis (particuliers)</td>
              <td className="border border-gray-300 p-3">3 ans après la dernière interaction</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Comptes professionnels actifs</td>
              <td className="border border-gray-300 p-3">Durée de la relation contractuelle</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Comptes professionnels résiliés</td>
              <td className="border border-gray-300 p-3">5 ans (obligations comptables)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Données de facturation</td>
              <td className="border border-gray-300 p-3">10 ans (obligations légales)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Logs de connexion</td>
              <td className="border border-gray-300 p-3">1 an maximum</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Cookies</td>
              <td className="border border-gray-300 p-3">13 mois maximum</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        7. Vos droits
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
        
        <h3 className="text-lg font-semibold mb-3">7.1 Droit d'accès</h3>
        <p className="mb-4">
          Vous pouvez demander l'accès à vos données personnelles et obtenir une copie 
          de celles-ci ainsi que des informations sur leur traitement.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.2 Droit de rectification</h3>
        <p className="mb-4">
          Vous pouvez demander la correction de données inexactes ou incomplètes.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.3 Droit à l'effacement</h3>
        <p className="mb-4">
          Vous pouvez demander la suppression de vos données dans certaines conditions 
          (retrait du consentement, opposition au traitement, etc.).
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.4 Droit à la limitation</h3>
        <p className="mb-4">
          Vous pouvez demander la limitation du traitement de vos données dans certains cas.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.5 Droit à la portabilité</h3>
        <p className="mb-4">
          Vous pouvez récupérer vos données dans un format structuré et les transmettre 
          à un autre responsable de traitement.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.6 Droit d'opposition</h3>
        <p className="mb-4">
          Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes 
          ou pour la prospection commerciale.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.7 Exercice des droits</h3>
        <p className="mb-4">
          Pour exercer vos droits, contactez-nous à : casteranicolas.contact@gmail.com
        </p>
        <p className="mb-4">
          Nous vous répondrons dans un délai d'un mois. En cas de demande complexe, 
          ce délai peut être prolongé de deux mois avec information préalable.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Cookies et technologies similaires
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">8.1 Types de cookies utilisés</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (session, sécurité)</li>
          <li><strong>Cookies analytiques :</strong> Mesure d'audience et performance (avec consentement)</li>
          <li><strong>Cookies de préférences :</strong> Mémorisation des choix utilisateur</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">8.2 Gestion des cookies</h3>
        <p className="mb-4">
          Vous pouvez gérer vos préférences de cookies via :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Le bandeau de consentement lors de votre première visite</li>
          <li>Les paramètres de votre navigateur</li>
          <li>Les liens de désinscription dans nos communications</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Sécurité des données
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
          pour protéger vos données personnelles :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Chiffrement :</strong> HTTPS pour tous les échanges de données</li>
          <li><strong>Authentification :</strong> Mots de passe sécurisés et authentification forte</li>
          <li><strong>Accès restreint :</strong> Principe du moindre privilège</li>
          <li><strong>Sauvegarde :</strong> Sauvegardes régulières et sécurisées</li>
          <li><strong>Monitoring :</strong> Surveillance des accès et des anomalies</li>
          <li><strong>Formation :</strong> Sensibilisation aux bonnes pratiques de sécurité</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        10. Violations de données
      </h2>
      <p className="text-gray-700 mb-6">
        En cas de violation de données personnelles susceptible d'engendrer un risque élevé 
        pour vos droits et libertés, nous vous en informerons dans les meilleurs délais 
        et au plus tard dans les 72 heures après en avoir pris connaissance.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        11. Mineurs
      </h2>
      <p className="text-gray-700 mb-6">
        Nos services s'adressent aux personnes majeures. Nous ne collectons pas 
        sciemment de données personnelles concernant des mineurs de moins de 16 ans. 
        Si vous êtes parent et que vous découvrez que votre enfant nous a fourni 
        des données personnelles, contactez-nous pour leur suppression.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        12. Modifications de la politique
      </h2>
      <p className="text-gray-700 mb-6">
        Cette politique de confidentialité peut être modifiée pour refléter les évolutions 
        de nos pratiques ou de la réglementation. Nous vous informerons de toute modification 
        importante par email ou via un avis sur notre site web.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        13. Réclamations
      </h2>
      <p className="text-gray-700 mb-6">
        Si vous estimez que le traitement de vos données personnelles constitue une violation 
        du RGPD, vous avez le droit d'introduire une réclamation auprès de la CNIL :
        <br /><br />
        <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong><br />
        3 Place de Fontenoy - TSA 80715<br />
        75334 PARIS CEDEX 07<br />
        Téléphone : 01 53 73 22 22<br />
        Site web : <a href="https://www.cnil.fr" className="text-blue-600 hover:underline">www.cnil.fr</a>
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        14. Contact - Délégué à la Protection des Données
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700 mb-4">
          Pour toute question relative à cette politique de confidentialité ou à l'exercice 
          de vos droits, vous pouvez nous contacter :
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Nicolas CASTERA</strong><br />
          Responsable du traitement des données<br />
          22 RUE DE LIBOURNE, 33100 BORDEAUX
        </p>
        <p className="text-gray-700">
          Email : casteranicolas.contact@gmail.com<br />
          Objet : "Protection des données personnelles"
        </p>
      </div>
    </LegalPage>
  );
}
