// src/config/endpoints.ts
const endpoints = {
  // Authorization
  register: '/user',
  verifyRegister: '/user/otp',
  login: '/user/login',
  logout: '/user/logout',
  verifyLogin: '/user/validate-login-otp',
  checkAuthorize: '/user/usersStatus',
  getToken: '/auth/token',
  healthGovRegister: '/user/oauth-register-user',
  
  // Registered user
  userProfileInfo: '/user/userInfo',
  getPotentialRoles: '/user/get-all-potential-roles',
  upgradeUser: (role: string) => `/user/upgrade-${role}`,
  changePassword: '/user/changePassword',
  
  // Doctors
  getDoctorsList: '/user/doctors',
  
  // EMR
  getSelfEmrStatus: '/emr/temp/self',
  getQuestionnaireCachedInfo: '/emr/temp/cachedInfo',
  saveDoneQuestionnaire: '/emr/temp/self',
  getUserHealthInfo: '/emrServer/userHealthInfo',
  getUserEmrServices: '/emrServer/prescriptions/userPrimaryServices',
  
  // Location
  getPlaceListOnMove: '/location',
} as const;

export default endpoints;