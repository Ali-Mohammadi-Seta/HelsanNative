import endpoints from '@/config/endpoints';
import apiClient from '@/lib/api/apiClient';
import { checkAuthorizeApi } from '@/lib/api/apiService';
import { saveTokens } from '@/lib/auth/tokenStorage';
import { loginSuccess, setUserRole } from '@/redux/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';

export const useVerifyRegister = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (body: { otpValue: string }) => {
      const res = await apiClient.post(endpoints.verifyRegister, body);
      return res?.data;
    },
    onSuccess: async (data) => {
      try {
        // Extract tokens from response
        const accessToken = data?.data?.accessToken || data?.accessToken;
        const refreshToken = data?.data?.refreshToken || data?.refreshToken;

        if (accessToken && refreshToken) {
          await saveTokens(accessToken, refreshToken);
          dispatch(loginSuccess({ accessToken, refreshToken }));
          console.log('✅ [AUTH] Registration successful, tokens saved');
        }

        const auth = await checkAuthorizeApi();
        dispatch(setUserRole(auth?.roles?.ourRoles || []));
      } catch (e) {
        console.log('ℹ️ [AUTH] Could not fetch roles');
      }
      router.replace('/(tabs)/home');
    },
  });
};
