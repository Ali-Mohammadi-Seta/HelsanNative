import apiServices from "../apiServices";
import endpoints from "../endpoints";

//get self emr status
export const getQuestionnaireStatusApi = async () => {
  const result = await apiServices.get(endpoints.getSelfEmrStatus);
  return result?.data?.data;
};

//get questionnnaire cached info
export const getQuestionnaireCachedInfoApi = async () => {
  const result = await apiServices.get(endpoints.getQuestionnaireCachedInfo);
  return result?.data?.data;
};

// save or done questionnaire
export const saveDoneQuestionnaireApi = async (data: any) => {
  const result = await apiServices.post(endpoints.saveDoneQuestionnaire, data);
  return result;
};

//get user health info
export const getUserHealthInfoApi = async () => {
  const result = await apiServices.get(endpoints.getUserHealthInfo);
  return result?.data?.data;
};

//get emr services
export const getEmrServicesApi = async () => {
  const result = await apiServices.get(endpoints.getUserEmrServices);
  return result?.data?.data;
};
