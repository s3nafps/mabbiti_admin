import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/src/core/firebase';

interface AuthState {
  user: User | null;
  role: 'admin' | 'moderator' | 'user' | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: 'admin' | 'moderator' | 'user' | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}));

export const initAuth = () => {
  const { setUser, setRole, setLoading, setInitialized } = useAuthStore.getState();

  onAuthStateChanged(auth, async (user) => {
    setLoading(true);
    if (user) {
      setUser(user);
      // Fetch role from Firestore
      try {
        let role: any = 'user';
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          role = userDoc.data().role as any;
        }

        const adminEmails = ['mohamedsenator5@gmail.com', 'brardadz0531@gmail.com'];
        if (adminEmails.includes(user.email || '')) {
          role = 'admin';
        }
        setRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      }
    } else {
      setUser(null);
      setRole(null);
    }
    setLoading(false);
    setInitialized(true);
  });
};
