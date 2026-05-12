import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, Category } from '@/src/services/category.service';
import DataTable from '@/src/components/ui/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import { Edit, Trash2, Plus, Save, X, Coffee, Hotel, Utensils, Compass, LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<Category>();

const ICONS: Record<string, LucideIcon> = {
  Coffee, Hotel, Utensils, Compass
};

export default function CategoryList() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: { en: '', fr: '', ar: '' },
    iconName: 'Hotel'
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => categoryService.save(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setFormData({ name: { en: '', fr: '', ar: '' }, iconName: 'Hotel' });
      toast.success('Category saved');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted');
    }
  });

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, iconName: category.iconName });
  };

  const handleSave = () => {
    if (!formData.name.en) {
      toast.error('English name is required');
      return;
    }
    saveMutation.mutate({ id: editingId || '', data: formData });
  };

  const columns = [
    columnHelper.accessor('iconName', {
      header: 'Icon',
      cell: info => {
        const Icon = ICONS[info.getValue()] || Hotel;
        return <div className="p-2 bg-gray-50 rounded-lg inline-block"><Icon className="h-5 w-5 text-[#FF6B00]" /></div>;
      }
    }),
    columnHelper.display({
      id: 'name_en',
      header: 'Name (EN)',
      cell: info => editingId === info.row.original.id ? (
        <input 
          className="border rounded px-2 py-1 w-full"
          value={formData.name.en}
          onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
        />
      ) : info.row.original.name.en
    }),
    columnHelper.display({
      id: 'name_fr',
      header: 'Name (FR)',
      cell: info => editingId === info.row.original.id ? (
        <input 
          className="border rounded px-2 py-1 w-full"
          value={formData.name.fr}
          onChange={e => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })}
        />
      ) : info.row.original.name.fr
    }),
    columnHelper.display({
      id: 'name_ar',
      header: 'Name (AR)',
      cell: info => editingId === info.row.original.id ? (
        <input 
          className="border rounded px-2 py-1 w-full text-right"
          dir="rtl"
          value={formData.name.ar}
          onChange={e => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
        />
      ) : info.row.original.name.ar
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => editingId === info.row.original.id ? (
        <div className="flex gap-2">
          <button onClick={handleSave} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Save className="h-4 w-4" /></button>
          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(info.row.original)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded"><Edit className="h-4 w-4" /></button>
          <button onClick={() => deleteMutation.mutate(info.row.original.id)} className="p-1.5 text-red-500 hover:bg-red-500 rounded-lg"><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    })
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('common.categories')}
        actions={
          <button 
            onClick={() => {
              setEditingId('');
              setFormData({ name: { en: '', fr: '', ar: '' }, iconName: 'Hotel' });
            }}
            className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"
          >
            <Plus className="h-5 w-5" />
            {t('common.add')}
          </button>
        }
      />
      
      {editingId === '' && (
         <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 mb-6 flex flex-wrap gap-4 items-end">
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-xs font-bold uppercase text-orange-600">Name (EN)</label>
              <input value={formData.name.en} onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} className="w-full px-4 py-2 bg-white border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-xs font-bold uppercase text-orange-600">Name (FR)</label>
              <input value={formData.name.fr} onChange={e => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })} className="w-full px-4 py-2 bg-white border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="space-y-1 flex-1 min-w-[150px]">
              <label className="text-xs font-bold uppercase text-orange-600 text-right">Name (AR)</label>
              <input dir="rtl" value={formData.name.ar} onChange={e => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })} className="w-full px-4 py-2 bg-white border border-orange-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-right" />
            </div>
            <div className="space-y-1 w-32">
              <label className="text-xs font-bold uppercase text-orange-600">Icon</label>
              <select value={formData.iconName} onChange={e => setFormData({ ...formData, iconName: e.target.value })} className="w-full px-4 py-2 bg-white border border-orange-200 rounded-lg outline-none">
                {Object.keys(ICONS).map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-orange-500 text-white p-2 rounded-lg shadow-lg hover:bg-orange-600 transition-all"><Save className="h-6 w-6" /></button>
              <button onClick={() => setEditingId(null)} className="bg-white text-gray-500 p-2 rounded-lg border hover:bg-gray-50 transition-all"><X className="h-6 w-6" /></button>
            </div>
         </div>
      )}

      <DataTable data={categories} columns={columns} isLoading={isLoading} />
    </div>
  );
}
