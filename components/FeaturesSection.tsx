import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      title: "Leads qualifiés",
      description: "Recevez uniquement des demandes de clients sérieux dans votre zone d'intervention.",
      icon: "L",
      color: "bg-blue-500"
    },
    {
      title: "Tarifs transparents",
      description: "Pas de frais cachés. Vous payez uniquement pour les leads que vous recevez.",
      icon: "€",
      color: "bg-green-500"
    },
    {
      title: "Réactivité",
      description: "Recevez les demandes en temps réel et répondez rapidement à vos prospects.",
      icon: "⚡",
      color: "bg-yellow-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Pourquoi choisir Portail Habitat ?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className={`flex items-center justify-center h-12 w-12 rounded-md ${feature.color} text-white mx-auto mb-4`}>
                  <span className="font-bold">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-500">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
