import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Vehicle } from "../types";
import { api } from "../api";
import { useAuth } from "./AuthContext";
import { useMessage } from "./MessageContext";
import axios from "axios";

// interface que define o tipo do contexto dos veiculos
interface VehicleContextType {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  deleteVehicle: (vehicleId: number) => Promise<void>;
  toggleVehicleActive: (vehicleId: number) => Promise<void>;
  createVehicle: (data: { name: string; plate: string }) => Promise<void>;
  updateVehicle: (
    data: { name: string; plate: string },
    id: number
  ) => Promise<void>;
  reloadVehicles: () => Promise<void>;
}

// Cria o contexto de veículos
const VehicleContext = createContext<VehicleContextType | undefined>(undefined);
// Props do Provider
interface VehicleProviderProps {
  children: ReactNode;
}
// Provider do contexto de veículos
export const VehicleProvider: React.FC<VehicleProviderProps> = ({
  children,
}) => {
  // Estados do contexto
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //hooks dos contexto de mensagem e de autenticaçao
  const { token } = useAuth();
  const { showMessage } = useMessage();

  // Efeito que carrega os veículos quando o token muda
  useEffect(() => {
    if (!token) return;
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    loadVehicles();
  }, [token]);

  // Função para carregar veículos da API
  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/vehicles/get-all");
      setVehicles(response.data);
    } catch (err) {
      setError("Falha ao carregar veículos");
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        //erros 500 e sem resposta
        if (!err.response) {
          showMessage(
            "danger",
            "Servidor indisponível. Verifique sua conexão.",
            3000
          );
          return;
        }

        if (status === 500) {
          showMessage(
            "danger",
            "Erro interno do servidor. Tente novamente mais tarde.",
            3000
          );
          return;
        }
        //erro generico
        showMessage("danger", "Erro ao carregar veículos!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Função para deletar um veículo
  const deleteVehicle = async (vehicleId: number) => {
    try {
      await api.delete(`/vehicles/delete?vehicleId=${vehicleId}`);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      showMessage("success", "Veículo deletado com sucesso!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        //erros 500 e sem resposta
        if (!err.response) {
          showMessage(
            "danger",
            "Servidor indisponível. Verifique sua conexão.",
            3000
          );
          return;
        }

        if (status === 500) {
          showMessage(
            "danger",
            "Erro interno do servidor. Tente novamente mais tarde.",
            3000
          );
          return;
        }
        //erro generico
        showMessage("danger", "Erro ao Deletar veículos!");
      }
    }
  };
  // Função para ativar/desativar um veículo
  const toggleVehicleActive = async (vehicleId: number) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    try {
      //monta o endpoint dependendo se o veiculo esta ativo ou inativo
      const endpoint = vehicle.isActive ? "archive" : "unarchive";
      await api.put(`/vehicles/${endpoint}?vehicleId=${vehicleId}`);

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, isActive: !v.isActive } : v
        )
      );
      showMessage(
        "success",
        `Veículo ${vehicle.isActive ? "Arquivado" : "Ativado"} com sucesso!`
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        //erros 500 e sem resposta
        if (!err.response) {
          showMessage(
            "danger",
            "Servidor indisponível. Verifique sua conexão.",
            3000
          );
          return;
        }

        if (status === 500) {
          showMessage(
            "danger",
            "Erro interno do servidor. Tente novamente mais tarde.",
            3000
          );
          return;
        }
      }
      //erro generico
      showMessage(
        "danger",
        `Erro ao ${vehicle.isActive ? "Arquivar" : "Ativar"} o veiculo!`
      );
    }
  };

  // Função para criar um novo veículo
  const createVehicle = async (data: { name: string; plate: string }) => {
    try {
      const response = await api.post("/vehicles/register", data);
      setVehicles((prev) => [...prev, response.data]);
    } catch (err) {
      // O tratamento de erro detalhado é feito no componente que chama esta função
      setError("Erro ao cadastrar veículo");
      throw err;
    }
  };
  // Função para atualizar um veículo existente
  const updateVehicle = async (
    data: { name: string; plate: string },
    id: number
  ) => {
    try {
      const response = await api.put(`/vehicles/update?vehicleId=${id}`, data);
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === id ? response.data : vehicle))
      );
    } catch (err) {
      // O tratamento de erro detalhado é feito no componente que chama esta função
      setError("Erro ao cadastrar veículo");
      throw err;
    }
  };

  // Retorna o Provider com todos os valores e funções disponíveis no contexto
  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        isLoading,
        error,
        deleteVehicle,
        toggleVehicleActive,
        createVehicle,
        updateVehicle,
        reloadVehicles: loadVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};
// Hook personalizado para usar o contexto de veículos
export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle deve ser usado dentro de um VehicleProvider");
  }
  return context;
};
