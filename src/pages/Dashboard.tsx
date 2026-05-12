import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Store, 
  Users as UsersIcon, 
  Star, 
  Tags,
  Database,
  Loader2
} from 'lucide-react';
import StatCard from '@/src/components/stats/StatCard';
import VisitsChart from '@/src/components/charts/VisitsChart';
import ImageViewsChart from '@/src/components/charts/ImageViewsChart';
import CTAChart from '@/src/components/charts/CTAChart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { seedDatabase } from '@/src/services/seed.service';
import { toast } from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const MOCK_VISITS = [
  { name: 'Kardash', visits: 1200 },
  { name: 'Sheraton', visits: 900 },
  { name: 'Makam', visits: 1500 },
  { name: 'Zianides', visits: 700 },
  { name: 'Renaissance', visits: 1100 },
];

const MOCK_VIEWS = [
  { date: '01/05', views: 400 },
  { date: '02/05', views: 300 },
  { date: '03/05', views: 600 },
  { date: '04/05', views: 800 },
  { date: '05/05', views: 500 },
  { date: '06/05', views: 900 },
  { date: '07/05', views: 1000 },
];

const MOCK_CTA = [
  { name: 'Call', value: 400 },
  { name: 'Route', value: 300 },
  { name: 'Email', value: 100 },
  { name: 'Favorite', value: 200 },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'realtime' | 'day' | 'month' | 'year'>('realtime');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast.success('Database seeded successfully!');
      // Reload to see data
      window.location.reload();
    } catch (error) {
      toast.error('Seeding failed');
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-dark-blue">{t('dashboard.title')}</h1>
        <button
          onClick={handleSeed}
          disabled={isSeeding}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-blue text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 w-full sm:w-auto"
        >
          {isSeeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          {isSeeding ? 'Seeding...' : 'Seed Real Data'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('dashboard.totalEstablishments')} 
          value={124} 
          icon={<Store className="h-6 w-6 text-primary-orange" />}
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title={t('dashboard.totalUsers')} 
          value="1.2k" 
          icon={<UsersIcon className="h-6 w-6 text-dark-blue" />}
          trend={{ value: 8, isUp: true }}
        />
        <StatCard 
          title={t('dashboard.totalReviews')} 
          value="3.4k" 
          icon={<Star className="h-6 w-6 text-yellow-500" />}
          trend={{ value: 4, isUp: false }}
        />
        <StatCard 
          title={t('dashboard.activeCategories')} 
          value={18} 
          icon={<Tags className="h-6 w-6 text-indigo-500" />}
        />
      </div>

      {/* Tabs */}
      <div className="glass-card p-1 inline-flex flex-wrap gap-1 border-gray-200/50 w-full sm:w-auto overflow-x-auto">
        {(['realtime', 'day', 'month', 'year'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 sm:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 sm:flex-none",
              activeTab === tab 
                ? "bg-dark-blue text-white shadow-lg shadow-dark-blue/10" 
                : "text-gray-400 hover:text-dark-blue hover:bg-gray-50"
            )}
          >
            {t(`dashboard.${tab === 'realtime' ? 'realTime' : 'by' + tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">{t('dashboard.visitsChart')}</h3>
          <VisitsChart data={MOCK_VISITS} />
        </div>
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">{t('dashboard.viewsChart')}</h3>
          <ImageViewsChart data={MOCK_VIEWS} />
        </div>
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">{t('dashboard.ctaChart')}</h3>
          <CTAChart data={MOCK_CTA} />
        </div>
      </div>
    </div>
  );
}
