// src/hooks/api/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api/apiService';
import { removeTokens } from '@/lib/auth/tokenStorage';
import { router } from 'expo-router';

export const useLogin = () => {
  return useMutation({
    mutationFn: apiService.login,
    onError: (error: any) => {
      console.error('[useLogin] Error:', error.response?.data || error.message);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: apiService.register,
    onError: (error: any) => {
      console.error('[useRegister] Error:', error.response?.data || error.message);
    },
  });
};

export const useVerifyLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.verifyLogin,
    onSuccess: (data) => {
      console.log('✅ [useVerifyLogin] Login verified successfully');
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuthorize'] });
    },
    onError: (error: any) => {
      console.error('[useVerifyLogin] Error:', error.response?.data || error.message);
    },
  });
};

export const useVerifyRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.verifyRegister,
    onSuccess: (data) => {
      console.log('✅ [useVerifyRegister] Registration verified successfully');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['checkAuthorize'] });
    },
    onError: (error: any) => {
      console.error('[useVerifyRegister] Error:', error.response?.data || error.message);
    },
  });
};

export const useCheckAuthorize = () => {
  return useQuery({
    queryKey: ['checkAuthorize'],
    queryFn: apiService.checkAuthorize,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: apiService.getUserProfile,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.logout,
    onSuccess: async () => {
      await removeTokens();
      queryClient.clear(); // Clear all cache
      router.replace('/(tabs)/home');
    },
  });
};

export const usePotentialRoles = () => {
  return useQuery({
    queryKey: ['potentialRoles'],
    queryFn: apiService.getPotentialRoles,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};