import axios from "axios";

//instancia unica do axios com inicio da url predefinida
export const api = axios.create({
  baseURL: "http://localhost:3333/api",
});

// Interceptador para tokens expirados melhor experiencia do usuario
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth')) {
      window.location.href = "/";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Sua sessão expirou. Faça login novamente.");
    }
    return Promise.reject(error);
  }
);
