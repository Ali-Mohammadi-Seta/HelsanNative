import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import endpoints from '@/config/endpoints';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserRole } from '@/redux/slices/authSlice';
import { router } from 'expo-router';
import { checkAuthorizeApi } from '@/lib/api/apiService';

export const useVerifyRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (body: { otpValue: string }) => {
      const res = await apiClient.post(endpoints.verifyRegister, body);
      return res?.data;
    },
    onSuccess: async () => {
      try {
        const auth = await checkAuthorizeApi();
        dispatch(setIsLoggedIn(!!auth?.isLogin));
        dispatch(setUserRole(auth?.roles?.ourRoles || []));
      } catch {
        dispatch(setIsLoggedIn(true));
      }
      router.replace('/(tabs)/home');
    },
  });
};
