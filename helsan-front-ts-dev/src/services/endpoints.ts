const endpoints = {
  //authorization
  register: "/user",
  verifyRegister: "/user/otp",
  login: "/user/login",
  logout: "/user/logout",
  verifyLogin: "/user/validate-login-otp",
  checkAuthorize: "/user/usersStatus",
  getToken: "/auth/token",
  healthGovRegister: "/user/oauth-register-user",
  //registered user
  userProfileInfo: "/user/userInfo",
  getPotentialRoles: "/user/get-all-potential-roles",
  upgradeUser: (role: string) => `/user/upgrade-${role}`,
  changePassword1: "/user/changePassword",
  //doctors
  getDoctorsList: "/user/doctors",
  // ----- emr -----
  getSelfEmrStatus: "/emr/temp/self",
  getQuestionnaireCachedInfo: "/emr/temp/cachedInfo",
  saveDoneQuestionnaire: "/emr/temp/self",
  getUserHealthInfo: "/emrServer/userHealthInfo",
  getUserEmrServices: "/emrServer/prescriptions/userPrimaryServices",
  getPlaceListOnMove1: "/location",
};

export default endpoints;
