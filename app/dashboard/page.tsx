import { Metadata } from "next";
import DashboardKPICards from "@/components/DashboardKPICards";
import DashboardRecentLeads from "@/components/DashboardRecentLeads";
import DashboardQuickActions from "@/components/DashboardQuickActions";

export const metadata: Metadata = {
  title: "Dashboard Pro - Portail Habitat",
  description: "Gérez vos leads, devis et chantiers depuis votre espace professionnel Portail Habitat.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <DashboardKPICards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRecentLeads />
        </div>
        <div>
          <DashboardQuickActions />
        </div>
      </div>
    </div>
  );
}
