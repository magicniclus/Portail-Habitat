import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portail Habitat - Trouvez votre artisan professionnel",
    template: "%s | Portail Habitat",
  },
  description: "Trouvez les meilleurs artisans près de chez vous. Devis gratuits, avis vérifiés et accompagnement personnalisé pour tous vos travaux de rénovation.",
  keywords: ["artisan", "rénovation", "devis gratuit", "travaux", "professionnel", "habitat"],
  authors: [{ name: "Portail Habitat" }],
  creator: "Portail Habitat",
  publisher: "Portail Habitat",
  metadataBase: new URL("https://portail-habitat.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://portail-habitat.fr",
    siteName: "Portail Habitat",
    title: "Portail Habitat - Trouvez votre artisan professionnel",
    description: "Trouvez les meilleurs artisans près de chez vous. Devis gratuits, avis vérifiés.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Portail Habitat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portail Habitat - Trouvez votre artisan professionnel",
    description: "Trouvez les meilleurs artisans près de chez vous. Devis gratuits, avis vérifiés.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
