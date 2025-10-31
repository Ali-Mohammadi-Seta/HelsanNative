// src/hooks/api/useEMR.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api/apiService';

export const useSelfEmrStatus = () => {
  return useQuery({
    queryKey: ['selfEmrStatus'],
    queryFn: apiService.getSelfEmrStatus,
    staleTime: 5 * 60 * 1000,
  });
};

export const useQuestionnaireCachedInfo = () => {
  return useQuery({
    queryKey: ['questionnaireCachedInfo'],
    queryFn: apiService.getQuestionnaireCachedInfo,
  });
};

export const useSaveDoneQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.saveDoneQuestionnaire,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selfEmrStatus'] });
      queryClient.invalidateQueries({ queryKey: ['userHealthInfo'] });
    },
  });
};

export const useUserHealthInfo = () => {
  return useQuery({
    queryKey: ['userHealthInfo'],
    queryFn: apiService.getUserHealthInfo,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserEmrServices = () => {
  return useQuery({
    queryKey: ['userEmrServices'],
    queryFn: apiService.getUserEmrServices,
  });
};