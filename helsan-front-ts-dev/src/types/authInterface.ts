export type CheckAuthorizeResponse = {
  data: {
    isLogin: boolean;
    role: "Citizen" | "Doctor" | string;
  };
};
