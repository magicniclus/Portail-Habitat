import AdminLayout from "@/components/AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration - Portail Habitat",
  description: "Interface d'administration de Portail Habitat",
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
  return <AdminLayout>{children}</AdminLayout>;
}
