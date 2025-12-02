import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus, Search, PhoneCall } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Vous créez votre page artisan",
      description: "En seulement 2 minutes",
      color: "#16a34a"
    },
    {
      icon: Search,
      title: "Les particuliers vous trouvent",
      description: "Sur Google et sur notre annuaire",
      color: "#16a34a"
    },
    {
      icon: PhoneCall,
      title: "Vous recevez les demandes",
      description: "Directement sur votre téléphone",
      color: "#16a34a"
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">
            En 3 étapes simples
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
