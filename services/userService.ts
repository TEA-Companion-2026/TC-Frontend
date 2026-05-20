import { api } from './api';

export const userService = {
  async listAll(token: string) {
    return api.get('/api/usuario', token);
  },

  async create(user: UsuarioDTO) {
    return api.post('/api/usuario', user);
  },

  async show(id: number, token: string) {
    return api.get(`/api/usuario/${id}`, token);
  },

  async edit(id: number, user: UsuarioDTO, token: string) {
    return api.put(`/api/usuario/${id}`, user, token);
  },
};

export interface UsuarioDTO {
  id_usuario?: number;
  username?: string;
  password?: string;
  nome?: string;
  email?: string;
}
