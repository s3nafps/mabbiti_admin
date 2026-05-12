import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/core/firebase';

const CATEGORIES = [
  { id: 'hotels', name: { en: 'Hotels', fr: 'Hôtels', ar: 'فنادق' }, iconName: 'Hotel' },
  { id: 'restaurants', name: { en: 'Restaurants', fr: 'Restaurants', ar: 'مطاعم' }, iconName: 'Utensils' },
  { id: 'cafes', name: { en: 'Cafes', fr: 'Cafés', ar: 'مقاهي' }, iconName: 'Coffee' },
  { id: 'tourism', name: { en: 'Tourism', fr: 'Tourisme', ar: 'سياحة' }, iconName: 'Compass' },
];

const ESTABLISHMENTS = [
  {
    id: '1',
    title: 'Hôtel Sheraton Club des Pins',
    description: 'Luxury hotel on the coast of Algiers.',
    categoryId: 'hotels',
    phone: '+213 21 37 77 77',
    email: 'sheraton.algiers@marriott.com',
    wilaya: 'Algiers',
    commune: 'Staoueli',
    address: 'Club des Pins BP 62, Algiers',
    latitude: 36.7583,
    longitude: 2.8464,
    media: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
    status: 'active',
    rating: 4.5,
    reviewCount: 450,
  },
  {
    id: '2',
    title: 'Restaurant Le Tajine',
    description: 'Traditional Algerian cuisine.',
    categoryId: 'restaurants',
    phone: '+213 550 12 34 56',
    email: 'contact@letajine.dz',
    wilaya: 'Oran',
    commune: 'Oran',
    address: '12 Rue Front de Mer, Oran',
    latitude: 35.7031,
    longitude: -0.6408,
    media: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
    status: 'active',
    rating: 4.8,
    reviewCount: 120,
  }
];

const REVIEWS = [
  {
    id: 'r1',
    establishmentId: '1',
    establishmentName: 'Hôtel Sheraton Club des Pins',
    userId: 'u1',
    userName: 'Amine Bensmail',
    rating: 5,
    comment: 'Excellent service and beautiful view!',
    status: 'approved',
  },
  {
    id: 'r2',
    establishmentId: '2',
    establishmentName: 'Restaurant Le Tajine',
    userId: 'u2',
    userName: 'Sarah Oranaise',
    rating: 3,
    comment: 'Food was good but the service was slow.',
    status: 'pending',
  }
];

export const seedDatabase = async () => {
  console.log('Starting seeding...');
  
  try {
    // Seed Categories
    for (const cat of CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), {
        name: cat.name,
        iconName: cat.iconName
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `categories/${cat.id}`));
    }

    // Seed Establishments
    for (const est of ESTABLISHMENTS) {
      const { id, ...data } = est;
      await setDoc(doc(db, 'establishments', id), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `establishments/${id}`));
    }

    // Seed Reviews
    for (const rev of REVIEWS) {
      const { id, ...data } = rev;
      await setDoc(doc(db, 'reviews', id), {
        ...data,
        createdAt: serverTimestamp(),
      }).catch(err => handleFirestoreError(err, OperationType.WRITE, `reviews/${id}`));
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};
