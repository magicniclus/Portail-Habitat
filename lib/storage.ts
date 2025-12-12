import { storage, db } from './firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  doc, 
  updateDoc, 
  collection, 
  setDoc, 
  query, 
  orderBy, 
  getDocs, 
  getDoc, 
  deleteDoc 
} from 'firebase/firestore';

/**
 * Upload une photo de couverture pour un artisan
 * Suit le schéma: /artisans/{artisanId}/profile/cover.jpg
 */
export async function uploadCoverPhoto(artisanId: string, file: File): Promise<string> {
  try {
    // Créer la référence selon le schéma Storage
    const coverRef = ref(storage, `artisans/${artisanId}/profile/cover.jpg`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(coverRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Mettre à jour Firestore avec la nouvelle URL
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      coverUrl: downloadURL,
      updatedAt: new Date()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la couverture:', error);
    throw new Error('Impossible d\'uploader la photo de couverture');
  }
}

/**
 * Upload une photo de logo pour un artisan
 * Suit le schéma: /artisans/{artisanId}/profile/logo.jpg
 */
export async function uploadLogoPhoto(artisanId: string, file: File): Promise<string> {
  try {
    // Créer la référence selon le schéma Storage
    const logoRef = ref(storage, `artisans/${artisanId}/profile/logo.jpg`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(logoRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Mettre à jour Firestore avec la nouvelle URL
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      logoUrl: downloadURL,
      updatedAt: new Date()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du logo:', error);
    throw new Error('Impossible d\'uploader le logo');
  }
}

/**
 * Upload une photo dans la galerie générale
 * Suit le schéma: /artisans/{artisanId}/gallery/photo_{timestamp}.jpg
 */
export async function uploadGalleryPhoto(artisanId: string, file: File): Promise<string> {
  try {
    // Générer un nom unique avec timestamp
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `photo_${timestamp}.${extension}`;
    
    // Créer la référence selon le schéma Storage
    const photoRef = ref(storage, `artisans/${artisanId}/gallery/${fileName}`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(photoRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Mettre à jour Firestore - ajouter à l'array photos
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      photos: [...(await getArtisanPhotos(artisanId)), downloadURL],
      updatedAt: new Date()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo:', error);
    throw new Error('Impossible d\'uploader la photo');
  }
}

/**
 * Upload des photos pour un chantier/post
 * Suit le schéma: /artisans/{artisanId}/posts/{postId}/photo_{index}.jpg
 */
export async function uploadPostPhotos(artisanId: string, postId: string, files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `photo_${String(index + 1).padStart(3, '0')}.${extension}`;
      
      // Créer la référence selon le schéma Storage
      const photoRef = ref(storage, `artisans/${artisanId}/posts/${postId}/${fileName}`);
      
      // Upload du fichier
      const snapshot = await uploadBytes(photoRef, file);
      
      // Récupérer l'URL de téléchargement
      return await getDownloadURL(snapshot.ref);
    });
    
    const downloadURLs = await Promise.all(uploadPromises);
    
    // Mettre à jour Firestore avec les URLs des photos dans l'ordre
    const postRef = doc(db, 'artisans', artisanId, 'posts', postId);
    await updateDoc(postRef, {
      photos: downloadURLs,
      updatedAt: new Date()
    });
    
    return downloadURLs;
  } catch (error) {
    console.error('Erreur lors de l\'upload des photos du post:', error);
    throw new Error('Impossible d\'uploader les photos du chantier');
  }
}

/**
 * Supprimer une photo de couverture
 */
export async function deleteCoverPhoto(artisanId: string): Promise<void> {
  try {
    const coverRef = ref(storage, `artisans/${artisanId}/profile/cover.jpg`);
    await deleteObject(coverRef);
    
    // Mettre à jour Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      coverUrl: null,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la couverture:', error);
    throw new Error('Impossible de supprimer la photo de couverture');
  }
}

/**
 * Récupérer les photos actuelles d'un artisan
 */
async function getArtisanPhotos(artisanId: string): Promise<string[]> {
  try {
    // Cette fonction devrait récupérer les photos depuis Firestore
    // Pour l'instant, on retourne un array vide
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des photos:', error);
    return [];
  }
}

/**
 * Mettre à jour la description d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId} → description
 */
export async function updateArtisanDescription(artisanId: string, description: string): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      description: description,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la description:', error);
    throw new Error('Impossible de mettre à jour la description');
  }
}

/**
 * Mettre à jour le nom de l'entreprise d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId} → companyName
 */
export async function updateArtisanCompanyName(artisanId: string, companyName: string): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      companyName: companyName,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom de l\'entreprise:', error);
    throw new Error('Impossible de mettre à jour le nom de l\'entreprise');
  }
}

