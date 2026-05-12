import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from '@/src/layouts/DashboardLayout';
import AuthLayout from '@/src/layouts/AuthLayout';
import { ProtectedRoute, PublicRoute } from './guards';

// Pages
import Login from '@/src/pages/Login';
import Dashboard from '@/src/pages/Dashboard';
import EstablishmentList from '@/src/pages/Establishments/EstablishmentList';
import EstablishmentForm from '@/src/pages/Establishments/EstablishmentForm';
import EstablishmentDetail from '@/src/pages/Establishments/EstablishmentDetail';
import CategoryList from '@/src/pages/Categories/CategoryList';
import ReviewList from '@/src/pages/Reviews/ReviewList';
import UserList from '@/src/pages/Users/UserList';
import ClientList from '@/src/pages/Clients/ClientList';
import Settings from '@/src/pages/Settings/Settings';

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <AuthLayout />,
        children: [{ index: true, element: <Login /> }],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: 'establishments',
            children: [
              { index: true, element: <EstablishmentList /> },
              { path: 'new', element: <EstablishmentForm /> },
              { path: 'edit/:id', element: <EstablishmentForm /> },
              { path: ':id', element: <EstablishmentDetail /> },
            ],
          },
          {
            path: 'categories',
            children: [
              { index: true, element: <CategoryList /> },
            ],
          },
          {
            path: 'reviews',
            element: <ReviewList />,
          },
          {
            path: 'users',
            element: <UserList />,
          },
          {
            path: 'clients',
            element: <ClientList />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <div className="flex h-screen items-center justify-center">Unauthorized. Admin access only.</div>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
