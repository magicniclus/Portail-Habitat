import { Metadata } from "next";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "Connexion Administrateur - Portail Habitat",
  description: "Interface de connexion pour les administrateurs de Portail Habitat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PH</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">Admin</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Connexion Administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accès réservé aux administrateurs de Portail Habitat
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
