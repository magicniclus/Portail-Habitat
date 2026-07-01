"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import AuthGuard from "@/components/AuthGuard";
import PremiumTrialModal from "@/components/PremiumTrialModal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  Settings,
  User,
  LogOut,
  ChevronUp,
  Mail,
  HelpCircle,
  IdCard,
  Star,
  ShoppingCart,
  BarChart3,
  Crown,
  Lock,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hasMarketplaceLeads, setHasMarketplaceLeads] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { artisan, isLoading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Afficher le modal Premium une fois par session dès l'ouverture du dashboard
  useEffect(() => {
    if (isLoading || !artisan) return;
    const isPremium = artisan.premiumFeatures?.isPremium === true;
    if (isPremium) return;
    const sessionKey = `premium_modal_shown_${artisan.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      const t = setTimeout(() => setShowPremiumModal(true), 1000);
      return () => clearTimeout(t);
    }
  }, [isLoading, artisan]);


  // Vérifier si des appels d'offres correspondent au métier + zone de l'artisan
  useEffect(() => {
    if (!artisan?.profession || !artisan?.postalCode) return;

    const checkMarketplaceLeads = async () => {
      try {
        const department = artisan.postalCode?.substring(0, 2) || "";
        const estimationsRef = collection(db, "estimations");
        const q = query(
          estimationsRef,
          where("isPublished", "==", true),
          where("marketplaceStatus", "==", "active"),
          limit(1)
        );
        const snap = await getDocs(q);
        setHasMarketplaceLeads(!snap.empty);
      } catch {
        setHasMarketplaceLeads(false);
      }
    };

    checkMarketplaceLeads();
  }, [artisan]);

  const isPremium = artisan?.premiumFeatures?.isPremium === true;
  const ficheComplete = artisan?.ficheComplete === true;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/connexion-pro");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Items de base toujours visibles une fois la fiche complète
  const baseItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
  ];

  // Items verrouillés tant que ficheComplete = false
  const managementItems = [
    ...(hasMarketplaceLeads
      ? [{ title: "Appels d'offres", url: "/dashboard/marketplace", icon: ShoppingCart, isSpecial: true }]
      : []),
    { title: "Ma fiche", url: "/dashboard/fiche", icon: IdCard },
    { title: "Mes demandes", url: "/dashboard/demandes", icon: Mail },
    { title: "Avis", url: "/dashboard/avis", icon: Star },
    { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
    { title: "Contact & support", url: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Portail Habitat"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Vue d'ensemble */}
              <SidebarGroup>
                <SidebarGroupLabel>Vue d'ensemble</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {baseItems.map((item) => {
                      const isActive =
                        pathname === item.url ||
                        (item.url !== "/dashboard" &&
                          pathname.startsWith(item.url));
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={isActive}>
                            <Link href={item.url}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}

                    {/* Bouton Premium permanent pour les non-premium */}
                    {!isPremium && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 font-medium"
                        >
                          <Link href="/dashboard/premium">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            <span>Passer Premium</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Gestion — toujours accessible */}
              <SidebarGroup>
                <SidebarGroupLabel>Gestion</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {managementItems.map((item) => {
                      const isActive =
                        pathname === item.url ||
                        (item.url !== "/dashboard" &&
                          pathname.startsWith(item.url));
                      const specialClasses = item.isSpecial
                        ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-700"
                        : "";
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={specialClasses}
                          >
                            <Link href={item.url}>
                              <item.icon
                                className={`h-4 w-4 ${item.isSpecial ? "text-orange-600" : ""}`}
                              />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  {isMounted && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                          <User className="h-4 w-4" />
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {artisan
                                ? `${artisan.firstName} ${artisan.lastName}`
                                : "Professionnel"}
                            </span>
                            <span className="truncate text-xs">
                              {artisan?.email || "pro@portail-habitat.fr"}
                            </span>
                          </div>
                          <ChevronUp className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/parametres">
                            <Settings className="h-4 w-4 mr-2" />
                            Paramètres
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/profil">
                            <User className="h-4 w-4 mr-2" />
                            Profil
                          </Link>
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold">Dashboard Pro</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>

      {showPremiumModal && artisan && (
        <PremiumTrialModal
          artisanId={artisan.id}
          onClose={() => setShowPremiumModal(false)}
        />
      )}
    </AuthGuard>
  );
}
