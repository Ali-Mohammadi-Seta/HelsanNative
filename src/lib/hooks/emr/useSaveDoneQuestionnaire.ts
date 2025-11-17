import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDoneQuestionnaireApi } from '@/lib/api/apiService';
import Toast from 'react-native-toast-message';

export const useSaveDoneQuestionnaire = () => {
  const queryClient = useQueryClient();

  const { mutate: saveDoneQuestionnaire, isPending: isSending } = useMutation({
    mutationFn: saveDoneQuestionnaireApi,
    onSuccess: (result) => {
      if (result?.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ['questionnaireCachedInfo'] });
        queryClient.invalidateQueries({ queryKey: ['questionnaireStatus'] });
        queryClient.invalidateQueries({ queryKey: ['userHealthInfo'] });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to save questionnaire',
      });
    },
  });

  return { saveDoneQuestionnaire, isSending };
};