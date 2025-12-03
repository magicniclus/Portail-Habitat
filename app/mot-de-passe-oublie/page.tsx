import { Metadata } from "next";
import ForgotPasswordForm from "../../components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié - Portail Habitat",
  description: "Réinitialisez votre mot de passe Portail Habitat en renseignant votre adresse email.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://portail-habitat.fr/mot-de-passe-oublie",
  },
};

export default function MotDePasseOublie() {
  return <ForgotPasswordForm />;
}
