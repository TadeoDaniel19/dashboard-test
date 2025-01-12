'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { handleLogin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await handleLogin(email, password);
    setLoading(false);

    if (success) {
      router.push('/');
    } else {
      toast.error('invalid user!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  if (isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Ya estás autenticado</h1>
          <p className="text-gray-600 mt-2">Redirigiéndote al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[rgb(255,160,122)] focus:border-[rgb(255,160,122)] text-black"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[rgb(255,160,122)] focus:border-[rgb(255,160,122)]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[rgb(255,160,122)] text-white font-semibold rounded-lg shadow-md hover:bg-[rgb(240,128,102)] focus:outline-none focus:ring-2 focus:ring-[rgb(255,160,122)] focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
