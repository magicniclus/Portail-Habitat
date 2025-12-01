import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Bonjour, Professionnel</span>
            <Button variant="destructive">
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
