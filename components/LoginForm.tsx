import Link from "next/link";
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
}

export default function LoginForm({ 
  title, 
  description, 
  submitText, 
  linkText, 
  linkHref, 
  linkLabel,
  colorScheme 
}: LoginFormProps) {
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">
                  Se souvenir de moi
                </Label>
              </div>

              <Link href="#" className={`text-sm ${linkClass}`}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className={`w-full ${buttonClass}`}>
              {submitText}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            {linkLabel}{" "}
            <Link href={linkHref} className={`font-medium ${linkClass}`}>
              {linkText}
            </Link>
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
