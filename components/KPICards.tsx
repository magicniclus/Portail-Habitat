import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

function KPICard({ title, value, icon, color }: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function KPICards() {
  const kpis = [
    { title: "Leads reçus", value: "24", icon: "L", color: "bg-blue-500" },
    { title: "Devis envoyés", value: "18", icon: "D", color: "bg-green-500" },
    { title: "Chantiers en cours", value: "7", icon: "C", color: "bg-yellow-500" },
    { title: "CA ce mois", value: "45 280€", icon: "€", color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}
