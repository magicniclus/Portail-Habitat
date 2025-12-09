import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - Portail Habitat",
  description: "Consultez les conditions générales de vente de Portail Habitat pour les professionnels du bâtiment.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/cgv",
  },
};

export default function CGV() {
  return (
    <LegalPage 
      title="Conditions Générales de Vente"
      subtitle="Dernière mise à jour : 9 décembre 2024"
    >
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <p className="text-blue-800">
          <strong>Important :</strong> Ces conditions s'appliquent aux professionnels du bâtiment 
          utilisant la plateforme Portail Habitat pour recevoir des leads et gérer leur activité commerciale.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Définitions
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-2"><strong>Plateforme :</strong> Le site web Portail Habitat accessible à l'adresse https://portail-habitat.fr</p>
        <p className="mb-2"><strong>Professionnel :</strong> Artisan ou entreprise du bâtiment inscrit sur la plateforme</p>
        <p className="mb-2"><strong>Lead :</strong> Demande de devis ou contact commercial transmis par un particulier</p>
        <p className="mb-2"><strong>Abonnement :</strong> Accès mensuel aux services de la plateforme</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Objet et champ d'application
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations 
        de Nicolas CASTERA, entrepreneur individuel (SIRET : 832 414 650 00024), éditeur de la 
        plateforme Portail Habitat, et des professionnels du bâtiment utilisant les services 
        de mise en relation avec des particuliers.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        3. Services proposés
      </h2>
      <p className="text-gray-700 mb-4">
        Portail Habitat propose aux professionnels du bâtiment les services suivants :
      </p>
      <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
        <li><strong>Mise en relation qualifiée :</strong> Transmission de demandes de devis de particuliers selon votre zone géographique et vos spécialités</li>
        <li><strong>Interface de gestion :</strong> Tableau de bord pour gérer vos leads, projets et communications</li>
        <li><strong>Profil professionnel :</strong> Page dédiée présentant votre entreprise, vos réalisations et avis clients</li>
        <li><strong>Système d'avis :</strong> Collecte et affichage des avis clients pour renforcer votre réputation</li>
        <li><strong>Outils marketing :</strong> Visibilité dans les résultats de recherche et recommandations</li>
        <li><strong>Support technique :</strong> Assistance pour l'utilisation de la plateforme</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Inscription et validation du profil
      </h2>
      <p className="text-gray-700 mb-4">
        L'inscription sur la plateforme nécessite :
      </p>
      <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
        <li>La fourniture d'informations exactes et complètes sur votre entreprise</li>
        <li>La justification de votre activité professionnelle (SIRET, assurances)</li>
        <li>L'acceptation des présentes CGV</li>
        <li>La validation de votre profil par nos équipes</li>
      </ul>
      <p className="text-gray-700 mb-6">
        Portail Habitat se réserve le droit de refuser toute inscription ou de suspendre 
        un compte en cas de non-conformité aux critères de qualité ou de non-respect des présentes conditions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Tarification et modalités de paiement
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">5.1 Structure tarifaire</h3>
        <p className="mb-4">Les services sont proposés selon deux modèles :</p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Abonnement mensuel :</strong> Accès illimité aux fonctionnalités de base</li>
          <li><strong>Paiement à l'acte :</strong> Facturation par lead transmis selon un barème défini</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.2 Conditions de paiement</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Paiement par carte bancaire via Stripe</li>
          <li>Prélèvement automatique pour les abonnements</li>
          <li>Facturation mensuelle à terme échu</li>
          <li>TVA non applicable (régime micro-entrepreneur)</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.3 Évolution des tarifs</h3>
        <p>Les tarifs peuvent être modifiés avec un préavis de 30 jours par email. 
        En cas de refus, le professionnel peut résilier son abonnement.</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Obligations du professionnel
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">6.1 Informations et documents</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Maintenir à jour les informations de votre profil</li>
          <li>Fournir des justificatifs d'assurance responsabilité civile professionnelle valides</li>
          <li>Respecter les obligations légales de votre profession</li>
          <li>Signaler tout changement de situation (adresse, activité, etc.)</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">6.2 Qualité de service</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Répondre aux demandes de devis dans un délai maximum de 48h</li>
          <li>Fournir des devis détaillés et conformes à la réglementation</li>
          <li>Respecter les engagements pris envers les clients</li>
          <li>Maintenir un niveau de qualité satisfaisant (avis clients)</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">6.3 Utilisation de la plateforme</h3>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Ne pas contourner le système de mise en relation</li>
          <li>Ne pas utiliser les données clients à des fins autres que commerciales légitimes</li>
          <li>Respecter la confidentialité des informations transmises</li>
          <li>Ne pas créer de comptes multiples</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        7. Obligations de Portail Habitat
      </h2>
      <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-1">
        <li>Assurer le fonctionnement technique de la plateforme</li>
        <li>Transmettre les leads dans les délais convenus</li>
        <li>Vérifier la qualité des demandes transmises</li>
        <li>Fournir un support technique et commercial</li>
        <li>Protéger les données personnelles conformément au RGPD</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Résiliation
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">8.1 Résiliation par le professionnel</h3>
        <p className="mb-4">
          L'abonnement peut être résilié à tout moment depuis l'interface de gestion ou par email. 
          La résiliation prend effet à la fin de la période d'abonnement en cours, sans remboursement 
          des sommes déjà versées.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">8.2 Résiliation par Portail Habitat</h3>
        <p className="mb-4">
          Portail Habitat peut résilier l'accès à la plateforme en cas de :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Non-paiement des sommes dues</li>
          <li>Non-respect des obligations contractuelles</li>
          <li>Comportement préjudiciable à l'image de la plateforme</li>
          <li>Avis clients majoritairement négatifs</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Responsabilité et garanties
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">9.1 Limitation de responsabilité</h3>
        <p className="mb-4">
          Portail Habitat intervient uniquement comme intermédiaire de mise en relation. 
          La responsabilité de Portail Habitat ne saurait être engagée concernant :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>La qualité des prestations réalisées par les professionnels</li>
          <li>Les litiges entre professionnels et particuliers</li>
          <li>Les dommages résultant d'une utilisation inappropriée de la plateforme</li>
          <li>Les pertes d'exploitation ou manques à gagner</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">9.2 Assurances</h3>
        <p>
          Chaque professionnel doit maintenir une assurance responsabilité civile professionnelle 
          couvrant son activité et en fournir les justificatifs à Portail Habitat.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        10. Protection des données personnelles
      </h2>
      <p className="text-gray-700 mb-6">
        Portail Habitat s'engage à protéger les données personnelles conformément au RGPD. 
        Les données collectées sont utilisées uniquement dans le cadre de la mise en relation 
        et de la gestion des services. Pour plus d'informations, consultez notre 
        <a href="/politique-confidentialite" className="text-blue-600 hover:underline"> politique de confidentialité</a>.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        11. Propriété intellectuelle
      </h2>
      <p className="text-gray-700 mb-6">
        Tous les éléments de la plateforme Portail Habitat (design, textes, logos, etc.) 
        sont protégés par le droit d'auteur. Toute reproduction ou utilisation non autorisée 
        est interdite.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        12. Modifications des CGV
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes CGV peuvent être modifiées à tout moment. Les professionnels seront 
        informés par email des modifications avec un préavis de 15 jours. La poursuite 
        de l'utilisation de la plateforme vaut acceptation des nouvelles conditions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        13. Règlement des litiges
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          En cas de litige, les parties s'efforceront de trouver une solution amiable. 
          À défaut, le litige sera soumis aux tribunaux compétents de Bordeaux.
        </p>
        <p className="mb-4">
          Conformément à la réglementation, le professionnel peut recourir à la médiation 
          en contactant : casteranicolas.contact@gmail.com
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        14. Droit applicable
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes CGV sont soumises au droit français.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        15. Contact
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700 mb-2">
          <strong>Nicolas CASTERA</strong><br />
          Entrepreneur individuel<br />
          SIRET : 832 414 650 00024<br />
          22 RUE DE LIBOURNE, 33100 BORDEAUX
        </p>
        <p className="text-gray-700">
          Email : casteranicolas.contact@gmail.com<br />
          Site web : https://portail-habitat.fr
        </p>
      </div>
    </LegalPage>
  );
}
