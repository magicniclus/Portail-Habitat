import { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Mentions Légales - Portail Habitat",
  description: "Consultez les mentions légales de Portail Habitat : informations sur l'éditeur, hébergement, données personnelles et conditions d'utilisation.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/mentions-legales",
  },
};

export default function MentionsLegales() {
  return (
    <LegalPage 
      title="Mentions Légales"
      subtitle="Informations légales concernant le site Portail Habitat"
    >
      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        1. Éditeur du site
      </h2>
      <p className="text-gray-700 mb-6">
        <strong>MONSIEUR NICOLAS CASTERA</strong><br />
        Entrepreneur individuel<br />
        SIRET : 832 414 650 00024<br />
        Activité : Édition de logiciels applicatifs - 5829C<br />
        Adresse : 22 RUE DE LIBOURNE, 33100 BORDEAUX<br />
        Date de création : 03 octobre 2017<br />
        Forme juridique : Entrepreneur individuel<br />
        Inscrit au RNE
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        2. Directeur de la publication
      </h2>
      <p className="text-gray-700 mb-6">
        <strong>Nicolas CASTERA</strong><br />
        Entrepreneur individuel<br />
        Email : casteranicolas.contact@gmail.com
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        3. Hébergement
      </h2>
      <p className="text-gray-700 mb-6">
        Le site est hébergé par :<br />
        <strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133<br />
        Walnut, CA 91789<br />
        États-Unis
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        4. Contact
      </h2>
      <p className="text-gray-700 mb-6">
        Email : casteranicolas.contact@gmail.com<br />
        Site web : https://portail-habitat.fr<br />
        Adresse postale : 22 RUE DE LIBOURNE, 33100 BORDEAUX
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        5. Propriété intellectuelle
      </h2>
      <p className="text-gray-700 mb-6">
        L'ensemble du contenu du site Portail Habitat (textes, images, vidéos, etc.) est protégé 
        par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation 
        préalable écrite de Portail Habitat.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        6. Données personnelles
      </h2>
      <p className="text-gray-700 mb-6">
        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
        Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de 
        suppression et d'opposition concernant vos données personnelles.
      </p>
      <p className="text-gray-700 mb-6">
        Pour exercer ces droits, contactez-nous à : casteranicolas.contact@gmail.com
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        7. Cookies
      </h2>
      <p className="text-gray-700 mb-6">
        Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des 
        statistiques de visite. Vous pouvez paramétrer l'utilisation des cookies dans votre 
        navigateur.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        8. Responsabilité
      </h2>
      <p className="text-gray-700 mb-6">
        Portail Habitat s'efforce d'assurer l'exactitude des informations diffusées sur le site, 
        mais ne peut garantir l'absence d'erreurs. L'utilisation du site se fait sous la 
        responsabilité exclusive de l'utilisateur.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        9. Droit applicable
      </h2>
      <p className="text-gray-700 mb-6">
        Les présentes mentions légales sont soumises au droit français. En cas de litige, 
        les tribunaux français seront seuls compétents.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        10. Médiation
      </h2>
      <p className="text-gray-700 mb-6">
        En cas de litige, vous pouvez recourir à la médiation en contactant :<br />
        <strong>Médiateur de la consommation</strong><br />
        Email : casteranicolas.contact@gmail.com
      </p>
    </LegalPage>
  );
}