/**
 * Mettre à jour les prestations d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId} → professions
 */
export async function updateArtisanPrestations(artisanId: string, prestations: string[]): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      professions: prestations,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des prestations:', error);
    throw new Error('Impossible de mettre à jour les prestations');
  }
}

/**
 * Mettre à jour le range de prix des devis d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId} → averageQuoteMin, averageQuoteMax
 */
export async function updateArtisanQuoteRange(artisanId: string, min: number, max: number): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      averageQuoteMin: min,
      averageQuoteMax: max,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des prix:', error);
    throw new Error('Impossible de mettre à jour les prix');
  }
}

/**
 * Mettre à jour les certifications d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId} → certifications
 */
export async function updateArtisanCertifications(artisanId: string, certifications: string[]): Promise<void> {
  try {
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      certifications: certifications,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des certifications:', error);
    throw new Error('Impossible de mettre à jour les certifications');
  }
}

/**
 * Ajouter un nouveau projet/post pour un artisan
 * Suit le schéma Firestore: artisans/{artisanId}/posts/{postId}
 * Suit le schéma Storage: /artisans/{artisanId}/projects/{postId}/
 */
export async function addArtisanProject(
  artisanId: string,
  projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    photos: File[];
  }
): Promise<string> {
  try {
    // Créer une référence pour le nouveau post
    const postsRef = collection(db, 'artisans', artisanId, 'posts');
    const newPostRef = doc(postsRef);
    const postId = newPostRef.id;

    // Upload des photos
    const photoUrls: string[] = [];
    for (let i = 0; i < projectData.photos.length; i++) {
      const file = projectData.photos[i];
      const fileName = `photo_${i + 1}_${Date.now()}.${file.name.split('.').pop()}`;
      const photoPath = `artisans/${artisanId}/projects/${postId}/${fileName}`;
      
      const photoRef = ref(storage, photoPath);
      await uploadBytes(photoRef, file);
      const photoUrl = await getDownloadURL(photoRef);
      photoUrls.push(photoUrl);
    }

    // Créer le document post
    await setDoc(newPostRef, {
      title: projectData.title,
      description: projectData.description,
      city: projectData.city,
      projectType: projectData.projectType,
      isPublished: true,
      isPubliclyVisible: projectData.isPubliclyVisible,
      photos: photoUrls,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date()
    });

    return postId;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error);
    throw new Error('Impossible d\'ajouter le projet');
  }
}

/**
 * Récupérer tous les projets d'un artisan
 * Suit le schéma Firestore: artisans/{artisanId}/posts/
 */
