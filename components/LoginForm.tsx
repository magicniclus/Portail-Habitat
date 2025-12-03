"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Charger les identifiants sauvegardés au montage du composant
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

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
      alert("Erreur de connexion : Email ou mot de passe incorrect.");
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
