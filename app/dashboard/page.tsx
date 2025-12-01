import { Metadata } from "next";
import HeaderPro from "@/components/HeaderPro";
import KPICards from "@/components/KPICards";
import RecentLeads from "@/components/RecentLeads";
import QuickActions from "@/components/QuickActions";

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
    <div className="min-h-screen bg-gray-50">
      <HeaderPro isDashboard={true} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <KPICards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentLeads />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