export async function getArtisanProjects(artisanId: string): Promise<any[]> {
  try {
    const postsRef = collection(db, 'artisans', artisanId, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    throw new Error('Impossible de récupérer les projets');
  }
}

/**
 * Mettre à jour la visibilité publique d'un projet
 * Suit le schéma Firestore: artisans/{artisanId}/posts/{postId} → isPubliclyVisible
 */
export async function updateProjectVisibility(
  artisanId: string, 
  postId: string, 
  isPubliclyVisible: boolean
): Promise<void> {
  try {
    const postRef = doc(db, 'artisans', artisanId, 'posts', postId);
    await updateDoc(postRef, {
      isPubliclyVisible: isPubliclyVisible,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la visibilité:', error);
    throw new Error('Impossible de mettre à jour la visibilité');
  }
}

/**
 * Modifier un projet existant
 * Suit le schéma Firestore: artisans/{artisanId}/posts/{postId}
 * Suit le schéma Storage: /artisans/{artisanId}/projects/{postId}/
 */
export async function updateArtisanProject(
  artisanId: string,
  postId: string,
  projectData: {
    title: string;
    description: string;
    city: string;
    projectType: string;
    isPubliclyVisible: boolean;
    newPhotos: File[];
    existingPhotos: string[];
  }
): Promise<void> {
  try {
    const postRef = doc(db, 'artisans', artisanId, 'posts', postId);
    
    // Upload des nouvelles photos
    const newPhotoUrls: string[] = [];
    for (let i = 0; i < projectData.newPhotos.length; i++) {
      const file = projectData.newPhotos[i];
      const fileName = `photo_${Date.now()}_${i + 1}.${file.name.split('.').pop()}`;
      const photoPath = `artisans/${artisanId}/projects/${postId}/${fileName}`;
      
      const photoRef = ref(storage, photoPath);
      await uploadBytes(photoRef, file);
      const photoUrl = await getDownloadURL(photoRef);
      newPhotoUrls.push(photoUrl);
    }

    // Combiner les photos existantes et nouvelles
    const allPhotos = [...projectData.existingPhotos, ...newPhotoUrls];

    // Mettre à jour le document
    await updateDoc(postRef, {
      title: projectData.title,
      description: projectData.description,
      city: projectData.city,
      projectType: projectData.projectType,
      isPubliclyVisible: projectData.isPubliclyVisible,
      photos: allPhotos,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la modification du projet:', error);
    throw new Error('Impossible de modifier le projet');
  }
}

/**
 * Supprimer un projet et ses photos
 * Suit le schéma Firestore: artisans/{artisanId}/posts/{postId}
 * Suit le schéma Storage: /artisans/{artisanId}/projects/{postId}/
 */
export async function deleteArtisanProject(artisanId: string, postId: string): Promise<void> {
  try {
    // Récupérer le projet pour obtenir les URLs des photos
    const postRef = doc(db, 'artisans', artisanId, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (postDoc.exists()) {
      const postData = postDoc.data();
      
      // Supprimer les photos du Storage
      if (postData.photos && postData.photos.length > 0) {
        for (const photoUrl of postData.photos) {
          try {
            const photoRef = ref(storage, photoUrl);
            await deleteObject(photoRef);
          } catch (error) {
            console.warn('Erreur lors de la suppression de la photo:', error);
          }
        }
      }
    }

    // Supprimer le document Firestore
    await deleteDoc(postRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    throw new Error('Impossible de supprimer le projet');
  }
}

/**
 * Valider un fichier image
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Le fichier est trop volumineux. Taille maximale : 5MB.'
    };
  }
  
  return { isValid: true };
}

/**
 * Upload des photos de bannière premium pour un artisan
 * Suit le schéma: /artisans/{artisanId}/premium/banner_photos/banner_001.jpg à banner_005.jpg
 */
export async function uploadPremiumBannerPhotos(artisanId: string, files: File[]): Promise<string[]> {
  try {
    if (files.length === 0) {
      throw new Error('Aucun fichier à uploader');
    }

    if (files.length > 5) {
      throw new Error('Maximum 5 photos de bannière autorisées');
    }

    // Valider tous les fichiers
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
    }

    const uploadPromises = files.map(async (file, index) => {
      // Créer la référence selon le schéma Storage
      const bannerRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/banner_${String(index + 1).padStart(3, '0')}.jpg`);
      
      // Upload du fichier
      const snapshot = await uploadBytes(bannerRef, file);
      
      // Récupérer l'URL de téléchargement
      return await getDownloadURL(snapshot.ref);
    });

    // Attendre tous les uploads
    const downloadURLs = await Promise.all(uploadPromises);

    // Mettre à jour Firestore avec les nouvelles URLs
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': downloadURLs,
      updatedAt: new Date()
    });

    return downloadURLs;
  } catch (error) {
    console.error('Erreur lors de l\'upload des photos de bannière premium:', error);
    throw error;
  }
}

/**
 * Ajouter une photo de bannière premium (jusqu'à 5 max)
 */
export async function addPremiumBannerPhoto(artisanId: string, file: File): Promise<string[]> {
  try {
    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Récupérer les photos existantes
    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);
    const existingPhotos = artisanDoc.data()?.premiumFeatures?.bannerPhotos || [];

    if (existingPhotos.length >= 5) {
      throw new Error('Maximum 5 photos de bannière autorisées');
    }

    // Déterminer l'index de la nouvelle photo
    const newIndex = existingPhotos.length;
    
    // Créer la référence selon le schéma Storage
    const bannerRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/banner_${String(newIndex + 1).padStart(3, '0')}.jpg`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(bannerRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Ajouter à la liste existante
    const updatedPhotos = [...existingPhotos, downloadURL];

    // Mettre à jour Firestore
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': updatedPhotos,
      updatedAt: new Date()
    });

    return updatedPhotos;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo de bannière premium:', error);
    throw error;
  }
}

/**
 * Remplacer une photo de bannière premium spécifique
 */
export async function replacePremiumBannerPhoto(artisanId: string, photoIndex: number, file: File): Promise<string[]> {
  try {
    // Valider le fichier
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Récupérer les photos existantes
    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);
    const existingPhotos = artisanDoc.data()?.premiumFeatures?.bannerPhotos || [];

    if (photoIndex < 0 || photoIndex >= existingPhotos.length) {
      throw new Error('Index de photo invalide');
    }

    // Créer la référence selon le schéma Storage (même nom de fichier)
    const bannerRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/banner_${String(photoIndex + 1).padStart(3, '0')}.jpg`);
    
    // Upload du nouveau fichier (remplace l'ancien)
    const snapshot = await uploadBytes(bannerRef, file);
    
    // Récupérer l'URL de téléchargement avec timestamp pour forcer le rechargement
    const baseURL = await getDownloadURL(snapshot.ref);
    const downloadURL = `${baseURL}?t=${Date.now()}`;

    // Remplacer dans la liste
    const updatedPhotos = [...existingPhotos];
    updatedPhotos[photoIndex] = downloadURL;

    // Mettre à jour Firestore
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': updatedPhotos,
      updatedAt: new Date()
    });

    return updatedPhotos;
  } catch (error) {
    console.error('Erreur lors du remplacement de la photo de bannière premium:', error);
    throw error;
  }
}

/**
 * Supprimer une photo de bannière premium
 */
export async function removePremiumBannerPhoto(artisanId: string, photoIndex: number): Promise<string[]> {
  try {
    // Récupérer les photos existantes
    const artisanRef = doc(db, 'artisans', artisanId);
    const artisanDoc = await getDoc(artisanRef);
    const existingPhotos = artisanDoc.data()?.premiumFeatures?.bannerPhotos || [];

    if (photoIndex < 0 || photoIndex >= existingPhotos.length) {
      throw new Error('Index de photo invalide');
    }

    // Supprimer le fichier du Storage
    const bannerRef = ref(storage, `artisans/${artisanId}/premium/banner_photos/banner_${String(photoIndex + 1).padStart(3, '0')}.jpg`);
    try {
      await deleteObject(bannerRef);
    } catch (error) {
      console.warn('Fichier déjà supprimé ou inexistant:', error);
    }

    // Retirer de la liste
    const updatedPhotos = existingPhotos.filter((_: string, index: number) => index !== photoIndex);

    // Mettre à jour Firestore
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerPhotos': updatedPhotos,
      updatedAt: new Date()
    });

    return updatedPhotos;
  } catch (error) {
    console.error('Erreur lors de la suppression de la photo de bannière premium:', error);
    throw error;
  }
}

/**
 * Valider un fichier vidéo
 */
function validateVideoFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format de vidéo non supporté. Utilisez MP4, WebM ou OGG.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Le fichier vidéo est trop volumineux. Taille maximale : 50MB.'
    };
  }

  return { isValid: true };
}

/**
 * Ajouter ou remplacer la vidéo de bannière premium
 */
export async function uploadBannerVideo(artisanId: string, file: File): Promise<string> {
  try {
    // Valider le fichier
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Créer la référence selon le schéma Storage
    const videoRef = ref(storage, `artisans/${artisanId}/premium/banner_video/banner_video.mp4`);
    
    // Upload du fichier
    const snapshot = await uploadBytes(videoRef, file);
    
    // Récupérer l'URL de téléchargement
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Mettre à jour Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerVideo': downloadURL,
      updatedAt: new Date()
    });

    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload de la vidéo de bannière:', error);
    throw error;
  }
}

/**
 * Supprimer la vidéo de bannière premium
 */
export async function removeBannerVideo(artisanId: string): Promise<void> {
  try {
    // Supprimer le fichier du Storage
    const videoRef = ref(storage, `artisans/${artisanId}/premium/banner_video/banner_video.mp4`);
    await deleteObject(videoRef);

    // Mettre à jour Firestore
    const artisanRef = doc(db, 'artisans', artisanId);
    await updateDoc(artisanRef, {
      'premiumFeatures.bannerVideo': null,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo de bannière:', error);
    throw error;
  }
}
