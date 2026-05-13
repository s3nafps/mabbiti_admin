import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/src/services/user.service';
import DataTable from '@/src/components/ui/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import { UserCog, ShieldCheck, Mail, ShieldAlert, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const columnHelper = createColumnHelper<User>();

export default function UserList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string, isActive: boolean }) => 
      userService.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User status updated');
    }
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string, role: string }) => 
      userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted');
    }
  });

  const cycleRole = (currentRole: string) => {
    if (currentRole === 'user') return 'moderator';
    if (currentRole === 'moderator') return 'admin';
    return 'user';
  };

  const columns = [
    columnHelper.accessor('displayName', {
      header: 'Name',
      cell: info => (
        <div className="flex items-center gap-3">
          <img src={info.row.original.photoURL} className="h-8 w-8 rounded-full border bg-gray-50" alt="" />
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      )
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
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
          info.getValue() === 'admin' && "bg-purple-100 text-purple-700",
          info.getValue() === 'moderator' && "bg-blue-100 text-blue-700",
          info.getValue() === 'user' && "bg-gray-100 text-gray-700",
        )}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('isActive', {
      header: 'Status',
      cell: info => (
        <span className={cn(
          "flex items-center gap-1.5 font-medium",
          info.getValue() ? "text-green-600" : "text-red-500"
        )}>
          <div className={cn("h-1.5 w-1.5 rounded-full", info.getValue() ? "bg-green-600" : "bg-red-500")} />
          {info.getValue() ? 'Active' : 'Disabled'}
        </span>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined',
      cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy')
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => statusMutation.mutate({ id: info.row.original.id, isActive: !info.row.original.isActive })}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              info.row.original.isActive ? "hover:bg-red-50 text-red-500" : "hover:bg-green-50 text-green-600"
            )}
            title={info.row.original.isActive ? 'Disable' : 'Enable'}
          >
            {info.row.original.isActive ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </button>
          <button 
            onClick={() => roleMutation.mutate({ id: info.row.original.id, role: cycleRole(info.row.original.role) })}
            className="p-1.5 hover:bg-orange-50 text-orange-500 rounded-lg"
            title="Change Role"
          >
            <UserCog className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this user?')) {
                deleteMutation.mutate(info.row.original.id);
              }
            }}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-lg"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    })
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={t('common.users')} description="Manage administrator roles and application users" />
      <DataTable data={users} columns={columns} isLoading={isLoading} />
    </div>
  );
}
