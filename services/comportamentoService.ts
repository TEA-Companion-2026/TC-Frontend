import { api } from './api';

export const comportamentoService = {
  async listarTodos(token: string) {
    return api.get('/api/comportamento', token);
  },

  async listarTipos(token: string) {
    return api.get('/api/tipo-comportamento', token);
  },

  async criar(comportamento: ComportamentoDTO, token: string) {
    return api.post('/api/comportamento', comportamento, token);
  },

  async buscarPorId(id: number, token: string) {
    return api.get(`/api/comportamento/${id}`, token);
  },

  async atualizar(id: number, comportamento: ComportamentoDTO, token: string) {
    return api.put(`/api/comportamento/${id}`, comportamento, token);
  },

  async deletar(id: number, token: string) {
    return api.delete(`/api/comportamento/${id}`, token);
  },
};

export interface ComportamentoDTO {
  idComportamento?: number;
  data?: string;
  observacao?: string;
  tipoComportamento?: string;
}
