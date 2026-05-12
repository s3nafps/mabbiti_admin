import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/core/firebase';

const COLLECTION = 'categories';

export interface Category {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  iconName: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('name.en', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION);
      return [];
    }
  },

  async save(id: string, data: Omit<Category, 'id'>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id || data.name.en.toLowerCase().replace(/\s+/g, '-'));
      await setDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
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
