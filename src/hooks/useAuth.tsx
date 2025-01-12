'use client';

import { useRouter } from 'next/navigation'; 
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(login(data?.result?.token));
        return true;
      } else {
        console.error('something wrong was happen!');
        return false;
      }
    } catch (error) {
      console.error('Error while login:', error);
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login')
  };

  const handleVerifyToken = async (authToken: string) => {
    console.log('auth', authToken)
    if(authToken) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}verify-token`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.valid) {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error to verify token:', error);
        dispatch(logout());
      }
    } else {
      router.push('/login')
    }
  };
  return { isAuthenticated, token, handleLogin, handleLogout, handleVerifyToken };
};

export default useAuth;
