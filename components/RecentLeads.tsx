import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Lead {
  title: string;
  location: string;
  time: string;
  color: string;
}

export default function RecentLeads() {
  const leads: Lead[] = [
    { title: "Rénovation salle de bain", location: "Paris 15ème", time: "Il y a 2h", color: "border-blue-500" },
    { title: "Installation cuisine", location: "Boulogne", time: "Il y a 4h", color: "border-green-500" },
    { title: "Peinture appartement", location: "Neuilly", time: "Il y a 1j", color: "border-yellow-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.map((lead, index) => (
            <div key={index} className={`border-l-4 ${lead.color} pl-4`}>
              <p className="font-medium">{lead.title}</p>
              <p className="text-sm text-gray-600">{lead.location} • {lead.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
