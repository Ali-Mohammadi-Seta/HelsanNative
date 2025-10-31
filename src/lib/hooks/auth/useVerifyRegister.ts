// src/lib/hooks/auth/useVerifyRegister.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyRegisterApi } from '@/lib/api/apiService';
import { saveTokens } from '@/lib/auth/tokenStorage';

export const useVerifyRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyRegisterApi,
    onSuccess: async (data) => {
      console.log('✅ [useVerifyRegister] Success');
      
      if (data?.data?.accessToken && data?.data?.refreshToken) {
        await saveTokens(data.data.accessToken, data.data.refreshToken);
      }
      
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuthorize'] });
    },
    onError: (error: any) => {
      console.error('[useVerifyRegister] Error:', error.response?.data || error.message);
    },
  });
};