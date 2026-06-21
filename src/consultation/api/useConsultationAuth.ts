import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationApi } from './client';
import endpoints from './endpoints';

interface ConsultationProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles: string[];
  activeRole: string;
  [key: string]: any;
}

export const useGetConsultationProfile = (enabled = true) => {
  return useQuery<ConsultationProfile>({
    queryKey: ['consultationProfile'],
    queryFn: async () => {
      const response = await consultationApi.get(endpoints.userProfileInfo);
      return (response?.data?.data || response?.data || {}) as ConsultationProfile;
    },
    enabled,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useChangeActiveRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (role: string) => {
      const response = await consultationApi.patch(endpoints.changeActiveRole, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultationProfile'] });
    },
  });
};
