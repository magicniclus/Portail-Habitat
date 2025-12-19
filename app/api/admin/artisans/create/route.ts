import { NextRequest, NextResponse } from "next/server";
import { auth, adminDb } from "@/lib/firebase-admin";

function generatePassword(length: number = 12): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function generateSlug(companyName: string, city: string, profession: string): string {
  const base = `${companyName}-${city}-${profession}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  return `${base}-${Date.now()}`;
}

type CreateArtisanBody = {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  siret?: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  coordinates: { lat: number; lng: number };
  profession: string;
  professions?: string[];
  description: string;
  services?: string[];
  privacy?: {
    profileVisible?: boolean;
    showPhone?: boolean;
    showEmail?: boolean;
    allowDirectContact?: boolean;
  };
};

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await auth.verifyIdToken(token);

    const adminUserDoc = await adminDb.collection("users").doc(decoded.uid).get();
    if (!adminUserDoc.exists || adminUserDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const body = (await request.json()) as Partial<CreateArtisanBody>;

    if (
      !body.companyName ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !body.city ||
      !body.postalCode ||
      !body.fullAddress ||
      !body.profession
    ) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const coordinates = body.coordinates && typeof body.coordinates.lat === "number" && typeof body.coordinates.lng === "number"
      ? body.coordinates
      : { lat: 0, lng: 0 };

    // Vérifier email déjà existant
    try {
      const existing = await auth.getUserByEmail(body.email);
      const artisanDoc = await adminDb.collection("artisans").doc(existing.uid).get();
      if (artisanDoc.exists) {
        return NextResponse.json(
          {
            error: "Un artisan existe déjà avec cet email",
            artisanId: existing.uid,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: "Un utilisateur existe déjà avec cet email",
          userId: existing.uid,
        },
        { status: 409 }
      );
    } catch {
      // ok
    }

    const generatedPassword = generatePassword();

    const userRecord = await auth.createUser({
      email: body.email,
      password: generatedPassword,
      displayName: `${body.firstName} ${body.lastName}`,
      emailVerified: true,
    });

    const slug = generateSlug(body.companyName, body.city, body.profession);

    const now = new Date();

    await adminDb.collection("users").doc(userRecord.uid).set({
      email: body.email,
      phone: body.phone,
      role: "artisan",
      createdAt: now,
      lastLoginAt: null,
      stripeCustomerId: null,
    });

    await adminDb.collection("artisans").doc(userRecord.uid).set({
      userId: userRecord.uid,
      companyName: body.companyName,
      slug,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      siret: body.siret || "",
      city: body.city,
      postalCode: body.postalCode,
      fullAddress: body.fullAddress,
      coordinates,
      profession: body.profession,
      professions: body.professions?.length ? body.professions : [body.profession],
      description: body.description || "",
      services: body.services || [],
      logoUrl: "",
      coverUrl: "",
      photos: [],
      hasPremiumSite: false,
      monthlySubscriptionPrice: 0,
      sitePricePaid: 0,
      subscriptionStatus: "canceled",
      stripeSubscriptionId: null,
      currentPeriodEnd: null,
      premiumFeatures: {
        isPremium: false,
        showTopArtisanBadge: false,
        bannerPhotos: [],
        premiumBenefits: [],
      },
      leadCountThisMonth: 0,
      totalLeads: 0,
      averageRating: 0,
      reviewCount: 0,
      hasSocialFeed: false,
      publishedPostsCount: 0,
      averageQuoteMin: null,
      averageQuoteMax: null,
      certifications: [],
      notifications: {
        emailLeads: true,
        emailReviews: true,
        emailMarketing: false,
        pushNotifications: true,
      },
      privacy: {
        profileVisible: body.privacy?.profileVisible ?? true,
        showPhone: body.privacy?.showPhone ?? true,
        showEmail: body.privacy?.showEmail ?? false,
        allowDirectContact: body.privacy?.allowDirectContact ?? true,
      },
      assignedLeads: [],
      analytics: {
        totalViews: 0,
        totalPhoneClicks: 0,
        totalFormSubmissions: 0,
        viewsThisMonth: 0,
        phoneClicksThisMonth: 0,
        formSubmissionsThisMonth: 0,
        lastViewedAt: null,
        updatedAt: now,
      },
      isPriority: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      artisanId: userRecord.uid,
      password: generatedPassword,
    });
  } catch (error) {
    console.error("Erreur création artisan (admin):", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
