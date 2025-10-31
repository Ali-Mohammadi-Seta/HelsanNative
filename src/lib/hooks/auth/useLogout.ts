// src/lib/hooks/auth/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/lib/api/apiService';
import { removeTokens } from '@/lib/auth/tokenStorage';
import { router } from 'expo-router';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      await removeTokens();
      queryClient.clear();
      router.replace('/(tabs)/home');
    },
  });
};