import endpoints from '@/config/endpoints';
import apiClient from '@/lib/api/apiClient';
import { useMutation } from '@tanstack/react-query';

export const useVerifyLogin = () => {
  return useMutation({
    mutationFn: async (body: { otp: string }) => {
      const res = await apiClient.post(endpoints.verifyLogin, body);
      return res?.data;
    },
  });
};
