import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation - Portail Habitat",
  description: "Consultez les conditions générales d'utilisation de Portail Habitat pour les particuliers recherchant des professionnels du bâtiment.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/conditions-utilisation",
  },
};

export default function ConditionsUtilisation() {
  return (
    <LegalPage 
      title="Conditions Générales d'Utilisation"
      subtitle="Dernière mise à jour : 9 décembre 2024"
    >
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
        <p className="text-green-800">
          <strong>Information :</strong> Ces conditions s'appliquent aux particuliers utilisant 
          la plateforme Portail Habitat pour rechercher des professionnels du bâtiment et demander des devis.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Définitions
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-2"><strong>Plateforme :</strong> Le site web Portail Habitat accessible à l'adresse https://portail-habitat.fr</p>
        <p className="mb-2"><strong>Utilisateur :</strong> Particulier utilisant la plateforme pour rechercher des professionnels</p>
        <p className="mb-2"><strong>Professionnel :</strong> Artisan ou entreprise du bâtiment inscrit sur la plateforme</p>
        <p className="mb-2"><strong>Devis :</strong> Estimation gratuite fournie par un professionnel</p>
        <p className="mb-2"><strong>Services :</strong> L'ensemble des fonctionnalités proposées par la plateforme</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Objet et acceptation
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes Conditions Générales d'Utilisation (CGU) définissent les modalités d'utilisation 
        de la plateforme Portail Habitat par les particuliers. L'utilisation de la plateforme implique 
        l'acceptation pleine et entière de ces conditions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        3. Présentation des services
      </h2>
      <p className="text-gray-700 mb-4">
        Portail Habitat propose aux particuliers :
      </p>
      <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
        <li><strong>Recherche de professionnels :</strong> Annuaire d'artisans et entreprises du bâtiment qualifiés</li>
        <li><strong>Demandes de devis :</strong> Formulaire pour obtenir des estimations gratuites</li>
        <li><strong>Simulateur de prix :</strong> Estimation indicative des coûts de travaux</li>
        <li><strong>Avis et évaluations :</strong> Consultation des retours d'expérience d'autres clients</li>
        <li><strong>Conseils et guides :</strong> Informations pratiques sur les travaux de rénovation</li>
        <li><strong>Mise en relation :</strong> Service gratuit de connexion avec des professionnels adaptés</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Accès et utilisation de la plateforme
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">4.1 Accès libre</h3>
        <p className="mb-4">
          L'accès à la plateforme est libre et gratuit pour tous les particuliers. 
          Aucune inscription n'est obligatoire pour consulter les informations publiques.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">4.2 Demandes de devis</h3>
        <p className="mb-4">
          Pour effectuer une demande de devis, l'utilisateur doit fournir :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Des informations exactes sur son projet</li>
          <li>Ses coordonnées de contact (nom, email, téléphone)</li>
          <li>L'adresse du lieu des travaux</li>
          <li>Une description détaillée de ses besoins</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">4.3 Utilisation responsable</h3>
        <p>
          L'utilisateur s'engage à utiliser la plateforme de manière responsable et à ne pas :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Fournir de fausses informations</li>
          <li>Utiliser la plateforme à des fins commerciales</li>
          <li>Perturber le fonctionnement du service</li>
          <li>Violer les droits de propriété intellectuelle</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Processus de mise en relation
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">5.1 Transmission des demandes</h3>
        <p className="mb-4">
          Lorsqu'un utilisateur effectue une demande de devis, Portail Habitat :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Analyse la demande et sélectionne des professionnels adaptés</li>
          <li>Transmet les coordonnées de l'utilisateur aux professionnels sélectionnés</li>
          <li>Facilite la prise de contact entre les parties</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.2 Engagement des professionnels</h3>
        <p className="mb-4">
          Les professionnels s'engagent à :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Contacter l'utilisateur dans les 48 heures</li>
          <li>Fournir un devis gratuit et sans engagement</li>
          <li>Respecter les normes professionnelles de leur métier</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">5.3 Liberté de choix</h3>
        <p>
          L'utilisateur reste libre de choisir le professionnel qui lui convient et 
          n'est en aucun cas obligé d'accepter l'un des devis reçus.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Gratuité du service
      </h2>
      <p className="text-gray-700 mb-6">
        L'utilisation de la plateforme Portail Habitat est entièrement gratuite pour les particuliers. 
        Les devis fournis par les professionnels sont également gratuits et sans engagement. 
        Aucun frais ne sera jamais facturé aux utilisateurs pour l'utilisation du service de mise en relation.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        7. Qualité et sélection des professionnels
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Portail Habitat s'efforce de référencer uniquement des professionnels qualifiés :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Vérification des informations légales (SIRET, assurances)</li>
          <li>Contrôle des qualifications professionnelles</li>
          <li>Suivi de la satisfaction client via les avis</li>
          <li>Exclusion des professionnels ne respectant pas les standards de qualité</li>
        </ul>
        <p>
          Cependant, Portail Habitat ne peut garantir la qualité des prestations réalisées 
          et encourage les utilisateurs à vérifier les références des professionnels.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Avis et évaluations
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">8.1 Publication d'avis</h3>
        <p className="mb-4">
          Les utilisateurs peuvent publier des avis sur les professionnels après réalisation de travaux. 
          Ces avis doivent être :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Basés sur une expérience réelle</li>
          <li>Objectifs et constructifs</li>
          <li>Respectueux et non diffamatoires</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">8.2 Modération</h3>
        <p>
          Portail Habitat se réserve le droit de modérer les avis et de supprimer 
          ceux qui ne respectent pas ces critères.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Protection des données personnelles
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          Portail Habitat s'engage à protéger les données personnelles des utilisateurs 
          conformément au RGPD. Les données collectées sont utilisées uniquement pour :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>La mise en relation avec des professionnels</li>
          <li>L'amélioration des services</li>
          <li>La communication d'informations pertinentes (avec consentement)</li>
        </ul>
        <p>
          Pour plus d'informations, consultez notre 
          <a href="/politique-de-confidentialite" className="text-blue-600 hover:underline"> politique de confidentialité</a>.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        10. Responsabilité et limitations
      </h2>
      <div className="text-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-3">10.1 Rôle d'intermédiaire</h3>
        <p className="mb-4">
          Portail Habitat agit uniquement comme intermédiaire de mise en relation. 
          La plateforme ne réalise aucun travaux et n'intervient pas dans la relation 
          contractuelle entre l'utilisateur et le professionnel.
        </p>
        
        <h3 className="text-lg font-semibold mb-3">10.2 Limitation de responsabilité</h3>
        <p className="mb-4">
          Portail Habitat ne saurait être tenu responsable :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>De la qualité des prestations réalisées par les professionnels</li>
          <li>Des litiges entre utilisateurs et professionnels</li>
          <li>Des dommages résultant des travaux effectués</li>
          <li>Du non-respect des délais ou engagements pris par les professionnels</li>
        </ul>
        
        <h3 className="text-lg font-semibold mb-3">10.3 Recommandations</h3>
        <p>
          Il est recommandé aux utilisateurs de :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-1">
          <li>Vérifier les assurances et qualifications des professionnels</li>
          <li>Demander plusieurs devis pour comparer</li>
          <li>Établir un contrat écrit avant le début des travaux</li>
          <li>Vérifier les références et avis clients</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        11. Propriété intellectuelle
      </h2>
      <p className="text-gray-700 mb-6">
        Tous les éléments de la plateforme (textes, images, logos, design, etc.) sont protégés 
        par le droit d'auteur et appartiennent à Nicolas CASTERA. Toute reproduction, 
        même partielle, est interdite sans autorisation préalable.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        12. Disponibilité du service
      </h2>
      <p className="text-gray-700 mb-6">
        Portail Habitat s'efforce d'assurer la disponibilité de la plateforme 24h/24 et 7j/7. 
        Cependant, des interruptions peuvent survenir pour maintenance ou en cas de force majeure. 
        Les utilisateurs seront informés des maintenances programmées dans la mesure du possible.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        13. Modifications des CGU
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront 
        informés des modifications importantes par un avis sur la plateforme. 
        La poursuite de l'utilisation vaut acceptation des nouvelles conditions.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        14. Règlement des litiges
      </h2>
      <div className="text-gray-700 mb-6">
        <p className="mb-4">
          En cas de litige lié à l'utilisation de la plateforme, les parties s'efforceront 
          de trouver une solution amiable en contactant : casteranicolas.contact@gmail.com
        </p>
        <p className="mb-4">
          À défaut d'accord amiable, les tribunaux compétents de Bordeaux seront seuls compétents.
        </p>
        <p>
          Conformément à la réglementation sur la médiation de la consommation, 
          l'utilisateur peut recourir à un médiateur de la consommation.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        15. Droit applicable
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes CGU sont soumises au droit français.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        16. Contact et support
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <p className="text-gray-700 mb-4">
          Pour toute question concernant l'utilisation de la plateforme ou ces conditions d'utilisation :
        </p>
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
