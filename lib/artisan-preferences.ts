// Utilitaires pour gérer les préférences des artisans

export interface NotificationPreferences {
  emailLeads: boolean;
  emailReviews: boolean;
  emailMarketing: boolean;
  pushNotifications: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  showPhone: boolean;
  showEmail: boolean;
  allowDirectContact: boolean;
}

export interface ArtisanPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

// Valeurs par défaut pour les notifications
export const defaultNotifications: NotificationPreferences = {
  emailLeads: true,        // Recevoir emails pour nouvelles demandes
  emailReviews: true,      // Recevoir emails pour nouveaux avis
  emailMarketing: false,   // Recevoir emails marketing/newsletters
  pushNotifications: true  // Notifications push navigateur
};

// Valeurs par défaut pour la confidentialité
export const defaultPrivacy: PrivacySettings = {
  profileVisible: true,     // Profil visible dans les recherches
  showPhone: true,         // Afficher le téléphone publiquement
  showEmail: false,        // Afficher l'email publiquement (false par défaut)
  allowDirectContact: true // Autoriser contact direct sans formulaire
};

// Fonction pour obtenir les préférences par défaut d'un nouvel artisan
export function getDefaultArtisanPreferences(): ArtisanPreferences {
  return {
    notifications: { ...defaultNotifications },
    privacy: { ...defaultPrivacy }
  };
}

// Fonction pour valider les préférences de notifications
export function validateNotificationPreferences(notifications: any): NotificationPreferences {
  return {
    emailLeads: notifications?.emailLeads ?? defaultNotifications.emailLeads,
    emailReviews: notifications?.emailReviews ?? defaultNotifications.emailReviews,
    emailMarketing: notifications?.emailMarketing ?? defaultNotifications.emailMarketing,
    pushNotifications: notifications?.pushNotifications ?? defaultNotifications.pushNotifications
  };
}

// Fonction pour valider les paramètres de confidentialité
export function validatePrivacySettings(privacy: any): PrivacySettings {
  return {
    profileVisible: privacy?.profileVisible ?? defaultPrivacy.profileVisible,
    showPhone: privacy?.showPhone ?? defaultPrivacy.showPhone,
    showEmail: privacy?.showEmail ?? defaultPrivacy.showEmail,
    allowDirectContact: privacy?.allowDirectContact ?? defaultPrivacy.allowDirectContact
  };
}

// Fonction pour obtenir les préférences complètes avec fallback
export function getArtisanPreferencesWithDefaults(artisanData: any): ArtisanPreferences {
  return {
    notifications: validateNotificationPreferences(artisanData?.notifications),
    privacy: validatePrivacySettings(artisanData?.privacy)
  };
}
