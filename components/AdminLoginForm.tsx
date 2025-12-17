"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Connexion Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Vérifier que l'utilisateur est admin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error("Utilisateur non trouvé dans la base de données");
      }

      const userData = userDoc.data();
      
      if (userData.role !== 'admin') {
        // Déconnecter si pas admin
        await auth.signOut();
        throw new Error("Accès non autorisé - Vous n'êtes pas administrateur");
      }

      // 3. Rediriger vers l'admin
      console.log(`Admin connecté: ${userData.adminRole} (${user.email})`);
      router.push('/admin');

    } catch (error: any) {
      console.error("Erreur de connexion admin:", error);
      
      // Messages d'erreur personnalisés
      let errorMessage = "Erreur de connexion";
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Email ou mot de passe incorrect";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Trop de tentatives. Réessayez plus tard";
          break;
        case 'auth/user-disabled':
          errorMessage = "Compte désactivé";
          break;
        default:
          errorMessage = error.message || "Erreur de connexion";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email administrateur
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            placeholder="admin@portail-habitat.fr"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </Label>
        <div className="mt-1 relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
            placeholder="Mot de passe"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Se connecter
            </>
          )}
        </Button>
      </div>

      {/* Mot de passe oublié - affiché sous le bouton sur mobile */}
      <div className="text-center sm:hidden">
        <a href="/mot-de-passe-oublie" className="text-sm text-orange-600 hover:text-orange-500">
          Mot de passe oublié ?
        </a>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Accès réservé aux administrateurs autorisés
        </p>
      </div>
    </form>
  );
}
