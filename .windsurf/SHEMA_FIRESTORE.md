users
└── {userId} (Firebase Auth UID)
    ├── email
    ├── phone
    ├── role ("artisan" | "admin" | "prospect")
    ├── adminRole ("super_admin" | "content_admin" | "support_admin" | "stats_admin") ← seulement si role = "admin"
    ├── permissions [] ← permissions spécifiques ["manage_users", "manage_content", "view_stats", "moderate_reviews", "manage_system"]
    ├── createdAt
    ├── lastLoginAt
    └── stripeCustomerId

prospects (collection – tous les leads avant paiement)
└── {prospectId}
    ├── firstName
    ├── lastName
    ├── email
    ├── phone
    ├── profession
    ├── city
    ├── postalCode
    ├── department
    ├── coordinates { lat, lng }
    ├── selectedZoneRadius (30 | 50 | 100)  → km
    ├── funnelStep ("step1" | "step2" | "step3" | "abandoned" | "paid")
    ├── abandonedAt (timestamp)
    ├── utm_source / utm_medium / utm_campaign
    ├── searchesLast24h (int)   ← nombre de recherches dans sa zone + métier les dernières 24h
    ├── demandsLast30d (int)    ← nombre de demandes réelles dans sa zone + métier les 30 derniers jours
    ├── createdAt
    └── updatedAt

artisans
└── {artisanId} (document principal – 1 = 1 artisan)
    ├── userId (ref → users/{userId})
    ├── companyName
    ├── slug
    ├── firstName / lastName
    ├── phone
    ├── email
    ├── siret
    ├── city
    ├── postalCode
    ├── fullAddress
    ├── coordinates { lat, lng }
    ├── profession
    ├── professions []
    ├── description
    ├── services []
    ├── logoUrl
    ├── coverUrl
    ├── photos []
    ├── hasPremiumSite (true/false)
    ├── monthlySubscriptionPrice (int)
    ├── sitePricePaid (0 | 69 | 299)
    ├── subscriptionStatus ("active" | "canceled" | "past_due" | "trialing")
    ├── stripeSubscriptionId
    ├── currentPeriodEnd
    ├── leadCountThisMonth
    ├── totalLeads
    ├── averageRating
    ├── reviewCount
    ├── hasSocialFeed
    ├── publishedPostsCount
    ├── averageQuoteMin (int)    ← prix minimum d'un devis en euros
    ├── averageQuoteMax (int)    ← prix maximum d'un devis en euros
    ├── certifications []        ← certifications et labels (ex: ["RGE", "Qualibat", "Garantie décennale"])
    ├── notifications {          ← préférences de notifications (objet)
    │   ├── emailLeads: true     ← recevoir emails pour nouvelles demandes
    │   ├── emailReviews: true   ← recevoir emails pour nouveaux avis
    │   ├── emailMarketing: false ← recevoir emails marketing/newsletters
    │   └── pushNotifications: true ← notifications push navigateur
    │   }
    ├── privacy {                ← paramètres de confidentialité (objet)
    │   ├── profileVisible: true ← profil visible dans les recherches
    │   ├── showPhone: true      ← afficher le téléphone publiquement
    │   ├── showEmail: false     ← afficher l'email publiquement
    │   └── allowDirectContact: true ← autoriser contact direct sans formulaire
    │   }
    ├── createdAt
    ├── updatedAt
    └── isPriority (true/false)

    └── leads (sous-collection)
        └── {leadId}
            ├── clientName
            ├── clientPhone
            ├── clientEmail
            ├── projectType
            ├── city
            ├── budget
            ├── source ("main-form" | "mini-site" | "bought" | "priority")
            ├── status ("new" | "contacted" | "converted" | "lost")
            ├── createdAt
            └── notes

    └── reviews (sous-collection)
        └── {reviewId}
            ├── rating
            ├── comment
            ├── clientName
            ├── createdAt
            └── displayed

    └── posts/                     ← tous les chantiers publiés
        └── {postId}/
            ├── title                string
            ├── description          string
            ├── city                 string
            ├── projectType          string ex: "Rénovation salle de bain"
            ├── isPublished          boolean
            ├── isPubliclyVisible    boolean  ← validation artisan pour affichage public
            ├── createdAt            timestamp
            ├── photos               array<string>   ← URLs dans l'ordre choisi par l'artisan
            ├── likesCount           number
            ├── commentsCount        number

            └── likes/               ← sous-collection (facultatif si tu veux savoir qui a liké)
                └── {likeId} → userId ou IP + timestamp

            └── comments/            ← sous-collection
                └── {commentId}
                    ├── authorName   string (anonyme ou prénom)
                    ├── text         string
                    ├── createdAt    timestamp
                    ├── isApproved   boolean (modération si besoin)

payments
└── {paymentId}
    ├── artisanId (ref)
    ├── prospectId (ref)          ← pour lier au tunnel
    ├── amount
    ├── type ("subscription" | "site_one_time" | "premium_pack")
    ├── stripePaymentIntentId
    ├── status
    └── createdAt

