import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma fiche - Dashboard Pro - Portail Habitat",
  description: "Gérez votre fiche artisan et vos informations professionnelles.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FicheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
