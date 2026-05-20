import { api } from './api';
import { tokenStorage } from './tokenStorage';

export const authService = {
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    return api.post('/api/auth/login', credentials);
  },

  async logout() {
    await tokenStorage.removeToken();
  }
};

export interface LoginDTO {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}
