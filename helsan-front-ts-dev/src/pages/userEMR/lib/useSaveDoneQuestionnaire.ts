import { saveDoneQuestionnaireApi } from "@/services/emrServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSaveDoneQuestionnaire = () => {
  const queryClient = useQueryClient();
  const { mutate: saveDoneQuestionnaire, isPending: isSending } = useMutation({
    mutationFn: async (data: any) => {
      return await saveDoneQuestionnaireApi(data);
    },
    onSuccess: (reuslt) => {
      if (reuslt.isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["questionnaireCachedInfo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["questionnaireStatus"],
        });
      }
    },
  });
  return { saveDoneQuestionnaire, isSending };
};
