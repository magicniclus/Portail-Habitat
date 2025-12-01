import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
  buttonVariant?: "default" | "outline";
}

export default function PricingCard({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  buttonHref,
  isPopular = false,
  buttonVariant = "default"
}: PricingCardProps) {
  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-blue-600 text-white">
            Populaire
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          <span className="text-base font-medium text-gray-500">{period}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <Button 
          className={`w-full mb-6 ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          variant={buttonVariant}
          asChild
        >
          <Link href={buttonHref}>
            {buttonText}
          </Link>
        </Button>
        
        <div>
          <h4 className="text-xs font-medium text-gray-900 tracking-wide uppercase mb-4">
            Inclus
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-3">✓</span>
                <span className="text-sm text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
