// src/lib/hooks/auth/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/lib/api/apiService';

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onError: (error: any) => {
      console.error('[useLogin] Error:', error.response?.data || error.message);
    },
  });
};