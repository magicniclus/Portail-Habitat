import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Connexion Professionnels - Portail Habitat",
  description: "Connectez-vous à votre espace professionnel Portail Habitat pour gérer vos leads, devis et chantiers.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/connexion-pro",
  },
};

export default function ConnexionPro() {
  return (
    <LoginForm
      title="Connexion Professionnels"
      description="Accédez à votre espace professionnel"
      submitText="Se connecter"
      linkText="Rejoignez-nous"
      linkHref="/devenir-pro"
      linkLabel="Pas encore professionnel ?"
      colorScheme="green"
      isProfessional={true}
    />
  );
}
