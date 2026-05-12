import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { establishmentService } from '@/src/services/establishment.service';
import PageHeader from '@/src/components/shared/PageHeader';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar, 
  Edit, 
  ArrowLeft,
  Store,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function EstablishmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: establishment, isLoading } = useQuery({
    queryKey: ['establishments', id],
    queryFn: () => establishmentService.getById(id!),
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-10 w-1/3 bg-gray-200 rounded" />
      <div className="h-64 bg-gray-200 rounded-2xl" />
    </div>;
  }

  if (!establishment) return <div>Establishment not found</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/establishments')}
        className="flex items-center gap-2 text-gray-400 hover:text-primary-orange mb-6 transition-all font-bold text-sm group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to establishments
      </button>

      <PageHeader 
        title={establishment.title}
        description={establishment.address}
        actions={
          <button 
            onClick={() => navigate(`/establishments/edit/${id}`)}
            className="bg-dark-blue text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-dark-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Edit className="h-5 w-5" />
            Edit Profile
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Image */}
          <div className="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-white">
             {establishment.media?.[0] ? (
               <img src={establishment.media[0]} className="h-full w-full object-cover" alt="" />
             ) : (
               <div className="h-full w-full flex items-center justify-center text-gray-200">
                 <Store className="h-20 w-20" />
               </div>
             )}
          </div>

          <div className="glass-card p-8 space-y-6">
             <h3 className="text-xl font-bold text-dark-blue">About the space</h3>
             <p className="text-gray-500 leading-relaxed font-normal">{establishment.description}</p>
          </div>

          {/* Map Preview */}
          <div className="glass-card p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-dark-blue">Location</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <MapPin className="h-4 w-4 text-primary-orange" />
                  {establishment.wilaya}, {establishment.commune}
                </div>
             </div>
             <div className="h-72 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <ExternalLink className="h-6 w-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-bold text-dark-blue">Interactive Map Preview</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">{establishment.latitude}, {establishment.longitude}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-dark-blue text-white p-10 rounded-[2.5rem] shadow-2xl shadow-dark-blue/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary-orange/30 transition-colors" />
              
              <div className="flex items-center gap-5 mb-10 relative z-10">
                 <div className="h-16 w-16 bg-primary-orange rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary-orange/20">
                    {establishment.rating}
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Total Rating</p>
                    <div className="flex gap-1 text-primary-orange">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < Math.floor(establishment.rating) ? "fill-current" : "opacity-30")} />
                      ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-6 text-gray-400 relative z-10">
                 <div className="flex items-center gap-4 group/item">
                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/item:bg-primary-orange transition-colors">
                      <Phone className="h-5 w-5 text-gray-300 group-hover/item:text-white" />
                    </div>
                    <span className="text-sm font-medium">{establishment.phone}</span>
                 </div>
                 <div className="flex items-center gap-4 group/item">
                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/item:bg-primary-orange transition-colors">
                      <Mail className="h-5 w-5 text-gray-300 group-hover/item:text-white" />
                    </div>
                    <span className="text-sm font-medium truncate">{establishment.email}</span>
                 </div>
                 <div className="flex items-center gap-4 group/item">
                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover/item:bg-primary-orange transition-colors">
                      <Calendar className="h-5 w-5 text-gray-300 group-hover/item:text-white" />
                    </div>
                    <span className="text-sm font-medium">Joined {format(new Date(establishment.createdAt), 'MMM yyyy')}</span>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8">
             <h4 className="font-bold text-dark-blue mb-6 uppercase tracking-wider text-[11px] text-gray-400">Quick Growth Stats</h4>
             <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50/50 rounded-2xl text-center border border-gray-100">
                   <p className="text-3xl font-bold text-dark-blue font-display">{establishment.reviewCount}</p>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">Reviews</p>
                </div>
                <div className="p-5 bg-gray-50/50 rounded-2xl text-center border border-gray-100">
                   <p className="text-3xl font-bold text-dark-blue font-display">88%</p>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">Response</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
