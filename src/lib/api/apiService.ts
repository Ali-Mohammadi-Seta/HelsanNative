// src/lib/api/apiService.ts
import endpoints from '@/config/endpoints';
import apiClient from './apiClient';

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

export const upgradeUserRoleApi = async (role: string, payload: Record<string, string>) => {
  const response = await apiClient.patch(endpoints.upgradeUser(role), payload);
  return response.data;
};

// Support
export type SupportTicketStatus = 'open' | 'answered' | 'closed';

export const getSupportTicketsApi = async (params?: {
  status?: SupportTicketStatus;
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get(endpoints.supportTickets, { params });
  return extractData(response);
};

export const getSupportTicketApi = async (ticketId: string) => {
  const response = await apiClient.get(endpoints.supportTicket(ticketId));
  return extractData(response);
};

export const createSupportTicketApi = async (payload: { subject: string; content: string }) => {
  const response = await apiClient.post(endpoints.supportTickets, payload);
  return response.data;
};

export const replySupportTicketApi = async (ticketId: string, payload: { content: string }) => {
  const response = await apiClient.post(endpoints.supportTicketMessages(ticketId), payload);
  return response.data;
};

export const closeSupportTicketApi = async (ticketId: string) => {
  const response = await apiClient.patch(endpoints.closeSupportTicket(ticketId));
  return response.data;
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

export const getEmrAdviceApi = async () => {
  const response = await apiClient.get(endpoints.getEmrAdvice);
  const payload = extractData<any>(response);
  if (!payload) return null;
  return 'advices' in payload ? payload : payload.data ?? null;
};

export const getMyPrescriptionsApi = async (
  filters: Record<string, string | number> = {},
  page = 1,
  limit = 10,
) => {
  const response = await apiClient.post(endpoints.getMyPrescriptions, {
    serviceTypes: filters.serviceTypes ?? '',
    startTime: filters.startTime ?? '',
    endTime: filters.endTime ?? '',
    insuranceCompany: filters.insuranceCompany ?? '',
    type: filters.type ?? filters.filterPresc ?? '',
    prescHead: filters.prescHead ?? undefined,
    page,
    limit,
  });
  return response.data?.data?.data ?? response.data?.data ?? response.data;
};

export const getDeliveredPrescriptionsApi = async (
  filters: Record<string, string | number> = {},
  page = 1,
  limit = 10,
) => {
  const response = await apiClient.post(endpoints.getDeliveredPrescriptions, {
    startTime: filters.startTime ?? '',
    endTime: filters.endTime ?? '',
    insuranceCompany: filters.insuranceCompany ?? '',
    type: filters.type ?? filters.filterPresc ?? '',
    page,
    limit,
  });
  return response.data?.data?.data ?? response.data?.data ?? response.data;
};

export const getPrescriptionDetailsApi = async (prescHead: string) => {
  const response = await apiClient.get(endpoints.prescriptionDetails, {
    params: { prescHead },
  });
  return response.data?.data?.data ?? response.data?.data ?? response.data;
};

// Doctors
export type ProviderListType = 'doctor' | 'psychologist';

export type ProviderListFilters = {
  name?: string;
  LastDegreeField?: string;
  MCCity?: string;
  McCode?: string;
  field?: string;
  licenseNumber?: string;
  province?: string;
  city?: string;
  page: number;
  limit: number;
};

export type ProviderListItem = {
  id?: string;
  _id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  medicalId?: string;
  expertise?: string;
  field?: string;
  licenseNumber?: string;
  province?: string;
  city?: string;
  profilePhotoUrl?: string | null;
  source?: string;
};

export type ProviderListResponse = {
  total: number;
  data: ProviderListItem[];
};

const providerEndpoint: Record<ProviderListType, string> = {
  doctor: endpoints.getDoctorsList,
  psychologist: endpoints.getPsychologistsList,
};

const normalizeProviderListResponse = (rawResponse: any): ProviderListResponse => {
  const payload = Array.isArray(rawResponse?.data)
    ? rawResponse
    : Array.isArray(rawResponse?.data?.data)
      ? rawResponse.data
      : Array.isArray(rawResponse?.result?.data)
        ? rawResponse.result
        : null;

  return {
    total: Number(payload?.total ?? payload?.data?.length ?? 0),
    data: Array.isArray(payload?.data) ? payload.data : [],
  };
};

export const getProvidersListApi = async (
  providerType: ProviderListType,
  filters: ProviderListFilters,
): Promise<ProviderListResponse> => {
  const response = await apiClient.get(providerEndpoint[providerType], { params: filters });
  return normalizeProviderListResponse(response.data);
};

export const getDoctorsListApi = async (filters: ProviderListFilters) => {
  return getProvidersListApi('doctor', filters);
};

export const getPsychologistsListApi = async (filters: ProviderListFilters) => {
  return getProvidersListApi('psychologist', filters);
};

// Map
export const getNearbyPlacesApi = async (payload: {
  topLeftLat: number;
  topLeftLng: number;
  bottomRightLat: number;
  bottomRightLng: number;
}) => {
  const response = await apiClient.get(endpoints.getPlaceListOnMove1, { params: payload });
  return extractData(response);
};

// Export all with proper aliases for useAuth.ts compatibility
export const apiService = {
  // Auth - using short names for hooks
  login: loginApi,
  register: registerApi,
  verifyLogin: verifyLoginApi,
  verifyRegister: verifyRegisterApi,
  checkAuthorize: checkAuthorizeApi,
  logout: logoutApi,
  // User Profile
  getUserProfile: getUserProfileApi,
  getPotentialRoles: getPotentialRolesApi,
  upgradeUserRole: upgradeUserRoleApi,
  // Support
  getSupportTickets: getSupportTicketsApi,
  getSupportTicket: getSupportTicketApi,
  createSupportTicket: createSupportTicketApi,
  replySupportTicket: replySupportTicketApi,
  closeSupportTicket: closeSupportTicketApi,
  // EMR
  getQuestionnaireStatus: getQuestionnaireStatusApi,
  getSelfEmrStatus: getQuestionnaireStatusApi,
  getQuestionnaireCachedInfo: getQuestionnaireCachedInfoApi,
  saveDoneQuestionnaire: saveDoneQuestionnaireApi,
  getUserHealthInfo: getUserHealthInfoApi,
  getEmrServices: getEmrServicesApi,
  getUserEmrServices: getEmrServicesApi,
  getEmrAdvice: getEmrAdviceApi,
  getMyPrescriptions: getMyPrescriptionsApi,
  getDeliveredPrescriptions: getDeliveredPrescriptionsApi,
  getPrescriptionDetails: getPrescriptionDetailsApi,
  // Doctors
  getDoctorsList: getDoctorsListApi,
  getPsychologistsList: getPsychologistsListApi,
  getProvidersList: getProvidersListApi,
  // Map
  getNearbyPlaces: getNearbyPlacesApi,
  // Also export with Api suffix for backward compatibility
  loginApi,
  registerApi,
  verifyLoginApi,
  verifyRegisterApi,
  checkAuthorizeApi,
  logoutApi,
  getUserProfileApi,
  getPotentialRolesApi,
  upgradeUserRoleApi,
  getSupportTicketsApi,
  getSupportTicketApi,
  createSupportTicketApi,
  replySupportTicketApi,
  closeSupportTicketApi,
  getQuestionnaireStatusApi,
  getQuestionnaireCachedInfoApi,
  saveDoneQuestionnaireApi,
  getUserHealthInfoApi,
  getEmrServicesApi,
  getEmrAdviceApi,
  getMyPrescriptionsApi,
  getDeliveredPrescriptionsApi,
  getPrescriptionDetailsApi,
  getDoctorsListApi,
  getPsychologistsListApi,
  getProvidersListApi,
};
