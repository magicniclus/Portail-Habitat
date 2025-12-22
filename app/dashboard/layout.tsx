import DashboardLayout from "@/components/DashboardLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord - Portail Habitat",
  description: "Gérez votre activité d'artisan : demandes de devis, leads, avis clients et statistiques",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
