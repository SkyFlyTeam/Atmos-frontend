import axios from "axios";

// Retorna uma instância do Axios
export const Api = axios.create({
  // Backend exposto na porta 3000
  baseURL: 'http://localhost:3000',
});
