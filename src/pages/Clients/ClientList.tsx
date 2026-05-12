import { useQuery } from '@tanstack/react-query';
import { userService, User } from '@/src/services/user.service';
import DataTable from '@/src/components/ui/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import { Mail, Phone, Calendar, Heart, ShieldAlert, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<any>();

const MOCK_CLIENTS = [
  { id: 'c1', name: 'Yacine Brahimi', email: 'yacine@gmail.com', phone: '+213 661 22 33 44', registeredAt: new Date(), favorites: 12 },
  { id: 'c2', name: 'Riyad Mahrez', email: 'riyad@gmail.com', phone: '+213 662 55 66 77', registeredAt: new Date(), favorites: 45 },
  { id: 'c3', name: 'Ismael Bennacer', email: 'ismael@gmail.com', phone: '+213 663 88 99 00', registeredAt: new Date(), favorites: 5 },
];

export default function ClientList() {
  const { t } = useTranslation();

  const { data: clients = MOCK_CLIENTS, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => Promise.resolve(MOCK_CLIENTS), // In real app, filter users collection by role === 'user'
  });

  const columns = [
    columnHelper.accessor('name', {
      header: 'Client Name',
      cell: info => <span className="font-bold text-gray-900">{info.getValue()}</span>
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => (
        <div className="flex items-center gap-2 text-gray-500">
          <Mail className="h-3 w-3" />
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => (
        <div className="flex items-center gap-2 text-gray-500">
          <Phone className="h-3 w-3" />
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('favorites', {
      header: 'Favorites',
      cell: info => (
        <div className="flex items-center gap-1.5 font-bold text-[#FF6B00]">
          <Heart className="h-4 w-4 fill-current" />
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('registeredAt', {
      header: 'Registered',
      cell: info => (
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="h-3 w-3" />
          {format(new Date(info.getValue()), 'MMM dd, yyyy')}
        </div>
      )
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg" title="View Profile">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg" title="Disable Account">
            <ShieldAlert className="h-4 w-4" />
          </button>
        </div>
      )
    })
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('common.clients')} description="View and manage mobile application end-users" />
      <DataTable data={clients} columns={columns} isLoading={isLoading} />
    </div>
  );
}
