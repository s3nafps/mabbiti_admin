import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/core/firebase';

const COLLECTION = 'establishments';

export interface Establishment {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  phone: string;
  email: string;
  wilaya: string;
  commune: string;
  address: string;
  latitude: number;
  longitude: number;
  media: string[];
  status: 'active' | 'inactive';
  rating: number;
  reviewCount: number;
  createdAt: any;
  updatedAt: any;
}

export const establishmentService = {
  async getAll(): Promise<Establishment[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Establishment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION);
      return [];
    }
  },

  async getById(id: string): Promise<Establishment | null> {
    try {
      const docRef = doc(db, COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Establishment;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION}/${id}`);
      return null;
    }
  },

  async create(data: Omit<Establishment, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION);
      return '';
    }
  },

  async update(id: string, data: Partial<Establishment>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    }
  }
};
