import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import { User } from "../types";

// Interface que define o formato do contexto de autenticação
interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

// Provedor do contexto de autenticação que envolve a aplicação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado para armazenar o token (recupera do localStorage se existir)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  // Estado para armazenar os dados do usuário (recupera do localStorage se existir)
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Flag que indica se o usuário está autenticado (baseado na existência do token)
  const isAuthenticated = !!token;

  // Define token globalmente no header das requisições
  useEffect(() => {
    if (token) {
      // Adiciona o token no header Authorization para todas as requisições
      api.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser(); // Busca os dados do usuário assim que o token é definido
    } else {
      // Remove o header Authorization se não houver token
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      localStorage.removeItem("user"); // Limpa usuário do localStorage
    }
  }, [token]);

  // Realiza login e armazena token
  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };
  // registra usuario
  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
  };

  // Função para buscar dados do usuário autenticado
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/get-user");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));// Persiste no localStorage para facil acesso
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  // Função para realizar logout 
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Provedor do contexto que disponibiliza todos os valores/funções para os componentes filhos
  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
