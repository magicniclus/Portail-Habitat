import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative">
            <Image
              src="/logo.png"
              alt="Portail Habitat"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/devenir-pro" className="text-gray-600 hover:text-gray-900">
              Devenir Pro
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/connexion">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/connexion-pro">Espace Pro</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
