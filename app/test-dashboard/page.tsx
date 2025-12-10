"use client";

import DashboardOverview from "@/components/admin/DashboardOverview";

export default function TestDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test Dashboard
        </h1>
        <p className="text-gray-600">
          Aperçu du tableau de bord administrateur
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
}
