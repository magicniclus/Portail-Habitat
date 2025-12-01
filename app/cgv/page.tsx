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
      subtitle="Dernière mise à jour : 1er décembre 2024"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Objet
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
        entre Portail Habitat et ses clients professionnels dans le cadre de l'utilisation de 
        la plateforme de mise en relation avec des particuliers.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Services proposés
      </h2>
      <p className="text-gray-700 mb-6">
        Portail Habitat propose aux professionnels du bâtiment :
      </p>
      <ul className="list-disc pl-6 mb-6 text-gray-700">
        <li>La mise en relation avec des particuliers recherchant des services</li>
        <li>La transmission de leads qualifiés</li>
        <li>Un espace de gestion des demandes et devis</li>
        <li>Des outils de communication avec les prospects</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        3. Tarification
      </h2>
      <p className="text-gray-700 mb-6">
        Les tarifs sont indiqués en euros TTC et sont disponibles sur la page pricing. 
        Les prix peuvent être modifiés à tout moment, avec un préavis de 30 jours.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Modalités de paiement
      </h2>
      <p className="text-gray-700 mb-6">
        Le paiement s'effectue par carte bancaire ou virement. L'abonnement est renouvelé 
        automatiquement chaque mois sauf résiliation.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Obligations du professionnel
      </h2>
      <ul className="list-disc pl-6 mb-6 text-gray-700">
        <li>Fournir des informations exactes et à jour</li>
        <li>Répondre aux demandes dans les délais convenus</li>
        <li>Respecter la réglementation en vigueur</li>
        <li>Maintenir ses assurances professionnelles</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Résiliation
      </h2>
      <p className="text-gray-700 mb-6">
        L'abonnement peut être résilié à tout moment avec un préavis de 30 jours. 
        La résiliation prend effet à la fin de la période d'abonnement en cours.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        7. Responsabilité
      </h2>
      <p className="text-gray-700 mb-6">
        Portail Habitat ne saurait être tenu responsable de la qualité des prestations 
        réalisées par les professionnels ou des litiges entre professionnels et particuliers.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Droit applicable
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes CGV sont soumises au droit français. Tout litige sera porté devant 
        les tribunaux compétents de Paris.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Contact
      </h2>
      <p className="text-gray-700 mb-6">
        Pour toute question concernant ces conditions générales de vente, vous pouvez nous 
        contacter à l'adresse : contact@portail-habitat.fr
      </p>
    </LegalPage>
  );
}
