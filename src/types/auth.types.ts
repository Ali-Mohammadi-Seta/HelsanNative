// src/types/auth.types.ts

export interface LoginCredentials {
  phone: string;
  nationalId: string;
}

export interface RegisterData {
  phone: string;
  nationalId: string;
  birthDate: string;
}

export interface VerifyOtpPayload {
  otp?: string;
  otpValue?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface RequestOtpResponse {
  challenge: string;
  message: string;
}

export interface UserProfile {
  _id: string;
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  email?: string;
  role: UserRole;
  roles?: UserRole[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 
  | 'Citizen' 
  | 'Doctor' 
  | 'Nurse' 
  | 'Receptionist' 
  | 'ClinicAdmin' 
  | 'ParaclinicAdmin' 
  | 'Psychologist';

export type LoginStep = 
  | 'login' 
  | 'register' 
  | 'loginVerification'      // ✅ ADDED
  | 'registerVerification'   // ✅ ADDED
  | 'verification' 
  | 'resetPassword' 
  | 'resetPasswordVerification' 
  | 'done';

export interface AuthState {
  isLoggedIn: boolean;
  loading: boolean;
  loginStep: LoginStep;
  userRole: UserRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  challenge: string | null;
}

export interface UserState {
  profileInfo: UserProfile | null;
  profileLoading: boolean;
  userRegisterFormValues: RegisterData | null;
  userLoginFormValues: LoginCredentials | null;
  userHistory: any[];
}