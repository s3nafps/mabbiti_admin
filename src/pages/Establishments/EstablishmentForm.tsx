import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { establishmentService, Establishment } from '@/src/services/establishment.service';
import PageHeader from '@/src/components/shared/PageHeader';
import { Save, X, Image as ImageIcon, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const establishmentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  phone: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Invalid email'),
  wilaya: z.string().min(1, 'Wilaya is required'),
  commune: z.string().min(1, 'Commune is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  status: z.enum(['active', 'inactive']),
});

type EstablishmentFormValues = z.infer<typeof establishmentSchema>;

// Mock Wilayas
const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
  // ... rest of the 58 wilayas
];

export default function EstablishmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [media, setMedia] = useState<string[]>([]);
  const isEdit = !!id;

  const { data: existingEstablishment, isLoading: loadingExisting } = useQuery({
    queryKey: ['establishments', id],
    queryFn: () => establishmentService.getById(id!),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EstablishmentFormValues>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      status: 'active',
      latitude: 36.7538,
      longitude: 3.0588,
    }
  });

  useEffect(() => {
    if (existingEstablishment) {
      reset({
        title: existingEstablishment.title,
        description: existingEstablishment.description,
        categoryId: existingEstablishment.categoryId,
        phone: existingEstablishment.phone,
        email: existingEstablishment.email,
        wilaya: existingEstablishment.wilaya,
        commune: existingEstablishment.commune,
        address: existingEstablishment.address,
        latitude: existingEstablishment.latitude,
        longitude: existingEstablishment.longitude,
        status: existingEstablishment.status,
      });
      setMedia(existingEstablishment.media || []);
    }
  }, [existingEstablishment, reset]);

  const mutation = useMutation<void, Error, any>({
    mutationFn: async (data: any) => {
      if (isEdit) {
        await establishmentService.update(id!, data);
      } else {
        await establishmentService.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      toast.success(`Establishment ${isEdit ? 'updated' : 'created'} successfully`);
      navigate('/establishments');
    },
    onError: () => {
      toast.error('Something went wrong');
    }
  });

  const onSubmit = (data: EstablishmentFormValues) => {
    mutation.mutate({ ...data, media });
  };

  const lat = watch('latitude');
  const lng = watch('longitude');

  if (isEdit && loadingExisting) {
    return <div className="flex justify-center py-24"><Loader2 className="h-12 w-12 animate-spin text-primary-orange" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <PageHeader 
        title={isEdit ? 'Refine Establishment' : 'New Establishment'}
        description={isEdit ? `Modifying details for ${existingEstablishment?.title}` : 'Expand your platform by listing a new destination'}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info Container */}
        <div className="glass-card p-10 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-orange" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Identity & Contact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Title Name</label>
              <input 
                {...register('title')}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
              />
              {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Category Type</label>
              <select 
                {...register('categoryId')}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm appearance-none"
              >
                <option value="">Select Category</option>
                <option value="hotels">Hotels</option>
                <option value="restaurants">Restaurants</option>
                <option value="cafes">Cafes</option>
                <option value="tourism">Tourism</option>
              </select>
              {errors.categoryId && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Editorial Description</label>
            <textarea 
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none resize-none transition-all text-sm font-medium shadow-sm"
            />
            {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Support Hotline</label>
              <input 
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Business Email</label>
              <input 
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Location Container */}
        <div className="glass-card p-10 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-orange" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Geography & State</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Wilaya</label>
              <select 
                {...register('wilaya')}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm appearance-none"
              >
                <option value="">Select Wilaya</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Commune</label>
              <input 
                {...register('commune')}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Listing Status</label>
              <select 
                {...register('status')}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm appearance-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Full Postal Address</label>
            <input 
              {...register('address')}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Latitude</label>
                <input 
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Longitude</label>
                <input 
                  type="number"
                  step="any"
                  {...register('longitude', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-orange focus:border-primary-orange outline-none transition-all text-sm font-medium shadow-sm"
                />
              </div>
            </div>
            
            {/* Map Preview Placeholder */}
            <div className="h-44 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 relative overflow-hidden group">
               <div className="absolute inset-0 bg-primary-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <MapPin className="h-8 w-8 mb-2 text-gray-300 group-hover:text-primary-orange transition-colors" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Geo Preview</p>
               <p className="text-[10px] font-mono mt-1 opacity-50">{lat}, {lng}</p>
            </div>
          </div>
        </div>

        {/* Media Container */}
        <div className="glass-card p-10 space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-orange" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Media Library</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {media.map((url, idx) => (
              <div key={idx} className="aspect-square relative rounded-[1.5rem] overflow-hidden group shadow-sm border border-white">
                <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    type="button"
                    onClick={() => setMedia(m => m.filter((_, i) => i !== idx))}
                    className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all active:scale-[0.9]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white hover:border-primary-orange hover:text-primary-orange transition-all group shadow-sm">
              <ImageIcon className="h-8 w-8 mb-2 opacity-30 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Add Asset</span>
              <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {}} />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-6 pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/establishments')}
            className="px-8 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-dark-blue transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-dark-blue hover:bg-dark-blue/90 text-white font-bold rounded-xl shadow-xl shadow-dark-blue/20 flex items-center gap-3 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isEdit ? 'Sync Changes' : 'Publish Establishment'}
          </button>
        </div>
      </form>
    </div>
  );
}
