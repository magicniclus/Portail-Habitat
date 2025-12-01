import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroLanding() {
  return (
    <section className="relative bg-blue-600 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Rejoignez Portail Habitat
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Développez votre activité en recevant des leads qualifiés de particuliers 
            à la recherche de professionnels du bâtiment dans votre région.
          </p>
          <div className="mt-10">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50" asChild>
              <Link href="/connexion-pro">
                Commencer maintenant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
