// src/lib/hooks/auth/useRegister.ts
import { useMutation } from '@tanstack/react-query';
import { registerApi } from '@/lib/api/apiService';

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
    onError: (error: any) => {
      console.error('[useRegister] Error:', error.response?.data || error.message);
    },
  });
};