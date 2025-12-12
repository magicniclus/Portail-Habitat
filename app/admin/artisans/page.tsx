import { Metadata } from "next";
import ArtisansManagement from "@/components/admin/ArtisansManagement";

export const metadata: Metadata = {
  title: "Gestion Artisans - Admin Portail Habitat",
  description: "Interface de gestion des artisans",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminArtisans() {
  return <ArtisansManagement />;
}
