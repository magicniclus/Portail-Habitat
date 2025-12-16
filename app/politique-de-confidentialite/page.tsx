import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Portail Habitat",
  description: "Découvrez comment Portail Habitat protège vos données personnelles sur le site web et l'application mobile selon le RGPD.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/politique-de-confidentialite",
  },
};

export default function PolitiqueConfidentialite() {
  return (
    <LegalPage 
      title="Politique de Confidentialité"
      subtitle="Dernière mise à jour : 16 décembre 2024"
    >
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
        <p className="text-orange-800">
          <strong>Engagement :</strong> Portail Habitat s'engage à protéger vos données personnelles 
          et à respecter votre vie privée conformément au RGPD et à la loi Informatique et Libertés.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Introduction et objet de la politique
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          La présente politique de confidentialité s'applique à l'utilisation du site internet 
          <strong> Portail Habitat</strong> ainsi qu'à l'application mobile <strong>Portail Habitat</strong>, 
          disponible sur iOS et Android.
        </p>
        <p className="mb-4">
          <strong>Portail Habitat</strong> est une plateforme de mise en relation entre particuliers 
          et professionnels du bâtiment, permettant aux particuliers de soumettre leurs demandes 
          de travaux et aux artisans de recevoir des opportunités commerciales qualifiées.
        </p>
        <p className="mb-4">
          L'application mobile est une extension du service web qui permet aux professionnels 
          inscrits d'accéder à leur compte et de gérer leurs demandes depuis leur smartphone ou tablette.
        </p>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
          <p className="text-green-800">
            <strong>Important :</strong> L'application mobile ne collecte pas de données supplémentaires 
            par rapport au site web et ne permet pas la création de nouveaux comptes.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Responsable du traitement
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
        3. Origine des données
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Les données personnelles sont collectées exclusivement via le site internet 
          <strong> portail-habitat.fr</strong>. L'application mobile permet uniquement 
          aux utilisateurs authentifiés d'accéder aux données associées à leur compte existant.
        </p>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
          <p className="text-orange-800">
            <strong>Application mobile :</strong>
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-orange-800">
            <li>L'application mobile Portail Habitat ne permet pas la création de compte</li>
            <li>L'application mobile ne collecte pas de nouvelles données personnelles</li>
            <li>L'application mobile affiche uniquement les données existantes du compte</li>
            <li>L'application mobile n'accède à aucune fonctionnalité du téléphone (contacts, appareil photo, localisation, stockage) en dehors de celles strictement nécessaires à l'authentification et à l'affichage des données</li>
          </ul>
        </div>
        <p className="mb-4">
          L'accès à l'application mobile nécessite une authentification afin de garantir 
          que seules les personnes autorisées puissent consulter les données professionnelles 
          associées à leur compte.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Données personnelles traitées
      </h2>
      <div className="text-gray-700 mb-6">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <p className="text-green-800">
            <strong>Principe :</strong> Aucune donnée personnelle supplémentaire n'est collectée 
            via l'application mobile par rapport à celles déjà collectées sur le site internet.
          </p>
        </div>
        
        <h3 className="text-lg font-semibold mb-3">4.1 Données d'identification</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Email :</strong> Adresse email professionnelle</li>
          <li><strong>Nom et prénom :</strong> Identité du professionnel</li>
          <li><strong>Raison sociale :</strong> Nom de l'entreprise</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">4.2 Données professionnelles</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Métier :</strong> Spécialités et domaines d'activité</li>
          <li><strong>Zone géographique :</strong> Zone d'intervention</li>
          <li><strong>Informations liées aux demandes :</strong> Projets, devis, communications</li>
          <li><strong>SIRET :</strong> Numéro d'identification de l'entreprise</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">4.3 Données de connexion</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Identifiant de compte :</strong> Identifiant unique Firebase</li>
          <li><strong>Date de dernière connexion :</strong> Horodatage des accès</li>
          <li><strong>Données de session :</strong> Tokens d'authentification temporaires</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">4.4 Données techniques (site web uniquement)</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Navigation :</strong> Adresse IP, navigateur, pages visitées</li>
          <li><strong>Cookies :</strong> Préférences utilisateur, statistiques de visite</li>
          <li><strong>Performance :</strong> Temps de chargement, erreurs techniques</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Finalités du traitement
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Nous traitons vos données personnelles pour les finalités suivantes :
        </p>
        
        <h3 className="text-lg font-semibold mb-3">5.1 Permettre l'accès au compte professionnel</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Authentification et sécurisation des accès au site web et à l'application mobile</li>
          <li>Permettre l'accès au compte depuis l'application mobile</li>
          <li>Gestion des sessions utilisateur</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.2 Afficher et gérer les demandes de travaux</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Consulter et gérer les demandes de chantiers via l'application</li>
          <li>Transmission des demandes de devis aux professionnels adaptés</li>
          <li>Facilitation des échanges entre particuliers et professionnels</li>
          <li>Suivi de la qualité des mises en relation</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.3 Assurer le fonctionnement du service</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Assurer la synchronisation entre le site et l'application</li>
          <li>Maintenance technique et sécurité de la plateforme</li>
          <li>Support technique et commercial</li>
          <li>Analyse des performances de la plateforme</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.4 Envoyer des notifications liées aux demandes</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Notifications par email concernant les nouvelles demandes</li>
          <li>Alertes sur l'évolution des projets</li>
          <li>Communications liées au service (maintenance, évolutions)</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.5 Support client</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Répondre aux demandes d'assistance</li>
          <li>Résolution des problèmes techniques</li>
          <li>Amélioration continue du service</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Base légale du traitement
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
        7. Destinataires des données
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Les données sont accessibles via le site web et l'application mobile, 
          mais restent sous le même cadre de traitement et de sécurité.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.1 Accès limité aux équipes Portail Habitat</h3>
        <p className="mb-4">
          Seul Nicolas CASTERA, en tant qu'entrepreneur individuel et responsable du traitement, 
          a accès aux données personnelles dans le cadre de la gestion de la plateforme.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">7.2 Prestataires techniques</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Firebase (Google Cloud) :</strong> Hébergement des données et authentification</li>
          <li><strong>Vercel :</strong> Hébergement du site web</li>
          <li><strong>Stripe :</strong> Traitement des paiements</li>
          <li><strong>SendGrid :</strong> Envoi d'emails transactionnels</li>
        </ul>
        
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
          <p className="text-orange-800">
            <strong>Important :</strong> Les données ne sont pas revendues à des tiers. 
            Elles ne sont partagées qu'avec les prestataires techniques nécessaires 
            au fonctionnement du service.
          </p>
        </div>
        
        <h3 className="text-lg font-semibold mb-3">7.3 Transferts hors Union Européenne</h3>
        <p className="mb-4">
          Certains prestataires techniques (Firebase/Google Cloud, Vercel) peuvent traiter 
          des données hors Union Européenne. Ces transferts sont encadrés par :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Des clauses contractuelles types approuvées par la Commission européenne</li>
          <li>Des décisions d'adéquation de la Commission européenne</li>
          <li>Des mesures de sécurité supplémentaires appropriées</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Durée de conservation
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Les données personnelles sont conservées tant que le compte est actif. 
          En cas de suppression du compte ou de fermeture, les durées suivantes s'appliquent :
        </p>
        <table className="w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 p-3 text-left">Type de données</th>
              <th className="border border-gray-300 p-3 text-left">Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3">Comptes professionnels actifs</td>
              <td className="border border-gray-300 p-3">Tant que le compte est actif</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3">Comptes professionnels fermés</td>
              <td className="border border-gray-300 p-3">Suppression sur demande</td>
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
              <td className="border border-gray-300 p-3">Données techniques (cookies)</td>
              <td className="border border-gray-300 p-3">13 mois maximum (site web uniquement)</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4">
          Certaines données peuvent être conservées plus longtemps pour respecter 
          nos obligations légales (comptabilité, fiscalité).
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Vos droits
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
        
        <h3 className="text-lg font-semibold mb-3">9.1 Droit d'accès</h3>
        <p className="mb-4">
          Vous pouvez demander l'accès à vos données personnelles et obtenir une copie 
          de celles-ci ainsi que des informations sur leur traitement.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.2 Droit de rectification</h3>
        <p className="mb-4">
          Vous pouvez demander la correction de données inexactes ou incomplètes 
          directement depuis votre compte ou en nous contactant.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.3 Droit à l'effacement</h3>
        <p className="mb-4">
          Vous pouvez demander la suppression de vos données dans certaines conditions 
          (retrait du consentement, opposition au traitement, etc.).
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.4 Droit à la limitation</h3>
        <p className="mb-4">
          Vous pouvez demander la limitation du traitement de vos données dans certains cas.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.5 Droit à la portabilité</h3>
        <p className="mb-4">
          Vous pouvez récupérer vos données dans un format structuré et les transmettre 
          à un autre responsable de traitement.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.6 Droit d'opposition</h3>
        <p className="mb-4">
          Vous pouvez vous opposer au traitement de vos données pour des raisons légitimes 
          ou pour la prospection commerciale.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">9.7 Exercice des droits</h3>
        <p className="mb-4">
          Pour exercer vos droits, contactez-nous à : 
          <strong>casteranicolas.contact@gmail.com</strong>
        </p>
        <p className="mb-4">
          Nous vous répondrons dans un délai d'un mois. En cas de demande complexe, 
          ce délai peut être prolongé de deux mois avec information préalable.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        10. Suppression du compte
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Vous pouvez demander la suppression complète de votre compte et de toutes 
          les données associées à tout moment.
        </p>
        <h3 className="text-lg font-semibold mb-3">10.1 Comment demander la suppression</h3>
        <p className="mb-4">
          Pour supprimer votre compte, envoyez un email à : 
          <strong>casteranicolas.contact@gmail.com</strong> avec l'objet 
          "Suppression de compte".
        </p>
        <h3 className="text-lg font-semibold mb-3">10.2 Délai de traitement</h3>
        <p className="mb-4">
          Votre demande sera traitée dans un délai maximum de <strong>30 jours</strong> 
          à compter de la réception de votre demande.
        </p>
        <h3 className="text-lg font-semibold mb-3">10.3 Données conservées</h3>
        <p className="mb-4">
          Après suppression de votre compte, seules les données nécessaires au respect 
          de nos obligations légales (factures, données comptables) seront conservées 
          pour la durée légale requise.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        11. Cookies et technologies similaires
      </h2>
      <div className="text-gray-700 mb-6">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
          <p className="text-orange-800">
            <strong>Application mobile :</strong> L'application mobile ne met pas de cookies. 
            Les cookies sont utilisés uniquement sur le site web.
          </p>
        </div>
        
        <h3 className="text-lg font-semibold mb-3">11.1 Types de cookies utilisés (site web uniquement)</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (session, sécurité)</li>
          <li><strong>Cookies analytiques :</strong> Mesure d'audience et performance (avec consentement)</li>
          <li><strong>Cookies de préférences :</strong> Mémorisation des choix utilisateur</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">11.2 Gestion des cookies</h3>
        <p className="mb-4">
          Vous pouvez gérer vos préférences de cookies via :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Le bandeau de consentement lors de votre première visite sur le site web</li>
          <li>Les paramètres de votre navigateur</li>
          <li>Les liens de désinscription dans nos communications</li>
        </ul>
        <p className="mb-4">
          <strong>Rappel :</strong> Aucun cookie publicitaire n'est utilisé dans l'application mobile.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        12. Sécurité des données
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
          pour protéger vos données personnelles sur le site web et dans l'application mobile :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Chiffrement :</strong> HTTPS pour tous les échanges de données</li>
          <li><strong>Authentification :</strong> Mots de passe sécurisés et authentification Firebase</li>
          <li><strong>Hébergement sécurisé :</strong> Infrastructure Firebase (Google Cloud) certifiée</li>
          <li><strong>Accès restreint :</strong> Principe du moindre privilège</li>
          <li><strong>Sauvegarde :</strong> Sauvegardes automatiques et sécurisées</li>
          <li><strong>Monitoring :</strong> Surveillance des accès et des anomalies</li>
        </ul>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
          <p className="text-green-800">
            <strong>Application mobile :</strong> L'application utilise les mêmes mesures 
            de sécurité que le site web, avec authentification Firebase et chiffrement 
            des communications.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        13. Modifications de la politique
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Cette politique de confidentialité peut être modifiée pour refléter les évolutions 
          de nos pratiques ou de la réglementation.
        </p>
        <p className="mb-4">
          Nous vous informerons de toute modification importante par email ou via un avis 
          sur notre site web et dans l'application mobile.
        </p>
        <p className="mb-4">
          <strong>Date de dernière mise à jour :</strong> 16 décembre 2024
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        14. Réclamations
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
        15. Contact - Délégué à la Protection des Données
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
          Email : <strong>casteranicolas.contact@gmail.com</strong><br />
          Objet : "Protection des données personnelles"
        </p>
      </div>
    </LegalPage>
  );
}
