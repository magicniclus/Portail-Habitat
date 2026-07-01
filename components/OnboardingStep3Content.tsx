"use client";

import AddProjectModal from "@/components/AddProjectModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { auth, db, storage } from "@/lib/firebase";
import { uploadCoverPhoto, uploadLogoPhoto } from "@/lib/storage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  AlertCircle,
  ArrowRight,
  Building,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProspectData {
  prospectId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postalCode: string;
  profession: string;
  selectedCity?: string;
  selectedZoneRadius?: number;
  lat?: number;
  lng?: number;
}

interface LocalProject {
  id: string;
  title: string;
  description: string;
  city: string;
  projectType: string;
  isPubliclyVisible: boolean;
  photos: File[];
  previewUrls: string[];
}

type Status = "filling" | "creating" | "done";

const LOCALSTORAGE_KEY = "onboarding_fiche_v2";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProfessionLabel(p: string) {
  const map: Record<string, string> = {
    plombier: "Plombier",
    electricien: "Électricien",
    chauffagiste: "Chauffagiste",
    peintre: "Peintre",
    maconnerie: "Maçon",
    menuisier: "Menuisier",
    couvreur: "Couvreur",
    carreleur: "Carreleur",
    charpentier: "Charpentier",
    multiservices: "Multiservices",
    "entreprise-generale": "Entreprise générale",
    diagnostiqueur: "Diagnostiqueur immobilier",
    architecte: "Architecte",
    paysagiste: "Paysagiste",
    serrurier: "Serrurier",
    vitrier: "Vitrier",
    platrier: "Plâtrier",
    isolation: "Spécialiste isolation",
    climatisation: "Climaticien",
    domotique: "Domoticien",
  };
  return map[p] || (p ? p.charAt(0).toUpperCase() + p.slice(1) : "Artisan");
}

