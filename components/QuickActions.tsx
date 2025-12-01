import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickActions() {
  const actions = [
    { label: "Voir tous les leads", href: "/dashboard/leads", variant: "default" as const, className: "bg-blue-600 hover:bg-blue-700" },
    { label: "Gérer mes devis", href: "/dashboard/devis", variant: "default" as const, className: "bg-green-600 hover:bg-green-700" },
    { label: "Mes chantiers", href: "/dashboard/chantiers", variant: "default" as const, className: "bg-yellow-600 hover:bg-yellow-700" },
    { label: "Mon profil", href: "/dashboard/profil", variant: "outline" as const, className: "" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`w-full ${action.className}`}
              asChild
            >
              <Link href={action.href}>
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