posts (collection publique – mur global)
└── {postId} (seulement isPublished: true)

adminLogs
└── {logId}
    ├── action
    ├── artisanId
    ├── prospectId
    ├── adminId (ref → users/{userId})
    ├── adminRole ← rôle de l'admin qui a effectué l'action
    ├── details
    └── timestamp

stats
└── global (id = "global")
    ├── totalArtisans
    ├── activeSubscribers
    ├── mrr
    ├── sitesSold69
    ├── sitesSold129
    ├── sitesOffered
    ├── totalUpsellRevenue
    ├── leadsThisMonth
    ├── searchesToday
    ├── demandsLast30d
    ├── updatedAt

subscriptions (collection - pour tracking des abonnements)
└── {subscriptionId}
    ├── artisanId (ref → artisans/{artisanId})
    ├── userId (ref → users/{userId})
    ├── monthlyPrice (int) // 89, 129, etc.
    ├── status ("active" | "canceled" | "past_due" | "trialing")
    ├── stripeSubscriptionId
    ├── stripePriceId
    ├── currentPeriodStart
    ├── currentPeriodEnd
    ├── canceledAt (timestamp | null)
    ├── cancelReason (string | null)
    ├── createdAt
    └── updatedAt

estimations (collection - toutes les estimations générées par le simulateur)
└── {estimationId}
    ├── sessionId                    ← identifiant unique de session pour regrouper les tentatives
    ├── status ("draft" | "completed" | "sent")  ← statut de l'estimation
    
    // DONNÉES CLIENT
    ├── clientInfo {
    │   ├── firstName               ← prénom du client
    │   ├── phone                   ← téléphone
    │   ├── email                   ← email
    │   └── acceptsCGV              ← acceptation des CGV (boolean)
    │   }
    
    // LOCALISATION
    ├── location {
    │   ├── postalCode              ← code postal du projet
    │   ├── city                    ← ville
    │   ├── department              ← département (calculé automatiquement)
    │   └── coordinates { lat, lng } ← coordonnées géographiques
    │   }
    
    // PROJET
    ├── project {
    │   ├── propertyType            ← "Maison" | "Appartement" | "Local commercial"
    │   ├── prestationType          ← type de prestation (ex: "Rénovation salle de bain")
    │   ├── prestationSlug          ← slug de la prestation pour référence
    │   ├── surface                 ← surface en m² (si applicable)
    │   ├── prestationLevel         ← "low" | "mid" | "high" (économique/standard/premium)
    │   ├── existingState           ← "creation" | "renovation" | "good_condition"
    │   ├── timeline                ← "urgent" | "soon" | "later"
    │   └── specificAnswers {}      ← réponses aux questions spécifiques du questionnaire
    │   }
    
    // ESTIMATIONS CALCULÉES
    ├── pricing {
    │   ├── estimationLow           ← estimation basse (int, en euros)
    │   ├── estimationMedium        ← estimation moyenne (int, en euros)
    │   ├── estimationHigh          ← estimation haute (int, en euros)
    │   ├── calculationMethod       ← "ai" | "statistical" | "manual"
    │   ├── confidenceScore         ← score de confiance 0-100 (int)
    │   └── priceFactors []         ← facteurs ayant influencé le prix
    │   }
    
    // MÉTADONNÉES TECHNIQUES
    ├── metadata {
    │   ├── userAgent               ← navigateur utilisé
    │   ├── referrer                ← source de trafic
    │   ├── utm_source              ← source marketing
    │   ├── utm_medium              ← medium marketing
    │   ├── utm_campaign            ← campagne marketing
    │   ├── deviceType              ← "mobile" | "tablet" | "desktop"
    │   ├── ipAddress               ← adresse IP (pour géolocalisation)
    │   └── completionTime          ← temps pour compléter le simulateur (en secondes)
    │   }
    
    // SUIVI COMMERCIAL
    ├── leads {
    │   ├── artisansNotified []     ← liste des artisanIds notifiés
    │   ├── artisansInterested []   ← artisans ayant manifesté un intérêt
    │   ├── quotesReceived          ← nombre de devis reçus (int)
    │   ├── leadConverted           ← si le lead a été converti (boolean)
    │   └── conversionValue         ← valeur de la conversion (int, en euros)
    │   }
    
    // HORODATAGE
    ├── createdAt                   ← création de l'estimation
    ├── completedAt                 ← finalisation du simulateur
    ├── sentAt                      ← envoi par email
    └── updatedAt                   ← dernière modification

    // SOUS-COLLECTIONS
    └── interactions (sous-collection - pour tracker les interactions)
        └── {interactionId}
            ├── type                ← "email_sent" | "artisan_notified" | "quote_received" | "client_contacted"
            ├── artisanId           ← ID de l'artisan concerné (si applicable)
            ├── details {}          ← détails spécifiques à l'interaction
            ├── success             ← succès de l'action (boolean)
            └── timestamp           ← moment de l'interaction