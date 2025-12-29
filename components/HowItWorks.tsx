import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus, Search, PhoneCall } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Vous créez votre fiche artisan",
      description: "En 2 minutes, vous indiquez votre métier et votre zone d'intervention.",
      color: "#ea580c"
    },
    {
      icon: Search,
      title: "Les particuliers vous trouvent",
      description: "Ils consultent votre profil et vous contactent directement depuis le portail.",
      color: "#ea580c"
    },
    {
      icon: PhoneCall,
      title: "Vous recevez des demandes",
      description: "Par téléphone ou par message, sans intermédiaire.",
      color: "#ea580c"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recevez des demandes de chantiers dans votre zone
          </h2>
          <p className="text-xl text-gray-600">
            Des particuliers vous contactent directement. Vous êtes libre de répondre ou non.
          </p>
        </div>

        {/* Grille des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <IconComponent 
                      size={48} 
                      style={{ color: step.color }}
                      className="drop-shadow-sm"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-gray-600 text-lg">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
