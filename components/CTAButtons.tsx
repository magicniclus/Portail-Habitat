import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTAButtons() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/connexion">
              Connexion Particulier
            </Link>
          </Button>
          
          <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/connexion-pro">
              Connexion Pro
            </Link>
          </Button>
          
          <Button size="lg" variant="outline" asChild>
            <Link href="/devenir-pro">
              Devenir Pro
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
