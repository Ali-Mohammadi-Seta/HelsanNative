// src/lib/api/apiService.ts
import apiClient from './apiClient';
import endpoints from '@/config/endpoints';

const extractData = <T>(response: { data: { data: T } }): T => response.data.data;

// Auth
export const loginApi = async (payload: { phone: string; nationalId: string }) => {
  const response = await apiClient.post(endpoints.login, payload);
  return response.data;
};

export const registerApi = async (payload: { phone: string; nationalId: string; birthDate: string }) => {
  const response = await apiClient.post(endpoints.register, payload);
  return response.data;
};

export const verifyLoginApi = async (payload: { otp: string }) => {
  const response = await apiClient.post(endpoints.verifyLogin, payload);
  return response.data;
};

export const verifyRegisterApi = async (payload: { otpValue: string }) => {
  const response = await apiClient.post(endpoints.verifyRegister, payload);
  return response.data;
};

export const checkAuthorizeApi = async () => {
  const response = await apiClient.get(endpoints.checkAuthorize);
  return extractData(response);
};

export const logoutApi = async () => {
  const response = await apiClient.get(endpoints.logout);
  return response.data;
};

// User Profile
export const getUserProfileApi = async () => {
  const response = await apiClient.get(endpoints.userProfileInfo);
  return extractData(response);
};

export const getPotentialRolesApi = async () => {
  const response = await apiClient.get(endpoints.getPotentialRoles);
  return extractData(response);
};

// EMR
export const getQuestionnaireStatusApi = async () => {
  const response = await apiClient.get(endpoints.getSelfEmrStatus);
  return extractData(response);
};

export const getQuestionnaireCachedInfoApi = async () => {
  const response = await apiClient.get(endpoints.getQuestionnaireCachedInfo);
  return extractData(response);
};

export const saveDoneQuestionnaireApi = async (data: any) => {
  const response = await apiClient.post(endpoints.saveDoneQuestionnaire, data);
  return response.data;
};

export const getUserHealthInfoApi = async () => {
  const response = await apiClient.get(endpoints.getUserHealthInfo);
  return extractData(response);
};

export const getEmrServicesApi = async () => {
  const response = await apiClient.get(endpoints.getUserEmrServices);
  return extractData(response);
};

// Doctors
export const getDoctorsListApi = async (filters: {
  LastDegreeField?: string;
  offset: number;
  limit: number;
}) => {
  const response = await apiClient.get(endpoints.getDoctorsList, { params: filters });
  return extractData(response);
};




// Export all
export const apiService = {
  loginApi,
  registerApi,
  verifyLoginApi,
  verifyRegisterApi,
  checkAuthorizeApi,
  logoutApi,
  getUserProfileApi,
  getPotentialRolesApi,
  getQuestionnaireStatusApi,
  getQuestionnaireCachedInfoApi,
  saveDoneQuestionnaireApi,
  getUserHealthInfoApi,
  getEmrServicesApi,
  getDoctorsListApi,
};