// src/config/endpoints.ts
const endpoints = {
  // Authorization
  register: '/user',
  verifyRegister: '/user/otp',
  login: '/user/login',
  logout: '/user/logout',
  verifyLogin: '/user/validate-login-otp',
  ssoStart: '/user/sso/start',
  ssoCallback: '/user/sso/callback',
  checkAuthorize: '/user/usersStatus',
  getToken: '/auth/token',
  healthGovRegister: '/user/oauth-register-user',
  verifyOTP1: '/auth/verify-otp',

  // Health Ministry
  // Registered user
  userProfileInfo: '/user/userInfo',
  getPotentialRoles: '/user/get-all-potential-roles',
  upgradeUser: (role: string) => `/user/upgrade-${role}`,
  changePassword1: '/user/changePassword',
  supportTickets: '/support/tickets',
  supportTicket: (ticketId: string) => `/support/tickets/${ticketId}`,
  supportTicketMessages: (ticketId: string) => `/support/tickets/${ticketId}/messages`,
  closeSupportTicket: (ticketId: string) => `/support/tickets/${ticketId}/close`,

  // Doctors
  getDoctorsList: '/user/doctors',
  getPsychologistsList: '/user/psychologists',

  // EMR
  getSelfEmrStatus: '/emr/temp/self',
  getQuestionnaireCachedInfo: '/emr/temp/cachedInfo',
  saveDoneQuestionnaire: '/emr/temp/self',
  getUserHealthInfo: '/emrServer/userHealthInfo',
  getUserEmrServices: '/emrServer/prescriptions/userPrimaryServices',
  getEmrAdvice: '/emr/psychologyTreatment/getAdvice',
  getMyPrescriptions: '/emr/prescriptions/getPaginated',
  getDeliveredPrescriptions: '/emr/deliverPrescriptions/getPaginated',
  prescriptionDetails: '/emr/prescriptions/getDetail',

  // Location
  getPlaceListOnMove: '/location',
  getPlaceListOnMove1: '/location', // Using same endpoint for now as placeholder or if it's the same

} as const;

export default endpoints;
