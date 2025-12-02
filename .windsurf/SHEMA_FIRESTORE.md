users
└── {userId} (Firebase Auth UID)
    ├── email
    ├── phone
    ├── role ("artisan" | "admin" | "prospect")
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

    └── posts (sous-collection – chantiers publiés)
        └── {postId}
            ├── title
            ├── description
            ├── city
            ├── profession
            ├── projectType
            ├── beforeAfter []
            ├── otherPhotos []
            ├── isPublished
            ├── likesCount
            ├── commentsCount
            ├── sharesCount
            ├── createdAt
            └── updatedAt

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
    ├── adminId
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