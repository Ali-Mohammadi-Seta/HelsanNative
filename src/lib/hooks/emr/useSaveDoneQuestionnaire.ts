import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveDoneQuestionnaireApi } from '@/lib/api/apiService';
import i18n from '@/translations/i18n';
import { showToast } from '@/lib/toast/showToast';

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
      showToast({
        type: 'error',
        message: error,
        fallback: i18n.language === 'fa' ? 'ذخیره پرسشنامه انجام نشد.' : 'Failed to save questionnaire.',
        language: i18n.language === 'fa' ? 'fa' : 'en',
      });
    },
  });

  return { saveDoneQuestionnaire, isSending };
};
