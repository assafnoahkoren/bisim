// API type definitions - keep in sync with server
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

// tRPC procedure return types
export interface HelloOutput {
  message: string;
}

export interface LogoutOutput {
  success: boolean;
}