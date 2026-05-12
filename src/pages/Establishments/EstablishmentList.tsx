import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { establishmentService, Establishment } from '@/src/services/establishment.service';
import DataTable from '@/src/components/ui/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import { Edit, Trash2, Eye, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const columnHelper = createColumnHelper<Establishment>();

export default function EstablishmentList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: establishments = [], isLoading } = useQuery({
    queryKey: ['establishments'],
    queryFn: () => establishmentService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => establishmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      toast.success('Establishment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete establishment');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this establishment?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {info.row.original.media?.[0] ? (
              <img src={info.row.original.media[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <Store />
              </div>
            )}
          </div>
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('categoryId', {
      header: 'Category',
      cell: info => <span className="capitalize">{info.getValue()}</span>,
    }),
    columnHelper.accessor('wilaya', {
      header: 'Wilaya',
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: info => (
        <div className="flex items-center gap-1 text-yellow-500 font-medium">
          <Star className="h-4 w-4 fill-current" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-medium",
          info.getValue() === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {t(`common.${info.getValue()}`)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/establishments/${info.row.original.id}`)}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => navigate(`/establishments/edit/${info.row.original.id}`)}
            className="p-1.5 hover:bg-orange-50 text-[#FF6B00] rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(info.row.original.id)}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('common.establishments')}
        actions={
          <button 
            onClick={() => navigate('/establishments/new')}
            className="bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            {t('common.add')}
          </button>
        }
      />
      <DataTable 
        data={establishments} 
        columns={columns} 
        isLoading={isLoading} 
      />
    </div>
  );
}

// Helper icons/functions that might be missing
import { Store, Star } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
