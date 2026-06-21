// Ported from salam-consultation-front-dev
const endpoints = {
  register: "/user/addUserComingFromSso",
  ssoStart: "/user/sso/start",
  ssoCallback: "/user/sso/callback",
  logout: "/user/logout",
  userProfileInfo: "/user",
  getDoctorsList: "/user/filterDoctors",
  getPsychologistsList: "/user/filterPsychologists",
  getProviderById: (providerId: string) => `/user/providers/${providerId}`,
  getProviderCategories: "/provider-categories",
  changeProviderCategories: "/user/categories",
  changeProviderCustomFields: "/user/custom-fields",
  patchUserProfile: "/user/addAvatarForUser",
  changeDoctorConsultationMethod: "/user/changeConsultation",
  addDoctorBio: "/user/addDescriptionForDoctor",
  changeConsultationMethod: "/user/changeConsultation",

  // video-call
  reserveDoctorOnlineMeeting: "/video-call/userRegisterForATicket",
  approveMeeting: "/video-call/approveMeeting",
  rejectMeeting: "/video-call/rejectMeeting",
  getAllDoctorMeeting: "/video-call/findAllMeetingBelongToADoctor",
  getAllClientDoctorMeeting: "/video-call/findAllMeetingBelongToAUser",
  changeMeetingStatusToInprogress: "/video-call/inProgress",
  finishMeeting: "/video-call/finishMeet",
  doctorSetCalendarForMeeting: "/video-call/doctorScheduleDate",
  doctorDeleteOneAppointment: "/video-call/doctorWantsToDeleteATicket",
  getDoctorUnreservedMeeting: "/video-call/findAllUnreservedMeetingForADoctor",
  doctorCreateLink: "/video-call/doctorCreateLink",
  doctorAddAdvice: "/video-call/advise",

  // video-call-psychologist
  reservePsychologistOnlineMeeting: "/video-call/psychologist/userRegisterForATicket",
  getAllClientPsychologistMeeting: "/video-call/psychologist/findAllMeetingBelongToAUser",
  getAllPsychologistMeeting: "/video-call/psychologist/findAllMeetingBelongToAPsychologist",
  changePsychologistMeetingStatusToInprogress: "/video-call/psychologist/inProgress",
  finishPsychologistMeeting: "/video-call/psychologist/finishMeet",
  psychologistSetCalendarForMeeting: "/video-call/psychologist/psychologistScheduleDate",
  psychologistDeleteOneAppointment: "/video-call/psychologist/psychologistWantsToDeleteATicket",
  getPsychologistUnreservedMeeting: "/video-call/psychologist/findAllUnreservedMeetingForAPsychologist",
  psychologistCreateLink: "/video-call/psychologist/psychologistCreateLink",
  psychologistAddAdvice: "/video-call/psychologist/advise",

  // text-consultation
  createTextConsultation: "/consultation",
  addCitizenMessageToTextTicket: "/user-text-tickets/addQuestion",
  addProviderMessageToTextTicket: "/provider-text-tickets/answer",
  addCitizenFilesToTextTicket: "/user-text-tickets/addFile",
  closeProviderTextTicket: "/provider-text-tickets/close-ticket",
  textTicketForDoctor: "/consultation/findTicketsForADoctor",
  textTicketForCustomer: "/consultation/findTicketsForAUser",
  getTextTicketById: (ticketId: string) => `/user-text-tickets/${ticketId}`,
  getDoctorTextTicketById: (ticketId: string) => `/provider-text-tickets/${ticketId}`,

  // provider
  getProviderTickets: "/provider-tickets",
  getProviderTicketById: (id: string) => `/provider-tickets/${id}`,
  providerAddAdvice: "/provider-tickets/advise",
  providerScheduleMeeting: "/provider-tickets/schedule",
  deleteProviderTicket: (ticketId: string) => `/provider-tickets/${ticketId}`,
  changeActiveRole: "/user/active-role",
  providerFinishACall: "/provider-tickets/finish",
  providerMarkACallInProgress: "/provider-tickets/in-progress",

  // user
  getAProviderMeetingsByCitizen: "/provider-tickets/public",
  getUserCalls: "/user-tickets",
  getCitizenAdvices: "/user-advices",
  cancelUserTicket: (ticketId: string) => `/user-tickets/${ticketId}`,
  getProviderOrdersCount: "/orders/provider/tickets-summary",
  getUserOrdersCount: "/orders/user/tickets-summary",

  // payment/order
  createOrder: "/orders",
  orderPayment: (orderId: string) => `/orders/${orderId}/pay`,
  verifyOrderPayment: "/orders/payment/verify",
  getUserOrders: "/orders",
  getOrderById: (id: string) => `/orders/${id}`,
};

export default endpoints;
