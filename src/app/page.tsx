'use client';

import { useEffect } from 'react';
import ProductTable from '../components/ProductsTable/ProductsTable';
import useAuth from '@/hooks/useAuth';

export default function DashboardPage() {
  const { handleVerifyToken, token, handleLogout } = useAuth();
  useEffect(() => {
    handleVerifyToken(token ?? '');
  }, [])
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Products Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className={`py-2 px-4 border border-gray-300 rounded-lg 
                text-gray-700 bg-white hover:bg-gray-100 
                hover:text-gray-900 shadow-sm 
                focus:outline-none focus:ring-2 
                focus:ring-gray-200 
                focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Logout
        </button>
      </div>

      <ProductTable />
    </div>
  );
}

