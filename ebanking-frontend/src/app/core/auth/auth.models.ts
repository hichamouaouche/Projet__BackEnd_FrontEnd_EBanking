export type UserRole = 'ADMIN' | 'MANAGER' | 'ADVISOR' | 'USER';

export interface AppSession {
  token: string;
  refreshToken?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  expiresAt: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiresIn: number;
}
