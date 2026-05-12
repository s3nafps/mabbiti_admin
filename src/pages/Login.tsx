import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/src/core/firebase';
import { useAuthStore } from '@/src/core/hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      await checkAdminRole(userCredential.user.uid);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Ensure we always use the auth instance from our core config
      const result = await signInWithPopup(auth, provider);
      await checkAdminRole(result.user.uid);
    } catch (error: any) {
      console.error('Google Login Error:', error);
      if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please ensure you are not blocking popups or check your internet connection. Also, make sure to open the application in a new tab if you are in the preview.', { duration: 6000 });
      } else if (error.code === 'auth/popup-blocked') {
        toast.error('Login popup was blocked by your browser.');
      } else {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  const checkAdminRole = async (uid: string) => {
    const { setRole } = useAuthStore.getState();
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      let role = userDoc.data()?.role;

      // Force admin role for the specific user
      if (auth.currentUser?.email === 'mohamedsenator5@gmail.com') {
        role = 'admin';
        // Bootstrap/Update admin if needed
        if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
          const { setDoc, serverTimestamp } = await import('firebase/firestore');
          await setDoc(doc(db, 'users', uid), {
            displayName: auth.currentUser.displayName || 'Admin',
            email: auth.currentUser.email,
            role: 'admin',
            isActive: true,
            photoURL: auth.currentUser.photoURL || '',
            createdAt: userDoc.exists() ? userDoc.data()?.createdAt : serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }

      if (role === 'admin' || role === 'moderator') {
        setRole(role);
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Access denied. Administrator only.');
        await auth.signOut();
        setLoading(false);
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        toast.error('Permission denied by security rules.');
      } else {
        toast.error('Error checking permissions: ' + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 border-gray-100 shadow-xl shadow-dark-blue/5">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-dark-blue">Welcome back</h2>
        <p className="text-sm text-gray-400 mt-1">Please enter your details to sign in</p>
      </div>
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <input
              {...register('email')}
              type="email"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm"
              placeholder="admin@mabbiti.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
            <input
              {...register('password')}
              type="password"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider mt-1.5">{errors.password.message}</p>}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary-orange hover:bg-primary-orange/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-orange/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Log In to Dashboard'}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="px-3 bg-white text-gray-400">Secure entry</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 border border-gray-100 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-bold text-sm text-dark-blue active:scale-[0.98]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
