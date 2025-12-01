import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion Particuliers - Portail Habitat",
  description: "Connectez-vous à votre espace personnel Portail Habitat pour gérer vos projets et contacter des professionnels du bâtiment.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/connexion",
  },
};

export default function Connexion() {
  return (
    <LoginForm
      title="Connexion Particuliers"
      description="Accédez à votre espace personnel"
      submitText="Se connecter"
      linkText="Créer un compte"
      linkHref="#"
      linkLabel="Pas encore de compte ?"
      colorScheme="blue"
    />
  );
}