function generateSlug(firstName: string, lastName: string, profession: string) {
  return (
    `${firstName}-${lastName}-${profession}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim() + `-${Date.now()}`
  );
}

// ─── Indicateur de complétion ─────────────────────────────────────────────────

function CompletionRing({ done, label }: { done: boolean; label: string }) {
  if (done) {
    return (
      <span className="absolute -top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full font-medium shadow-sm">
        <CheckCircle className="h-3 w-3" />
        Complété
      </span>
    );
  }
  return (
    <span className="absolute -top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-medium shadow-sm animate-pulse">
      <AlertCircle className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function OnboardingStep3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Données prospect depuis l'URL ──────────────────────────────────────────
  const [prospect, setProspect] = useState<ProspectData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    profession: "",
  });

  // ── Données fiche (local, sans Firebase) ──────────────────────────────────
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [specialites, setSpecialites] = useState<string[]>([]);
  const [projects, setProjects] = useState<LocalProject[]>([]);

  // ── Mot de passe (formulaire en modal à la fin) ───────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // ── State général ─────────────────────────────────────────────────────────
  const [status, setStatus] = useState<Status>("filling");
  const [creationError, setCreationError] = useState("");
  const [leadsCount, setLeadsCount] = useState<number>(0);

  // ── Refs pour scroll vers les sections ───────────────────────────────────
  const logoRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ── Lecture paramètres URL ─────────────────────────────────────────────────
  useEffect(() => {
    const p: ProspectData = {
      prospectId: searchParams.get("prospectId") || undefined,
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      postalCode: searchParams.get("postalCode") || "",
      profession: searchParams.get("profession") || "",
      selectedCity: searchParams.get("city") || "",
      selectedZoneRadius: parseInt(
        searchParams.get("selectedZoneRadius") || "30",
      ),
      lat: parseFloat(searchParams.get("lat") || "0") || undefined,
      lng: parseFloat(searchParams.get("lng") || "0") || undefined,
    };
    setProspect(p);

    // Récupérer le nombre de demandes transmis depuis l'étape 2
    const lc = parseInt(searchParams.get("leadsCount") || "0");
    if (lc > 0) setLeadsCount(lc);

    // Initialiser le nom de l'entreprise et les spécialités depuis les params
    setCompanyName(`${p.firstName} ${p.lastName}`.trim());
    const prof = p.profession ? [getProfessionLabel(p.profession)] : [];
    setSpecialites(prof);

    // Charger le brouillon localStorage
    try {
      const draft = localStorage.getItem(LOCALSTORAGE_KEY);
      if (draft) {
        const d = JSON.parse(draft);
        if (d.email === p.email) {
          if (d.description) setDescription(d.description);
          if (d.companyName) setCompanyName(d.companyName);
          if (d.logoPreview) setLogoPreview(d.logoPreview);
          if (d.coverPreview) setCoverPreview(d.coverPreview);
          if (d.specialites) setSpecialites(d.specialites);
        }
      }
    } catch {}
  }, [searchParams]);

  // ── Sauvegarde localStorage à chaque changement ───────────────────────────
  useEffect(() => {
    if (!prospect.email) return;
    try {
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({
          email: prospect.email,
          companyName,
          description,
          logoPreview: logoFile ? "" : logoPreview, // les File ne se sauvegardent pas
          coverPreview: coverFile ? "" : coverPreview,
          specialites,
        }),
      );
    } catch {}
  }, [
    companyName,
    description,
    logoPreview,
    coverPreview,
    specialites,
    prospect.email,
  ]);

  // ── Si l'utilisateur est déjà connecté (reload), rediriger directement ────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === prospect.email) {
        // Déjà authentifié → vérifier si artisan existe
        const q = query(
          collection(db, "artisans"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          // Compte déjà créé, rediriger vers le dashboard
          router.push("/dashboard");
        }
      }
    });
    return () => unsubscribe();
  }, [prospect.email, router]);

  // leadsCount est lu depuis les params URL (transmis par step2)

  // ── Auto-slide témoignages ─────────────────────────────────────────────────
  const TESTIMONIALS = [
    {
      initial: "M",
      color: "bg-orange-500",
      stars: 5,
      quote:
        "Une plateforme simple pour trouver des chantiers près de chez moi, sans passer par dix intermédiaires.",
      author: "Marc B.",
      role: "Plombier à Lyon",
    },
    {
      initial: "I",
      color: "bg-emerald-600",
      stars: 5,
      quote:
        "Les demandes arrivent directement sur ma fiche. Je choisis celles qui correspondent à mon planning.",
      author: "Isabelle R.",
      role: "Peintre à Paris",
    },
    {
      initial: "K",
      color: "bg-blue-600",
      stars: 5,
      quote:
        "Ma fiche me représente vraiment. Les clients arrivent déjà informés, les échanges sont plus directs.",
      author: "Karim D.",
      role: "Maçon à Marseille",
    },
    {
      initial: "L",
      color: "bg-purple-600",
      stars: 5,
      quote:
        "Je peux gérer mes disponibilités et ma zone d'intervention sans décrocher le téléphone à chaque fois.",
      author: "Laure M.",
      role: "Électricienne à Rennes",
    },
  ];


  // ── Calcul de complétion ──────────────────────────────────────────────────
  const hasLogo = !!logoPreview;
  const hasDescription = description.trim().length >= 10;
  const hasCover = !!coverPreview;
  const hasProject = projects.length > 0;
  // Obligatoires : logo + description + photo de couverture
  const ficheIsComplete = hasLogo && hasDescription && hasCover;
  const completedRequired = [hasCover, hasLogo, hasDescription].filter(
    Boolean,
  ).length;
  const completionPercent = Math.round((completedRequired / 3) * 100);

  // ── Gestion du logo ───────────────────────────────────────────────────────
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop lourd (max 5 Mo)");
      return;
    }
    setLogoFile(file);
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  // ── Gestion de la bannière ────────────────────────────────────────────────
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop lourd (max 5 Mo)");
      return;
    }
    setCoverFile(file);
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  // ── Gestion des projets ───────────────────────────────────────────────────
  const handleAddProject = async (projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    photos: File[];
  }) => {
    const previewUrls = projectData.photos.map((f) => URL.createObjectURL(f));
    const newProject: LocalProject = {
      id: `local-${Date.now()}`,
      ...projectData,
      previewUrls,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prev) => {
      const p = prev.find((pr) => pr.id === id);
      if (p) p.previewUrls.forEach((u) => URL.revokeObjectURL(u));
      return prev.filter((pr) => pr.id !== id);
    });
  };

  // ── Création du compte (appelée depuis la modal mot de passe) ─────────────
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== passwordConfirm) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return;
    }

    setShowPasswordModal(false);
    setStatus("creating");

    try {
      // 1. Créer l'utilisateur Firebase Auth
      const credential = await createUserWithEmailAndPassword(
        auth,
        prospect.email,
        password,
      );
      const user = credential.user;

      // 2. Créer le doc utilisateur
      await setDoc(doc(db, "users", user.uid), {
        email: prospect.email,
        phone: prospect.phone || "",
        role: "artisan",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });

      // 3. Créer le doc artisan (sans les URLs d'images pour l'instant)
      const slug = generateSlug(
        prospect.firstName,
        prospect.lastName,
        prospect.profession,
      );
      const artisanRef = doc(collection(db, "artisans"));
      const artisanId = artisanRef.id;

      await setDoc(artisanRef, {
        userId: user.uid,
        companyName:
          companyName || `${prospect.firstName} ${prospect.lastName}`,
        slug,
        firstName: prospect.firstName,
        lastName: prospect.lastName,
        phone: prospect.phone || "",
        email: prospect.email,
        city: prospect.selectedCity || "",
        postalCode: prospect.postalCode || "",
        fullAddress: prospect.selectedCity || "",
        coordinates:
          prospect.lat && prospect.lng
            ? { lat: prospect.lat, lng: prospect.lng }
            : null,
        profession: prospect.profession || "",
        professions:
          specialites.length > 0
            ? specialites
            : prospect.profession
              ? [prospect.profession]
              : [],
        description: description.trim(),
        services: [],
        logoUrl: "",
        coverUrl: "",
        photos: [],
        certifications: [],
        averageRating: 0,
        reviewCount: 0,
        averageQuoteMin: null,
        averageQuoteMax: null,
        subscriptionStatus: "free",
        hasPremiumSite: false,
        premiumFeatures: { isPremium: false },
        ficheComplete: false,
        premiumProposalShown: false,
        isActive: true,
        selectedZoneRadius: prospect.selectedZoneRadius || 30,
        prospectId: prospect.prospectId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 4. Upload logo
      let logoUrl = "";
      if (logoFile) {
        try {
          logoUrl = await uploadLogoPhoto(artisanId, logoFile);
        } catch (e) {
          console.error("Erreur upload logo:", e);
        }
      }

      // 5. Upload bannière
      let coverUrl = "";
      if (coverFile) {
        try {
          coverUrl = await uploadCoverPhoto(artisanId, coverFile);
        } catch (e) {
          console.error("Erreur upload bannière:", e);
        }
      }

      // 6. Upload projets
      for (const project of projects) {
        try {
          const photoUrls: string[] = [];
          for (let i = 0; i < project.photos.length; i++) {
            const file = project.photos[i];
            const ext = file.name.split(".").pop();
            const photoRef = ref(
              storage,
              `artisans/${artisanId}/projects/${project.id}/photo_${i + 1}_${Date.now()}.${ext}`,
            );
            await uploadBytes(photoRef, file);
            const url = await getDownloadURL(photoRef);
            photoUrls.push(url);
          }
          const postsRef = collection(db, "artisans", artisanId, "posts");
          const postRef = doc(postsRef);
          await setDoc(postRef, {
            title: project.title,
            description: project.description,
            city: project.city,
            projectType: project.projectType,
            isPublished: true,
            isPubliclyVisible: project.isPubliclyVisible,
            photos: photoUrls,
            likesCount: 0,
            commentsCount: 0,
            createdAt: serverTimestamp(),
          });
        } catch (e) {
          console.error("Erreur upload projet:", e);
        }
      }

      // 7. Mettre à jour les URLs d'images et marquer ficheComplete si applicable
      const updates: Record<string, any> = { updatedAt: serverTimestamp() };
      if (logoUrl) updates.logoUrl = logoUrl;
      if (coverUrl) updates.coverUrl = coverUrl;

      // Fiche complète = logo + cover + description (projets facultatifs)
      const ficheComplete =
        logoUrl.length > 0 &&
        coverUrl.length > 0 &&
        description.trim().length >= 10;
      updates.ficheComplete = ficheComplete;

      await updateDoc(artisanRef, updates);

      // 8. Mettre à jour le prospect (non bloquant)
      if (prospect.prospectId) {
        updateDoc(doc(db, "prospects", prospect.prospectId), {
          funnelStep: "step3",
          artisanId,
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }

      // 9. Stripe + email en arrière-plan (non bloquant)
      fetch("/api/setup-artisan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          artisanId,
          firstName: prospect.firstName,
          lastName: prospect.lastName,
          email: prospect.email,
          phone: prospect.phone,
          profession: prospect.profession,
          selectedCity: prospect.selectedCity,
        }),
      }).catch(() => {});

      // 10. Nettoyer et rediriger
      try {
        [LOCALSTORAGE_KEY, "prospectData"].forEach((k) =>
          localStorage.removeItem(k),
        );
      } catch {}

      setStatus("done");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erreur création compte:", err);
      setCreationError(
        err.code === "auth/email-already-in-use"
          ? "Un compte existe déjà avec cet email. Connectez-vous sur la page de connexion."
          : err.message || "Une erreur est survenue. Réessayez.",
      );
      setStatus("filling");
      setShowPasswordModal(true);
    }
  };

  // ─── Rendu : spinner de création ─────────────────────────────────────────

  if (status === "creating" || status === "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg">
            Création de votre espace…
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Upload des photos en cours, encore quelques secondes
          </p>
        </div>
      </div>
    );
  }

  // ─── Rendu principal : fiche à remplir ────────────────────────────────────

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Portail Habitat"
                width={140}
                height={50}
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 mb-1">
                  Étape 3/3 — Créez votre fiche
                </p>
                <Progress value={completionPercent} className="w-32 h-1.5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-700 font-medium">
                  {prospect.firstName} {prospect.lastName}
                </p>
                <p className="text-xs text-gray-400">{prospect.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Corps principal ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">
          {/* ── Colonne principale (fiche) ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden">
              {/* ── BANNIÈRE ─────────────────────────────────────────── */}
              <div className="relative">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                <div
                  className={`relative h-48 sm:h-64 cursor-pointer group flex items-center justify-center overflow-hidden transition-all ${
                    hasCover
                      ? "bg-gray-100"
                      : "bg-gradient-to-r from-orange-50 to-orange-100"
                  }`}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {coverPreview ? (
                    <>
                      <img
                        src={coverPreview}
                        alt="Photo de couverture"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                          <Camera className="h-5 w-5 text-gray-700" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center select-none">
                      <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm text-orange-600 font-semibold">
                        Cliquez pour ajouter une photo de couverture
                      </p>
                      <p className="text-xs text-orange-400 mt-1">
                        JPG, PNG ou WebP — max 5 Mo
                      </p>
                    </div>
                  )}

                  {/* Badge Obligatoire / Complété */}
                  <span
                    className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 text-white text-xs rounded-full font-medium shadow-sm ${
                      hasCover ? "bg-green-600" : "bg-orange-500 animate-pulse"
                    }`}
                  >
                    {hasCover ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Complété
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" /> Obligatoire
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* ── LOGO + NOM ────────────────────────────────────────── */}
              <div className="px-4 sm:px-6 pb-6">
                <div className="flex items-end gap-4 -mt-10 mb-5">
                  {/* Logo avec indicateur */}
                  <div className="relative flex-shrink-0">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <div
                      ref={logoRef}
                      className={`relative w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer group transition-all ${
                        hasLogo
                          ? "bg-white"
                          : "bg-orange-50 ring-4 ring-orange-400 ring-offset-2 animate-pulse"
                      }`}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Building className="h-8 w-8 text-orange-300 mx-auto" />
                          <p className="text-xs text-orange-400 leading-tight mt-1">
                            Logo
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-full flex items-center justify-center">
                        <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    {/* Badge sous le logo */}
                    {!hasLogo && (
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-orange-600 font-semibold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                        Obligatoire
                      </span>
                    )}
                  </div>

                  {/* Nom de l'entreprise */}
                  <div className="flex-1 pt-12">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Nom de votre entreprise"
                      className="text-2xl font-bold text-gray-900 bg-transparent border-0 border-b-2 border-dashed border-gray-200 focus:border-orange-400 focus:outline-none w-full py-1 placeholder:text-gray-300"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {specialites.map((s) => (
                        <Badge key={s} variant="secondary" className="text-sm">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── DESCRIPTION ─────────────────────────────────── */}
                <div
                  ref={descRef}
                  className={`relative rounded-xl border-2 transition-all p-4 mb-6 ${
                    hasDescription
                      ? "border-green-100 bg-green-50/30"
                      : "border-orange-200 border-dashed bg-orange-50/30"
                  }`}
                >
                  <CompletionRing done={hasDescription} label="Obligatoire" />
                  <Label className="text-base font-semibold text-gray-800 mb-2 block">
                    Description de votre entreprise
                  </Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre activité, vos spécialités, vos valeurs, votre expérience… (min. 10 caractères)"
                    rows={5}
                    className="resize-none bg-white border-gray-200 focus:border-orange-400"
                  />
                  <p
                    className={`text-xs mt-1.5 ${
                      description.trim().length >= 10
                        ? "text-green-600"
                        : "text-orange-500"
                    }`}
                  >
                    {description.trim().length} / 10 caractères minimum
                    {description.trim().length >= 10 && " ✓"}
                  </p>
                </div>

                {/* ── RÉALISATIONS (facultatif, mais mis en avant) ──── */}
                <div
                  ref={projectRef}
                  className={`relative rounded-xl border-2 transition-all p-4 ${
                    hasProject
                      ? "border-blue-100 bg-blue-50/30"
                      : "border-blue-200 border-dashed bg-blue-50/20"
                  }`}
                >
                  {/* Badge facultatif bleu */}
                  {hasProject ? (
                    <span className="absolute -top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium shadow-sm">
                      <CheckCircle className="h-3 w-3" />
                      Ajouté
                    </span>
                  ) : (
                    <span className="absolute -top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-400 text-white text-xs rounded-full font-medium shadow-sm">
                      Recommandé
                    </span>
                  )}
                  <div className="mb-4">
                    <Label className="text-base font-semibold text-gray-800">
                      Réalisations
                    </Label>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Facultatif — les artisans avec des photos reçoivent 3×
                      plus de demandes
                    </p>
                  </div>

                  {projects.length === 0 ? (
                    <AddProjectModal onSave={handleAddProject} />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {projects.map((p) => (
                        <div
                          key={p.id}
                          className="relative group rounded-lg overflow-hidden bg-gray-100"
                        >
                          {p.previewUrls[0] ? (
                            <img
                              src={p.previewUrls[0]}
                              alt={p.title}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-gray-100">
                              <ImageIcon className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                          <button
                            onClick={() => handleRemoveProject(p.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60">
                            <p className="text-white text-xs font-medium truncate">
                              {p.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bouton Ajouter une réalisation quand il y en a déjà */}
                  {projects.length > 0 && (
                    <div className="mt-3">
                      <AddProjectModal onSave={handleAddProject} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Colonne droite (sticky) ────────────────────────────────────── */}
          <div className="hidden lg:block">
            {/* Toutes les cartes partagent : rounded-xl, shadow-sm, border border-gray-100, p-5, même gap */}
            <div className="sticky top-20 flex flex-col gap-3">
              {/* ══ BLOC 1 : Progression ════════════════════════════════════ */}
              <div className="rounded-xl border border-orange-100 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Votre progression
                  </p>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${
                      ficheIsComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {completedRequired}/3 obligatoires
                  </span>
                </div>

                {/* Barre */}
                <Progress value={completionPercent} className="h-1.5 mb-2" />
                <p className="text-xs text-gray-500 mb-4">
                  {completedRequired === 0 &&
                    "Plus que 3 étapes pour être visible dans votre zone"}
                  {completedRequired === 1 &&
                    "Bien démarré — encore 2 éléments obligatoires"}
                  {completedRequired === 2 &&
                    "Presque là — plus qu'un élément et vous êtes prêt"}
                  {completedRequired === 3 &&
                    "Votre fiche est prête — accédez à votre espace !"}
                </p>

                {/* Items obligatoires */}
                <ul className="space-y-1.5">
                  {[
                    {
                      done: hasCover,
                      label: "Photo de couverture",
                      action: () => coverInputRef.current?.click(),
                    },
                    {
                      done: hasLogo,
                      label: "Logo de l'entreprise",
                      action: () => logoInputRef.current?.click(),
                    },
                    {
                      done: hasDescription,
                      label: "Description (min. 10 car.)",
                      action: () =>
                        descRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        }),
                    },
                  ].map((item, i) => (
                    <li
                      key={i}
                      onClick={item.done ? undefined : item.action}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors cursor-pointer ${
                        item.done
                          ? "bg-green-50"
                          : "bg-orange-50 hover:bg-orange-100"
                      }`}
                    >
                      <div
                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          item.done
                            ? "bg-green-600 border-green-600"
                            : "border-orange-400 bg-white"
                        }`}
                      >
                        {item.done && (
                          <svg
                            className="h-2.5 w-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${item.done ? "text-gray-400 line-through decoration-gray-300" : "text-gray-700 font-medium"}`}
                      >
                        {item.label}
                      </span>
                      {!item.done && (
                        <span className="text-xs text-orange-500 font-semibold">
                          requis
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Item facultatif */}
                <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                  <div
                    onClick={
                      !hasProject
                        ? () =>
                            projectRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                        : undefined
                    }
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                      hasProject
                        ? "bg-blue-50"
                        : "bg-slate-50 cursor-pointer hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                        hasProject
                          ? "bg-green-600 border-green-600"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {hasProject && (
                        <svg
                          className="h-2.5 w-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm ${hasProject ? "text-gray-400 line-through decoration-gray-300" : "text-slate-500"}`}
                    >
                      Réalisations (photos)
                    </span>
                    <span
                      className={`text-xs font-medium ${hasProject ? "text-blue-500" : "text-slate-400"}`}
                    >
                      {hasProject
                        ? `${projects.length} ajoutée${projects.length > 1 ? "s" : ""}`
                        : "recommandé"}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4">
                  {ficheIsComplete ? (
                    <Button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold gap-2"
                    >
                      Accéder à mon dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <p className="text-xs text-gray-400 leading-relaxed text-center">
                      Complétez ces 3 éléments pour activer votre fiche et
                      apparaître auprès des particuliers de votre zone.
                    </p>
                  )}
                </div>
              </div>

              {/* ══ BLOC 2 : Demandes ═══════════════════════════════════════ */}
              <div className="rounded-xl border border-orange-100 bg-white shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Demandes dans votre zone
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {leadsCount > 0 ? (
                      <>
                        <p className="text-sm font-semibold text-orange-900 leading-snug">
                          {leadsCount} particulier{leadsCount > 1 ? "s" : ""}{" "}
                          recherche{leadsCount > 1 ? "nt" : ""} un{" "}
                          {getProfessionLabel(
                            prospect.profession,
                          ).toLowerCase()}{" "}
                          autour de{" "}
                          {
                            (
                              prospect.selectedCity || prospect.postalCode
                            ).split(",")[0]
                          }
                        </p>
                        <p className="text-xs text-orange-600 mt-0.5">
                          Rayon {prospect.selectedZoneRadius} km
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-orange-900 leading-snug">
                        Des demandes arrivent chaque jour dans votre zone
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2">
                      <p className="text-xs text-slate-400 text-center">
                        {ficheIsComplete
                          ? "Votre fiche est prête — vous allez apparaître dans les résultats"
                          : "Complétez votre fiche pour accéder à ces demandes"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══ BLOC 3 : Témoignages — Carousel shadcn ═══════════════════ */}
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-5 overflow-hidden">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Ils utilisent Portail Habitat
                </p>

                <Carousel
                  opts={{ align: "start", loop: true }}
                  plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
                  className="w-full"
                >
                  <CarouselContent>
                    {TESTIMONIALS.map((t, i) => (
                      <CarouselItem key={i}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${t.color}`}>
                            {t.initial}
                          </div>
                          <div>
                            <div className="flex gap-0.5 mb-0.5">
                              {Array.from({ length: t.stars }).map((_, s) => (
                                <svg key={s} className="h-3.5 w-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400">{t.author} · {t.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA mobile fixé en bas ─────────────────────────────────────────── */}
      <div className="lg:hidden sticky bottom-0 z-20 bg-white border-t shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3">
        {ficheIsComplete ? (
          <Button
            onClick={() => setShowPasswordModal(true)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold gap-2 py-5"
          >
            <span>Accéder à mon dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Progress value={completionPercent} className="flex-1 h-2" />
            <p className="text-xs text-gray-500 flex-shrink-0">
              {completionPercent}%
            </p>
          </div>
        )}
      </div>

      {/* ── Modal mot de passe ─────────────────────────────────────────────── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Votre fiche est prête !
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Choisissez un mot de passe pour accéder à votre espace pro.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Email
                </Label>
                <Input
                  value={prospect.email}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <Label
                  htmlFor="pwd"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="pwd"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                    required
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="pwdConfirm"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="pwdConfirm"
                  type={showPwd ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Répétez votre mot de passe"
                  required
                />
              </div>

              {(passwordError || creationError) && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {passwordError || creationError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 text-base gap-2"
              >
                <span>Créer mon compte et accéder au dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Gratuit · Sans engagement · Sans carte bancaire
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
