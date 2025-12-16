/**
 * Migration Firestore pour ajouter les champs nécessaires aux upgrades Premium
 * À exécuter une seule fois pour adapter le schéma existant
 */

import { adminDb } from './firebase-admin';

interface ArtisanUpdateData {
  currentPlan?: 'basic' | 'premium' | 'premium_plus';
  stripePriceId?: string;
  cancelAtPeriodEnd?: boolean;
  updatedAt: Date;
  [key: string]: any;
}

interface SubscriptionUpdateData {
  cancelAtPeriodEnd?: boolean;
  trialEnd?: Date | null;
  updatedAt: Date;
  [key: string]: any;
}

export async function migrateArtisansForUpgrades() {
  console.log('🚀 Migration des artisans pour les upgrades Premium...');

  try {
    const artisansRef = adminDb.collection('artisans');
    const snapshot = await artisansRef.get();

    let migratedCount = 0;
    let skippedCount = 0;

    for (const doc of snapshot.docs) {
      const artisanData = doc.data();
      const updateData: ArtisanUpdateData = {
        updatedAt: new Date()
      };

      let needsUpdate = false;

      // 1. Ajouter currentPlan si manquant
      if (!artisanData.currentPlan) {
        // Déterminer le plan basé sur monthlySubscriptionPrice
        const monthlyPrice = artisanData.monthlySubscriptionPrice || 69;
        if (monthlyPrice >= 199) {
          updateData.currentPlan = 'premium_plus';
        } else if (monthlyPrice >= 129) {
          updateData.currentPlan = 'premium';
        } else {
          updateData.currentPlan = 'basic';
        }
        needsUpdate = true;
        console.log(`📝 Artisan ${doc.id}: currentPlan défini à ${updateData.currentPlan}`);
      }

      // 2. Ajouter stripePriceId si manquant
      if (!artisanData.stripePriceId) {
        const monthlyPrice = artisanData.monthlySubscriptionPrice || 69;
        if (monthlyPrice >= 199) {
          updateData.stripePriceId = 'price_premium_199'; // À remplacer par le vrai ID
        } else if (monthlyPrice >= 129) {
          updateData.stripePriceId = 'price_premium_129'; // À remplacer par le vrai ID
        } else {
          updateData.stripePriceId = 'price_basic_69'; // À remplacer par le vrai ID
        }
        needsUpdate = true;
        console.log(`📝 Artisan ${doc.id}: stripePriceId défini à ${updateData.stripePriceId}`);
      }

      // 3. Ajouter cancelAtPeriodEnd si manquant
      if (artisanData.cancelAtPeriodEnd === undefined) {
        updateData.cancelAtPeriodEnd = false;
        needsUpdate = true;
        console.log(`📝 Artisan ${doc.id}: cancelAtPeriodEnd défini à false`);
      }

      // 4. Mettre à jour si nécessaire
      if (needsUpdate) {
        await doc.ref.update(updateData);
        migratedCount++;
        console.log(`✅ Artisan ${doc.id} migré`);
      } else {
        skippedCount++;
        console.log(`⏭️ Artisan ${doc.id} déjà à jour`);
      }
    }

    console.log(`\n📊 RÉSUMÉ MIGRATION ARTISANS:`);
    console.log(`✅ Migrés: ${migratedCount}`);
    console.log(`⏭️ Ignorés: ${skippedCount}`);
    console.log(`📋 Total: ${snapshot.size}`);

  } catch (error) {
    console.error('❌ Erreur migration artisans:', error);
    throw error;
  }
}

export async function migrateSubscriptionsForUpgrades() {
  console.log('🚀 Migration des subscriptions pour les upgrades Premium...');

  try {
    const subscriptionsRef = adminDb.collection('subscriptions');
    const snapshot = await subscriptionsRef.get();

    let migratedCount = 0;
    let skippedCount = 0;

    for (const doc of snapshot.docs) {
      const subscriptionData = doc.data();
      const updateData: SubscriptionUpdateData = {
        updatedAt: new Date()
      };

      let needsUpdate = false;

      // 1. Ajouter cancelAtPeriodEnd si manquant
      if (subscriptionData.cancelAtPeriodEnd === undefined) {
        updateData.cancelAtPeriodEnd = false;
        needsUpdate = true;
        console.log(`📝 Subscription ${doc.id}: cancelAtPeriodEnd défini à false`);
      }

      // 2. Ajouter trialEnd si manquant (pour les futurs trials)
      if (subscriptionData.trialEnd === undefined) {
        updateData.trialEnd = null;
        needsUpdate = true;
        console.log(`📝 Subscription ${doc.id}: trialEnd défini à null`);
      }

      // 3. Mettre à jour si nécessaire
      if (needsUpdate) {
        await doc.ref.update(updateData);
        migratedCount++;
        console.log(`✅ Subscription ${doc.id} migrée`);
      } else {
        skippedCount++;
        console.log(`⏭️ Subscription ${doc.id} déjà à jour`);
      }
    }

    console.log(`\n📊 RÉSUMÉ MIGRATION SUBSCRIPTIONS:`);
    console.log(`✅ Migrées: ${migratedCount}`);
    console.log(`⏭️ Ignorées: ${skippedCount}`);
    console.log(`📋 Total: ${snapshot.size}`);

  } catch (error) {
    console.error('❌ Erreur migration subscriptions:', error);
    throw error;
  }
}

export async function runFullMigration() {
  console.log('🚀 MIGRATION COMPLÈTE POUR UPGRADES PREMIUM');
  console.log('==========================================\n');

  try {
    // 1. Migrer les artisans
    await migrateArtisansForUpgrades();
    console.log('\n');

    // 2. Migrer les subscriptions
    await migrateSubscriptionsForUpgrades();
    console.log('\n');

    console.log('✅ MIGRATION TERMINÉE AVEC SUCCÈS!');
    console.log('🔧 N\'oubliez pas de:');
    console.log('   1. Remplacer les stripePriceId par les vrais IDs Stripe');
    console.log('   2. Tester les webhooks Stripe');
    console.log('   3. Vérifier l\'API d\'upgrade');

  } catch (error) {
    console.error('💥 ERREUR MIGRATION:', error);
    throw error;
  }
}

// Fonction utilitaire pour mettre à jour les stripePriceId avec les vrais IDs
export async function updateStripePriceIds(priceMapping: Record<string, string>) {
  console.log('🔧 Mise à jour des stripePriceId avec les vrais IDs Stripe...');

  try {
    const artisansRef = adminDb.collection('artisans');
    const snapshot = await artisansRef.get();

    let updatedCount = 0;

    for (const doc of snapshot.docs) {
      const artisanData = doc.data();
      const currentPriceId = artisanData.stripePriceId;

      if (currentPriceId && priceMapping[currentPriceId]) {
        await doc.ref.update({
          stripePriceId: priceMapping[currentPriceId],
          updatedAt: new Date()
        });
        updatedCount++;
        console.log(`✅ Artisan ${doc.id}: ${currentPriceId} → ${priceMapping[currentPriceId]}`);
      }
    }

    console.log(`\n📊 MISE À JOUR TERMINÉE:`);
    console.log(`✅ Artisans mis à jour: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Erreur mise à jour stripePriceId:', error);
    throw error;
  }
}
