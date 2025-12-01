import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="block">Prêt à développer votre activité ?</span>
              <span className="block text-blue-400 mt-2">Inscrivez-vous dès aujourd'hui.</span>
            </h2>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-50" asChild>
              <Link href="/connexion-pro">
                Commencer
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900" asChild>
              <Link href="/pricing">
                Voir les tarifs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
