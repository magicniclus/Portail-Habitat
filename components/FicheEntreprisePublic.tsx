"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePhoneTracking, useContactFormTracking, useArtisanTracking } from "@/hooks/useArtisanTracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import TopArtisanBadge from "@/components/TopArtisanBadge";
import { isPremiumActive } from "@/lib/premium-utils";
import ArtisanBanner from "@/components/ArtisanBanner";
import { 
  isDemoArtisan, 
  isDemoArtisanContactable, 
  getDisplayPhone, 
  getDisplayEmail,
  getPhoneClickAction,
  getContactFormAction,
  getContactRedirectUrl,
  getDemoArtisanMessage,
  type ArtisanWithDemo 
} from "@/lib/demo-artisan-utils";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Eye,
  Send,
  Building,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  Share2,
  Crown
} from "lucide-react";
import { XIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import Link from "next/link";
import { collection, addDoc, updateDoc, doc, increment, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import ZoneInterventionMap from "./ZoneInterventionMap";
import BannerVideoManager from "./BannerVideoManager";
import { sendLeadNotificationIfAllowed } from '@/lib/notification-service';
import { getArtisanPreferencesWithDefaults } from '@/lib/artisan-preferences';
import ProjectCard from "./ProjectCard";

interface FicheEntreprisePublicProps {
  entreprise: ArtisanWithDemo & {
    nom: string;
    logo?: string;
    banniere?: string;
    specialites: string[];
    description: string;
    telephone: string;
    email: string;
    adresse: string;
    ville: string;
    note: number;
    nombreAvis: number;
    certifications: string[];
    zoneIntervention: string[];
    averageQuoteMin?: number;
    averageQuoteMax?: number;
    firstName?: string;
    lastName?: string;
    siret?: string;
    profession?: string;
    premiumFeatures?: any;
  };
  showContactForm?: boolean;
  isPreview?: boolean;
  canEdit?: boolean;
  projects?: any[];
  reviews?: any[];
  showPromoBanner?: boolean;
  showBottomBanner?: boolean;
}

export default function FicheEntreprisePublic({ 
  entreprise, 
  showContactForm = true, 
  isPreview = false,
  canEdit = false,
  projects = [],
  reviews = [],
  showPromoBanner = false,
  showBottomBanner = false
}: FicheEntreprisePublicProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Logique demo artisan
  const isDemo = isDemoArtisan(entreprise);
  const isContactable = isDemoArtisanContactable(entreprise);
  const demoDisplayPhone = getDisplayPhone(entreprise);
  const displayEmail = getDisplayEmail(entreprise);
  const phoneAction = getPhoneClickAction(entreprise);
  const formAction = getContactFormAction(entreprise);
  const demoMessage = getDemoArtisanMessage(entreprise);

  const resolvedPhone = (isDemo ? demoDisplayPhone : (entreprise.telephone || (entreprise as any).phone || "")) as string;
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showPhone: true,
    showEmail: false,
    allowDirectContact: true
  });
  const [isCoverLoading, setIsCoverLoading] = useState(true);
  const [isLogoLoading, setIsLogoLoading] = useState(true);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Vérifier si l'artisan est premium et a le badge activé
  const shouldShowTopBadge = entreprise.premiumFeatures && 
    isPremiumActive({ id: entreprise.id, premiumFeatures: entreprise.premiumFeatures }) && 
    entreprise.premiumFeatures.showTopArtisanBadge;
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isCardSticky, setIsCardSticky] = useState(false);
  const [cardPosition, setCardPosition] = useState('static');
  const [cardInitialTop, setCardInitialTop] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardLeft, setCardLeft] = useState(0);
  const [isCardAtBottom, setIsCardAtBottom] = useState(false);
  const [bottomPosition, setBottomPosition] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const avisClientsSectionRef = useRef<HTMLDivElement>(null);

  // Écouter l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Vérifier si l'utilisateur connecté est le propriétaire de la fiche
  const isOwner = currentUser?.uid === entreprise.id;

  // Tracking automatique des vues de pages (seulement si ce n'est pas le propriétaire ET pas un artisan demo)
  // On utilise une logique simple : si c'est pas une preview ET pas le propriétaire ET pas un demo
  useArtisanTracking({ 
    artisanId: entreprise.id, 
    autoTrackView: !isPreview && !isOwner,
    isDemo: entreprise.accountType === 'demo'
  });

  // Fonctions de tracking avec logs détaillés
  const trackPhoneClick = async () => {
    try {
      console.log('📞 Début tracking clic téléphone pour:', entreprise.id);
      const { trackPhoneClick: trackPhone } = await import('@/lib/artisan-analytics');
      await trackPhone(entreprise.id);
      console.log('✅ Clic téléphone tracké avec succès pour:', entreprise.id);
    } catch (error) {
      console.error('❌ Erreur tracking téléphone:', error);
    }
  };

  const trackFormSubmission = async (formData: any) => {
    try {
      console.log('📧 Début tracking formulaire pour:', entreprise.id, formData);
      const { trackFormSubmission: trackForm } = await import('@/lib/artisan-analytics');
      await trackForm(entreprise.id, formData);
      console.log('✅ Formulaire tracké avec succès pour:', entreprise.id);
      return true;
    } catch (error) {
      console.error('❌ Erreur tracking formulaire:', error);
      return false;
    }
  };


  // Récupérer les paramètres de confidentialité de l'artisan
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        const artisanDoc = await getDoc(doc(db, 'artisans', entreprise.id));
        if (artisanDoc.exists()) {
          const data = artisanDoc.data();
          const preferences = getArtisanPreferencesWithDefaults(data);
          setPrivacySettings(preferences.privacy);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres de confidentialité:', error);
      }
    };

    fetchPrivacySettings();
  }, [entreprise.id]);

  // Capturer les dimensions initiales de la carte
  useEffect(() => {
    if (!showContactForm || !cardRef.current) return;

    const captureInitialDimensions = () => {
      const card = cardRef.current;
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const scrollY = window.scrollY;
      
      setCardInitialTop(cardRect.top + scrollY);
      setCardWidth(cardRect.width);
      setCardLeft(cardRect.left);
    };

    const timer = setTimeout(captureInitialDimensions, 100);
    return () => clearTimeout(timer);
  }, [showContactForm, entreprise]);

  // Gérer le comportement sticky de la carte (comme FicheEntreprise mais avec limite)
  useEffect(() => {
    if (!showContactForm || cardInitialTop === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Déclenchement du sticky quand on arrive à 10px de la carte
      const triggerPoint = cardInitialTop - 10;
      
      // Calculer la limite en bas : fin de la section avis
      let maxStickyPoint = Infinity;
      if (avisClientsSectionRef.current && cardRef.current) {
        const avisElement = avisClientsSectionRef.current;
        const avisBottom = avisElement.offsetTop + avisElement.offsetHeight;
        const formHeight = cardRef.current.offsetHeight;
        maxStickyPoint = avisBottom - formHeight - 20; // 20px de marge
      }
      
      // Test : logique simple comme FicheEntreprise SANS limite d'abord
      const shouldBeSticky = scrollY >= triggerPoint; // && scrollY <= maxStickyPoint;
      setIsCardSticky(shouldBeSticky);
      
      // Debug temporaire
      if (scrollY % 100 === 0) { // Log seulement tous les 100px pour pas spammer
        console.log('Scroll Debug:', {
          scrollY,
          triggerPoint,
          maxStickyPoint,
          shouldBeSticky,
          cardInitialTop,
          isCardSticky
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Vérifier la position initiale

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showContactForm, cardInitialTop]);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    codePostal: "",
    description: ""
  });

  const handlePhoneClick = () => {
    // Gestion spéciale pour les artisans demo
    if (phoneAction === 'disabled') {
      return; // Pas d'action possible
    }
    
    if (phoneAction === 'redirect') {
      window.location.href = getContactRedirectUrl(entreprise, 'phone');
      return;
    }
    
    // Comportement normal pour les vrais artisans
    if (!showPhone) {
      // Tracker quand l'utilisateur révèle le numéro (plus pertinent)
      trackPhoneClick();
      setShowPhone(true);
    } else {
      // Juste ouvrir l'appel sans tracking supplémentaire
      window.location.href = `tel:${resolvedPhone}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error message
    setFormErrorMessage("");
    
    // Gestion spéciale pour les artisans demo
    if (formAction === 'disabled') {
      setFormErrorMessage('Contact non disponible pour cet artisan.');
      return;
    }
    
    if (formAction === 'redirect') {
      window.location.href = getContactRedirectUrl(entreprise, 'form');
      return;
    }
    
    // Validation des champs requis (tous sauf description)
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.telephone.trim() || !formData.codePostal.trim()) {
      setFormErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation du code postal (5 chiffres)
    if (!/^\d{5}$/.test(formData.codePostal)) {
      setFormErrorMessage('Le code postal doit contenir exactement 5 chiffres.');
      return;
    }

    setIsSubmittingForm(true);

    try {
      // Tracker la soumission du formulaire
      await trackFormSubmission({
        name: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        phone: formData.telephone,
        message: formData.description || '',
        projectType: 'Contact depuis fiche artisan'
      });

      // Créer le lead dans la sous-collection de l'artisan
      const leadsRef = collection(db, 'artisans', entreprise.id, 'leads');
      
      await addDoc(leadsRef, {
        clientName: `${formData.prenom} ${formData.nom}`,
        clientPhone: formData.telephone,
        clientEmail: formData.email,
        projectType: formData.description || 'Non spécifié',
        city: formData.codePostal, // On utilise le code postal comme ville pour l'instant
        budget: 'Non spécifié',
        source: 'fiche-publique',
        status: 'new',
        createdAt: new Date(),
        notes: formData.description || ''
      });

      // Mettre à jour les compteurs de l'artisan
      const artisanRef = doc(db, 'artisans', entreprise.id);
      await updateDoc(artisanRef, {
        leadCountThisMonth: increment(1),
        totalLeads: increment(1),
        updatedAt: new Date()
      });

      // Envoyer l'email de notification à l'artisan (si autorisé par ses préférences)
      try {
        const notificationSent = await sendLeadNotificationIfAllowed(entreprise.id, {
          artisanEmail: entreprise.email,
          artisanName: entreprise.nom,
          clientName: `${formData.prenom} ${formData.nom}`,
          clientEmail: formData.email,
          clientPhone: formData.telephone,
          clientPostalCode: formData.codePostal,
          projectDescription: formData.description
        });

        if (notificationSent) {
          console.log('Email de notification lead envoyé avec succès');
        } else {
          console.log('Email de notification lead non envoyé (préférences ou erreur)');
        }
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // On ne fait pas échouer la soumission si l'email échoue
      }

      // Afficher le message de confirmation
      setIsFormSubmitted(true);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setFormErrorMessage('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStarRating = (note: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div ref={mainCardRef} className="w-full h-full bg-white overflow-hidden">
      {/* Bannière */}
      <div className="relative">
        <ArtisanBanner entreprise={entreprise} className="h-96" />

        {/* Badge Top Artisan en haut à droite de la bannière */}
        {shouldShowTopBadge && (
          <div className="absolute top-4 right-4 z-20">
            <TopArtisanBadge 
              size="md" 
              variant="default"
            />
          </div>
        )}

        {/* Badge aperçu */}
        {isPreview && (
          <div className={`absolute top-4 z-20 ${shouldShowTopBadge ? 'right-4 mt-12' : 'right-4'}`}>
            <Badge className="bg-white/90 text-gray-800">
              <Eye className="h-3 w-3 mr-1" />
              Aperçu
            </Badge>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="relative px-2 md:px-6 pb-6">
        {/* Logo entreprise (chevauchant la bannière) */}
        <div className="relative -mt-12 mb-6">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center relative">
            {entreprise.logo ? (
              <>
                {isLogoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
                <img
                  src={entreprise.logo}
                  alt={`Logo ${entreprise.nom}`}
                  className="w-20 h-20 rounded-full object-cover"
                  onLoad={() => setIsLogoLoading(false)}
                  onError={() => setIsLogoLoading(false)}
                  style={{ display: isLogoLoading ? 'none' : 'block' }}
                />
              </>
            ) : (
              <Building className="h-12 w-12 text-gray-400" />
            )}
            
            {/* Couronne jaune en bas du logo pour les artisans premium */}
            {shouldShowTopBadge && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Crown className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Layout principal */}
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-[780px]:gap-4">
          {/* Partie gauche - Informations entreprise */}
          <div className="lg:col-span-2 space-y-10 max-[780px]:space-y-6">
            {/* Nom et spécialités */}
            <div className="space-y-3">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <h1 className="text-3xl font-bold text-gray-900 max-[780px]:text-2xl">
                  {entreprise.nom}
                </h1>
                <div className="flex items-center space-x-2 max-[780px]:space-x-1">
                  <Button variant="outline" size="sm" onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({
                        title: `${entreprise.nom} - Artisan`,
                        text: `Découvrez la fiche de ${entreprise.nom}`,
                        url: url
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(url).then(() => {
                        alert('Lien copié dans le presse-papier !');
                      }).catch(() => {});
                    }
                  }} className="max-[780px]:text-xs max-[780px]:px-2">
                    <Share2 className="h-4 w-4 mr-2 max-[780px]:h-3 max-[780px]:w-3 max-[780px]:mr-1" />
                    Partager
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const url = window.location.href;
                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    window.open(facebookUrl, '_blank', 'width=600,height=400');
                  }} className="text-blue-600 hover:bg-blue-50 max-[780px]:px-2">
                    <FacebookIcon className="h-4 w-4 max-[780px]:h-3 max-[780px]:w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const url = window.location.href;
                    const text = `Découvrez la fiche de ${entreprise.nom} - Artisan professionnel`;
                    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                    window.open(xUrl, '_blank', 'width=600,height=400');
                  }} className="text-black hover:bg-gray-50 max-[780px]:px-2">
                    <XIcon className="h-4 w-4 max-[780px]:h-3 max-[780px]:w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {entreprise.specialites.map((specialite, index) => (
                  <Badge key={index} variant="secondary" className="text-sm max-[780px]:text-xs">
                    {specialite}
                  </Badge>
                ))}
              </div>

              {/* Bannière publicitaire responsive (si activée) */}
              {showPromoBanner && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 mt-6 border border-orange-100 max-[780px]:p-4 max-[780px]:mt-4">
                  <div className="flex flex-col max-[780px]:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3 text-orange-900 max-[780px]:text-lg max-[780px]:mb-2">Votre publicité ici !</h3>
                      <p className="text-orange-800 text-base max-[780px]:text-sm">
                        Développez votre visibilité et attirez plus de clients avec nos solutions publicitaires.
                      </p>
                    </div>
                    <div className="lg:ml-6">
                      <Link href="/devenir-pro">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full max-[780px]:w-full lg:w-auto">
                          En savoir plus
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Note et avis */}
              {entreprise.nombreAvis > 0 && (
                <div ref={avisClientsSectionRef} className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <a href="#avis-clients" className="text-xl font-bold text-gray-900 mb-2 hover:underline">
                        Avis clients ({entreprise.nombreAvis})
                      </a>
                      <p className="text-sm text-gray-600">
                        Découvrez les retours de nos clients satisfaits
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStarRating(entreprise.note)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {entreprise.note}/5
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">À propos</h3>
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    {entreprise.description ? (
                      entreprise.description.length > 300 && !isDescriptionExpanded ? (
                        <>
                          {entreprise.description.substring(0, 300)}...
                        </>
                      ) : (
                        entreprise.description
                      )
                    ) : (
                      "Aucune description disponible."
                    )}
                  </p>
                  {entreprise.description && entreprise.description.length > 300 && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium mt-2 flex items-center"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Voir moins
                          <svg className="w-4 h-4 ml-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          Voir plus
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Informations et Devis moyen */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                {/* Informations */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Informations</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {(() => {
                          const fullAddress = `${entreprise.adresse}, ${entreprise.ville}`;
                          return fullAddress.startsWith(', ') ? fullAddress.substring(2) : fullAddress;
                        })()}
                      </span>
                    </div>
                    {privacySettings.showEmail && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{displayEmail}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Devis moyen */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Devis moyen</h3>
                  <div className="text-gray-600">
                    {entreprise.averageQuoteMin && entreprise.averageQuoteMax ? (
                      <span className="text-lg font-medium text-gray-900">
                        {entreprise.averageQuoteMin.toLocaleString()}€ - {entreprise.averageQuoteMax.toLocaleString()}€
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Non renseigné
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Zone d'intervention */}
              {entreprise.zoneIntervention && entreprise.zoneIntervention.length > 0 && (
                <div className="space-y-3 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Zone d'intervention</h3>
                  
                  {/* Petite carte Mapbox */}
                  <ZoneInterventionMap 
                    zones={entreprise.zoneIntervention}
                    centerCity={entreprise.ville}
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    {entreprise.zoneIntervention.map((zone, index) => (
                      <Badge key={index} variant="outline" className="text-sm flex items-center justify-center">
                        <span className="text-center">{zone}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Vidéo de présentation */}
              {entreprise.premiumFeatures?.bannerVideo && (
                <div className="space-y-3 pb-6 border-b border-gray-200">
                  <BannerVideoManager 
                    entreprise={entreprise}
                    canEdit={false}
                  />
                </div>
              )}

              {/* Certifications */}
              {entreprise.certifications && entreprise.certifications.length > 0 && (
                <div className="space-y-3 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {entreprise.certifications.map((certification, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        {certification}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire de contact mobile - après les certifications */}
              {showContactForm && (
                <div className="lg:hidden">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-[780px]:p-4">
                    {isFormSubmitted ? (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Demande envoyée !
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Votre demande a été transmise à {entreprise.nom}. 
                            Vous devriez recevoir une réponse sous 24h.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Demander un devis
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Contactez {entreprise.nom} pour votre projet
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              name="prenom"
                              placeholder="Prénom *"
                              value={formData.prenom}
                              onChange={handleInputChange}
                              required
                              disabled={isSubmittingForm}
                            />
                            <Input
                              name="nom"
                              placeholder="Nom *"
                              value={formData.nom}
                              onChange={handleInputChange}
                              required
                              disabled={isSubmittingForm}
                            />
                          </div>
                          
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmittingForm}
                          />
                          
                          <Input
                            name="telephone"
                            type="tel"
                            placeholder="Téléphone *"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmittingForm}
                          />
                          
                          <Input
                            name="codePostal"
                            placeholder="Code postal *"
                            value={formData.codePostal}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmittingForm}
                          />
                          
                          <Textarea
                            name="description"
                            placeholder="Décrivez votre projet..."
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={isSubmittingForm}
                            rows={4}
                          />

                          {formErrorMessage && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                              {formErrorMessage}
                            </div>
                          )}

                          <Button 
                            type="submit" 
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            disabled={isSubmittingForm}
                          >
                            {isSubmittingForm ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Envoi en cours...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer ma demande
                              </>
                            )}
                          </Button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Projets */}
              {projects && projects.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Nos réalisations</h3>
                    {projects.length > 6 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllProjects(!showAllProjects)}
                      >
                        {showAllProjects ? 'Voir moins' : `Voir tout (${projects.length})`}
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(showAllProjects ? projects : projects.slice(0, 6)).map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        canEdit={false}
                        onVisibilityToggle={async () => {}}
                        onEdit={async () => {}}
                        onDelete={async () => {}}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Avis clients */}
              {reviews && reviews.length > 0 && (
                <div id="avis-clients" className="space-y-6">
                  <div className="flex items-center justify-between mt-10">
                    <h3 className="text-lg font-semibold">
                      Avis clients {reviews.length > 0 && `(${reviews.length})`}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {(showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{review.clientName}</span>
                            <div className="flex items-center">
                              {getStarRating(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > 5 && (
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews ? 'Voir moins' : 'Voir plus d\'avis'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Bannière partenaire du bas (dans la colonne de gauche) */}
              {showBottomBanner && (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Vous êtes artisan ?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Rejoignez Portail Habitat et développez votre activité.
                    </p>
                    <Link href="/devenir-pro">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        Devenir partenaire
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Partie droite - Formulaire de contact (desktop uniquement) */}
          {showContactForm && (
            <div className="lg:col-span-1 hidden lg:block">
              <div
                ref={cardRef}
                className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 transition-all duration-300 ${
                  isCardSticky ? 'fixed top-4 z-10 shadow-lg' : 'relative'
                }`}
                style={isCardSticky ? {
                  left: `${cardLeft}px`,
                  width: `${cardWidth}px`
                } : {}}
              >
                {isFormSubmitted ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Demande envoyée !
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Votre demande a été transmise à {entreprise.nom}. 
                        Vous devriez recevoir une réponse sous 24h.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Demander un devis
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Contactez {entreprise.nom} pour votre projet
                      </p>
                    </div>

                    {/* Message d'information pour les artisans demo */}
                    {demoMessage && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800">{demoMessage}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          name="prenom"
                          placeholder="Prénom *"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmittingForm || formAction === 'disabled'}
                        />
                        <Input
                          name="nom"
                          placeholder="Nom *"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmittingForm || formAction === 'disabled'}
                        />
                      </div>
                      
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmittingForm || formAction === 'disabled'}
                      />
                      
                      <Input
                        name="telephone"
                        type="tel"
                        placeholder="Téléphone *"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmittingForm || formAction === 'disabled'}
                      />
                      
                      <Input
                        name="codePostal"
                        placeholder="Code postal *"
                        value={formData.codePostal}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmittingForm || formAction === 'disabled'}
                      />
                      
                      <Textarea
                        name="description"
                        placeholder="Décrivez votre projet..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="min-h-[80px] resize-none"
                        disabled={isSubmittingForm || formAction === 'disabled'}
                      />

                      {formErrorMessage && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                          {formErrorMessage}
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmittingForm || formAction === 'disabled'}
                      >
                        {isSubmittingForm ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Envoi en cours...
                          </>
                        ) : formAction === 'redirect' ? (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Contacter cet artisan
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer ma demande
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Contact direct */}
                    {privacySettings.showPhone && entreprise.telephone && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">Ou contactez directement :</p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handlePhoneClick}
                          disabled={phoneAction === 'disabled'}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          {showPhone ? resolvedPhone : 'Voir le numéro'}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
