import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '@/src/core/firebase';

const COLLECTION = 'reviews';

export interface Review {
  id: string;
  establishmentId: string;
  establishmentName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: any;
}

export const reviewService = {
  async getAll(): Promise<Review[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION);
      return [];
    }
  },

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, { status });
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
