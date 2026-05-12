import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, Review } from '@/src/services/review.service';
import DataTable from '@/src/components/ui/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import { CheckCircle, XCircle, Trash2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const columnHelper = createColumnHelper<Review>();

export default function ReviewList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewService.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => 
      reviewService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success(`Review ${variables.status}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted');
    }
  });

  const columns = [
    columnHelper.accessor('establishmentName', {
      header: 'Establishment',
      cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
    }),
    columnHelper.accessor('userName', {
      header: 'User',
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: info => (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", i < info.getValue() ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
          ))}
        </div>
      )
    }),
    columnHelper.accessor('comment', {
      header: 'Comment',
      cell: info => <p className="max-w-xs truncate text-gray-500" title={info.getValue()}>{info.getValue()}</p>
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy')
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
          info.getValue() === 'approved' && "bg-green-100 text-green-700",
          info.getValue() === 'pending' && "bg-yellow-100 text-yellow-700",
          info.getValue() === 'rejected' && "bg-red-100 text-red-700",
        )}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          {info.row.original.status === 'pending' && (
            <>
              <button 
                onClick={() => updateMutation.mutate({ id: info.row.original.id, status: 'approved' })}
                className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                title="Approve"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button 
                onClick={() => updateMutation.mutate({ id: info.row.original.id, status: 'rejected' })}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                title="Reject"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button 
            onClick={() => deleteMutation.mutate(info.row.original.id)}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    })
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('common.reviews')} />
      <DataTable data={reviews} columns={columns} isLoading={isLoading} />
    </div>
  );
}
