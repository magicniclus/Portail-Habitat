"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  title: string;
  description: string;
  submitText: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
  colorScheme: "blue" | "green";
  isProfessional?: boolean;
}

export default function LoginForm({ 
  title, 
  description, 
  submitText, 
  linkText, 
  linkHref, 
  linkLabel,
  colorScheme,
  isProfessional = false
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Utilisateur connecté, rediriger vers le dashboard
        if (isProfessional) {
          router.push("/dashboard");
        } else {
          router.push("/dashboard"); // Même redirection pour les particuliers
        }
      } else {
        // Utilisateur non connecté, charger les identifiants sauvegardés
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router, isProfessional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Gérer "se souvenir de moi"
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      // Connexion réussie - redirection automatique

      // Redirection selon le type d'utilisateur
      if (isProfessional) {
        router.push("/dashboard");
      } else {
        router.push("/"); // ou une autre page pour les particuliers
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = "Email ou mot de passe incorrect.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Aucun compte trouvé avec cet email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Mot de passe incorrect.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Format d'email invalide.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Ce compte a été désactivé.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard.";
          break;
        default:
          errorMessage = `Erreur de connexion : ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = () => {
    if (linkText === "Rejoignez-nous") {
      router.push("/");
    } else {
      router.push(linkHref);
    }
  };
  const buttonClass = colorScheme === "blue" 
    ? "bg-blue-600 hover:bg-blue-700" 
    : "bg-green-600 hover:bg-green-700";
  
  const linkClass = colorScheme === "blue"
    ? "text-blue-600 hover:text-blue-500"
    : "text-green-600 hover:text-green-500";

  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mb-4" />
            <p className="text-gray-600">Vérification de votre connexion...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Se souvenir de moi
                </Label>
              </div>

              <Link href="/mot-de-passe-oublie" className={`text-sm ${linkClass}`}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${buttonClass}`}
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : submitText}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            {linkLabel}{" "}
            <button 
              type="button"
              onClick={handleLinkClick}
              className={`font-medium ${linkClass} hover:underline`}
            >
              {linkText}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
