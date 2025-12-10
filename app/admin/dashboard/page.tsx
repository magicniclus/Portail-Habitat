import { Metadata } from "next";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata: Metadata = {
  title: "Tableau de bord - Administration | Portail Habitat",
  description: "Vue d'ensemble des statistiques et données de la plateforme Portail Habitat",
  robots: "noindex, nofollow",
};

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble des performances et activités de la plateforme
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}
