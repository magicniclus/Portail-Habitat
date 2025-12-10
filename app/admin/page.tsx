import { Metadata } from "next";
import OverviewDashboard from "@/components/admin/OverviewDashboard";

export const metadata: Metadata = {
  title: "Administration - Portail Habitat",
  description: "Interface d'administration de Portail Habitat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboard() {
  return <OverviewDashboard />;
}
