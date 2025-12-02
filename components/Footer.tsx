import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/logo.png"
              alt="Portail Habitat"
              width={200}
              height={80}
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400">
              La plateforme de référence pour vos projets habitat
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Particuliers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/connexion" className="hover:text-white">Connexion</Link></li>
              <li><Link href="#" className="hover:text-white">Créer un compte</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Professionnels</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/connexion-pro" className="hover:text-white">Connexion Pro</Link></li>
              <li><Link href="/devenir-pro" className="hover:text-white">Devenir Pro</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Tarifs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/cgv" className="hover:text-white">CGV</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Portail Habitat. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
