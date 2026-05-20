import { api } from './api';

export const authService = {
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    return api.post('/api/auth/login', credentials);
  },
};

export interface LoginDTO {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}
