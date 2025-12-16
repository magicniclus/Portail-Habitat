'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Crown } from "lucide-react";
import Link from "next/link";

interface PremiumVideoCardProps {
  className?: string;
}

export default function PremiumVideoCard({ className = "" }: PremiumVideoCardProps) {
  return (
    <Card className={`overflow-hidden border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
      <CardContent className="p-4">
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium shadow-lg border-0 h-12"
        >
          <Link href="/dashboard/premium" className="flex items-center justify-center gap-2">
            <Video className="h-5 w-5" />
            <span>Ajouter une vidéo à mon profil</span>
            <Crown className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
