import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Store, 
  Tags, 
  Star, 
  Users, 
  UserSquare2, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '@/src/core/hooks/useAuth';
import { auth } from '@/src/core/firebase';
import { signOut } from 'firebase/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'common.dashboard' },
  { path: '/establishments', icon: Store, labelKey: 'common.establishments' },
  { path: '/categories', icon: Tags, labelKey: 'common.categories' },
  { path: '/reviews', icon: Star, labelKey: 'common.reviews' },
  { path: '/users', icon: Users, labelKey: 'common.users' },
  { path: '/clients', icon: UserSquare2, labelKey: 'common.clients' },
  { path: '/settings', icon: Settings, labelKey: 'common.settings' },
];

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const isRtl = i18n.language === 'ar';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className={cn("min-h-screen bg-[#F4F5F7] flex", isRtl && "flex-row-reverse")}>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className={cn(
          "bg-dark-blue text-white flex-shrink-0 flex flex-col h-screen overflow-hidden transition-all z-50 sticky top-0",
          !sidebarOpen && "w-0"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-orange rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-xl text-white">M</span>
          </div>
          {sidebarOpen && <span className="font-bold text-xl font-display tracking-tight text-white">MABBITI</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "sidebar-nav-active" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium text-sm">{t(item.labelKey)}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>{t('common.logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm shadow-black/[0.02]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors lg:hidden text-gray-500"
            >
              {sidebarOpen ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary-orange animate-pulse" />
              <h2 className="font-semibold text-dark-blue font-display">
                {t('common.admin_panel')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-dark-blue leading-none">{user?.displayName || user?.email}</p>
              <p className="text-[10px] text-gray-400 capitalize font-bold tracking-wider mt-1">{role}</p>
            </div>
            <div className="relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="h-9 w-9 rounded-full border border-gray-100 shadow-sm" />
              ) : (
                <div className="h-9 w-9 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
