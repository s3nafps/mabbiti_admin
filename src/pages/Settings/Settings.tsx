import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/src/components/shared/PageHeader';
import { Globe, Shield, Database, Save, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/src/core/hooks/useAuth';
import firebaseConfig from '@/firebase-applet-config.json';
import toast from 'react-hot-toast';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { user, role } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    toast.success('Language updated');
  };

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile updated');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader title={t('common.settings')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-dark-blue">
        {/* Left Column - Navigation/Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 flex items-center gap-4 border-gray-100 shadow-xl shadow-black/[0.02]">
             <div className="h-16 w-16 rounded-2xl border-2 border-white bg-gray-50 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
               {user?.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : <UserIcon className="h-8 w-8 text-gray-300" />}
             </div>
             <div>
               <h3 className="font-bold text-dark-blue font-display">{user?.displayName || 'Admin'}</h3>
               <p className="text-[10px] text-gray-400 capitalize font-bold tracking-widest mt-0.5">{role}</p>
             </div>
          </div>

          <div className="glass-card overflow-hidden">
             <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
               <Database className="h-4 w-4 text-primary-orange" />
               Project Infrastructure
             </div>
             <div className="p-6 space-y-5">
                <div>
                   <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Project ID</label>
                   <div className="bg-gray-50 px-3 py-2 rounded-lg font-mono text-[11px] text-gray-500 border border-gray-100 truncate">
                    {firebaseConfig.projectId}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mb-1">Database ID</label>
                   <div className="bg-gray-50 px-3 py-2 rounded-lg font-mono text-[11px] text-gray-500 border border-gray-100 truncate">
                    {firebaseConfig.firestoreDatabaseId}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="glass-card p-8 border-gray-100">
            <div className="flex items-center gap-2 text-primary-orange mb-8 pb-4 border-b border-gray-50">
              <Globe className="h-5 w-5" />
              <h3 className="font-bold text-dark-blue font-display">Localization</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Display Language</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'fr', label: 'Français' },
                    { id: 'ar', label: 'العربية' }
                  ].map((lng) => (
                    <button
                      key={lng.id}
                      onClick={() => changeLanguage(lng.id)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-bold transition-all text-sm relative overflow-hidden group",
                        i18n.language === lng.id 
                          ? "bg-dark-blue text-white border-dark-blue shadow-lg shadow-dark-blue/20" 
                          : "bg-white text-gray-500 border-gray-100 hover:border-primary-orange hover:text-primary-orange"
                      )}
                    >
                      {lng.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="glass-card p-8 border-gray-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-8 pb-4 border-b border-gray-50">
              <Shield className="h-5 w-5" />
              <h3 className="font-bold text-dark-blue font-display">Security & Privacy</h3>
            </div>
            
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Display Name</label>
                    <input 
                      defaultValue={user?.displayName || ''}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                    <input 
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-3 bg-gray-100/50 border border-transparent rounded-xl text-gray-400 cursor-not-allowed text-sm font-medium italic"
                    />
                 </div>
               </div>
               
               <div className="pt-6 border-t border-gray-50 flex justify-end">
                 <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-dark-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-dark-blue/20"
                 >
                   {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                   Sync Changes
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
