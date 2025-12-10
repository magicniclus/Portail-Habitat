"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Settings,
  BarChart3,
  Menu,
  X,
  UserCheck,
  ShoppingCart
} from "lucide-react";

const navigationItems = [
  {
    title: "Vue d'ensemble",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Tableau de bord principal"
  },
  {
    title: "Statistiques",
    href: "/admin/stats",
    icon: BarChart3,
    description: "Métriques détaillées"
  },
  {
    title: "Artisans",
    href: "/admin/artisans",
    icon: UserCheck,
    description: "Gestion des artisans"
  },
  {
    title: "Projets",
    href: "/admin/projets",
    icon: Briefcase,
    description: "Gestion des projets"
  },
  {
    title: "Demandes",
    href: "/admin/demandes",
    icon: FileText,
    description: "Demandes de devis"
  },
  {
    title: "Marketplace",
    href: "/admin/marketplace",
    icon: ShoppingCart,
    description: "Bourse au travail"
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    description: "Gestion des utilisateurs"
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    description: "Configuration"
  }
];

interface AdminNavigationProps {
  className?: string;
}

export default function AdminNavigation({ className }: AdminNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Navigation desktop */}
      <nav className={cn("hidden lg:block", className)}>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div>{item.title}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Navigation mobile */}
      <div className="lg:hidden">
        {/* Bouton menu mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>

        {/* Menu mobile overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Menu mobile */}
        <nav className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-6">
            <div className="mb-8 mt-12">
              <h2 className="text-xl font-bold text-gray-900">Administration</h2>
              <p className="text-sm text-gray-500">Portail Habitat</p>
            </div>
            
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
