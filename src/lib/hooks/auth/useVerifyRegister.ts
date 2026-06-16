import endpoints from '@/config/endpoints';
import apiClient from '@/lib/api/apiClient';
import { useMutation } from '@tanstack/react-query';

export const useVerifyRegister = () => {
  return useMutation({
    mutationFn: async (body: { otpValue: string }) => {
      const res = await apiClient.post(endpoints.verifyRegister, body);
      return res?.data;
    },
  });
};
