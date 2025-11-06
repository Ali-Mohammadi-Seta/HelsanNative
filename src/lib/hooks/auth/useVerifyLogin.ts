import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserRole } from '@/redux/slices/authSlice';
import { router } from 'expo-router';
import { checkAuthorizeApi } from '@/lib/api/apiService';

export const useVerifyLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (body: { otp: string }) => {
      const res = await apiClient.post(endpoints.verifyLogin, body);
      return res?.data;
    },
    onSuccess: async () => {
      try {
        const auth = await checkAuthorizeApi(); // { isLogin, roles: { ourRoles: [...] } }
        dispatch(setIsLoggedIn(!!auth?.isLogin));
        dispatch(setUserRole(auth?.roles?.ourRoles || []));
      } catch {
        dispatch(setIsLoggedIn(true)); // fallback
      }
      router.replace('/(tabs)/home');
    },
  });
};
