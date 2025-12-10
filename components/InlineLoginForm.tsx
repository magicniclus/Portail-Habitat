"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus,
  AlertCircle,
  Loader2
} from "lucide-react";

interface InlineLoginFormProps {
  title?: string;
  description?: string;
  redirectAfterLogin?: string;
  showSignupOption?: boolean;
}

export default function InlineLoginForm({ 
  title = "Connexion requise",
  description = "Connectez-vous à votre espace artisan pour continuer",
  redirectAfterLogin = "/dashboard",
  showSignupOption = true
}: InlineLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection automatique après connexion réussie
      router.push(redirectAfterLogin);
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
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <LogIn className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        {/* Option d'inscription */}
        {showSignupOption && (
          <>
            <Separator />
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Vous n'avez pas encore de compte ?
              </p>
              <Button 
                onClick={() => router.push('/devenir-pro')} 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                S'inscrire comme artisan
              </Button>
            </div>
          </>
        )}

        {/* Lien vers la page de connexion complète */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/connexion')} 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            Aller à la page de connexion complète
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
