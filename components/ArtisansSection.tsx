"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Mail, ExternalLink } from "lucide-react";
import { collection, query, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface Artisan {
  id: string;
  companyName: string;
  slug: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  profession: string;
  professions: string[];
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  averageRating: number;
  reviewCount: number;
  certifications: string[];
  privacy: {
    profileVisible: boolean;
    showPhone: boolean;
    showEmail: boolean;
    allowDirectContact: boolean;
  };
}

export default function ArtisansSection() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const artisansRef = collection(db, 'artisans');
        const q = query(
          artisansRef,
          where('privacy.profileVisible', '==', true),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const artisansData: Artisan[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          artisansData.push({
            id: doc.id,
            companyName: data.companyName || '',
            slug: data.slug || '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            email: data.email || '',
            city: data.city || '',
            profession: data.profession || '',
            professions: data.professions || [],
            description: data.description || '',
            logoUrl: data.logoUrl,
            coverUrl: data.coverUrl,
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0,
            certifications: data.certifications || [],
            privacy: {
              profileVisible: data.privacy?.profileVisible ?? true,
              showPhone: data.privacy?.showPhone ?? true,
              showEmail: data.privacy?.showEmail ?? false,
              allowDirectContact: data.privacy?.allowDirectContact ?? true,
            }
          });
        });
        
        setArtisans(artisansData);
      } catch (error) {
        console.error('Erreur lors du chargement des artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
              Nos artisans
            </h2>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (artisans.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
              Nos artisans
            </h2>
          </div>
          <p className="text-gray-600">Aucun artisan disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Titre aligné à gauche */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-left">
            Nos artisans
          </h2>
        </div>

        {/* Liste des artisans - cartes pleine largeur */}
        <div className="space-y-6">
          {artisans.map((artisan) => (
            <Card key={artisan.id} className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Image de couverture ou logo */}
                  <div className="lg:w-1/3 h-48 lg:h-auto relative">
                    {artisan.coverUrl ? (
                      <Image
                        src={artisan.coverUrl}
                        alt={`Couverture ${artisan.companyName}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        {artisan.logoUrl ? (
                          <Image
                            src={artisan.logoUrl}
                            alt={`Logo ${artisan.companyName}`}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-orange-600">
                              {artisan.companyName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="lg:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      {/* En-tête */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                            {artisan.companyName}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {artisan.firstName} {artisan.lastName}
                          </p>
                          <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{artisan.city}</span>
                          </div>
                        </div>
                        
                        {/* Note et avis */}
                        {artisan.averageRating > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{artisan.averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({artisan.reviewCount} avis)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Professions */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {artisan.profession}
                        </Badge>
                        {artisan.professions.slice(0, 2).map((prof, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prof}
                          </Badge>
                        ))}
                      </div>

                      {/* Description */}
                      {artisan.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {artisan.description}
                        </p>
                      )}

                      {/* Certifications */}
                      {artisan.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {artisan.certifications.slice(0, 3).map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <Button asChild className="bg-orange-600 hover:bg-orange-700">
                        <Link href={`/artisan/${artisan.slug}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir le profil
                        </Link>
                      </Button>
                      
                      {artisan.privacy.showPhone && (
                        <Button variant="outline" asChild>
                          <Link href={`tel:${artisan.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Appeler
                          </Link>
                        </Button>
                      )}
                      
                      {artisan.privacy.showEmail && (
                        <Button variant="outline" asChild>
                          <Link href={`mailto:${artisan.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lien pour chercher un artisan */}
        <div className="text-left mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/trouver-pro">
              Chercher un artisan
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
