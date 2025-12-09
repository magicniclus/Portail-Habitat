"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
import {
  Home,
  Users,
  FileText,
  Calendar,
  Settings,
  User,
  LogOut,
  ChevronUp,
  MessageSquare,
  Mail,
  Globe,
  HelpCircle,
  IdCard,
  Star,
} from "lucide-react";

const navigation = [
  {
    title: "Vue d'ensemble",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        title: "Mes demandes",
        url: "/dashboard/demandes",
        icon: Mail,
      },
      {
        title: "Ma fiche",
        url: "/dashboard/fiche",
        icon: IdCard,
      },
      {
        title: "Mon site",
        url: "/dashboard/site",
        icon: Globe,
      },
      {
        title: "Avis",
        url: "/dashboard/avis",
        icon: Star,
      },
      {
        title: "Contact & support",
        url: "/dashboard/support",
        icon: HelpCircle,
      },
    ],
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Gérer l'hydratation
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/connexion-pro');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
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
            {navigation.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
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
                        <span className="truncate font-semibold">Professionnel</span>
                        <span className="truncate text-xs">pro@portail-habitat.fr</span>
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
                    <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
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
          {/* Header avec trigger pour ouvrir/fermer la sidebar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold">Dashboard Pro</h1>
            </div>
          </header>

          {/* Contenu principal */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
