import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface LegalPageProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function LegalPage({ title, subtitle, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="mt-4 text-gray-600">
              {subtitle}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
