// src/lib/hooks/auth/useLogout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutApi } from '@/lib/api/apiService';
import { removeTokens } from '@/lib/auth/tokenStorage';
import { logout as logoutAction } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { router } from 'expo-router';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: async () => {
      await removeTokens();
      queryClient.clear();
      dispatch(logoutAction());
      router.replace('/(tabs)/home');
    },
  });
};
