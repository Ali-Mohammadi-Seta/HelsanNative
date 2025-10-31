// src/lib/hooks/auth/useVerifyLogin.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyLoginApi } from '@/lib/api/apiService';
import { saveTokens } from '@/lib/auth/tokenStorage';

export const useVerifyLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyLoginApi,
    onSuccess: async (data) => {
      console.log('✅ [useVerifyLogin] Success');
      
      // Save tokens if available
      if (data?.data?.accessToken && data?.data?.refreshToken) {
        await saveTokens(data.data.accessToken, data.data.refreshToken);
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuthorize'] });
    },
    onError: (error: any) => {
      console.error('[useVerifyLogin] Error:', error.response?.data || error.message);
    },
  });
};