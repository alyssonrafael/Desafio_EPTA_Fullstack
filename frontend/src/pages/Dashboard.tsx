import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useVehicle } from "../contexts/VehicleContext";
import { Vehicle } from "../types";
import { VehicleModal } from "../components/VehicleModal";
import { EditVehicleModal } from "../components/EditVehicleModal";
import { VehicleInfoCard } from "../components/VehicleInfoCard";
import { VehicleTable } from "../components/VehicleTable";
import { CiCirclePlus } from "react-icons/ci";
import Button from "../components/Button";
import IconTotal from "../assets/IconTotal.svg";
import IconInativos from "../assets/IconInativos.svg";
import IconAtivos from "../assets/IconAtivos.svg";

const DashboardLayout = () => {
  // Dados do usuário autenticado
  const { user } = useAuth();
  // Funções e dados de veículos
  const {
    vehicles,
    isLoading,
    deleteVehicle,
    toggleVehicleActive,
    reloadVehicles,
  } = useVehicle();
  // Estados para controle dos modais
  const [isModalOpen, setIsModalOpen] = useState(false); //estado para o modal de criaçao
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // estado do modal de ediçao
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null); // estado para indicar qual e o veiculo a ser editado

  // Calcular métricas gerais que vao ser exibidas nos cards
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.isActive === true).length;
  const inactiveVehicles = totalVehicles - activeVehicles;

  return (
    <div className="flex flex-col md:h-[calc(100vh-7rem)] px-4 gap-4">
      {/* Cabeçalho de boas-vindas */}
      <div className="space-y-4">
        <h1 className="text-3xl text-textoPrimario">
          Olá {user ? user.name : "Visitante"},
        </h1>
        <p className="text-xl text-textoSecundario font-light">
          Cadastre e gerencie seus veículos
        </p>
      </div>

      {/* Cards com métricas de veículos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VehicleInfoCard icon={IconTotal} title="Total" value={totalVehicles} />
        <VehicleInfoCard
          icon={IconAtivos}
          title="Ativos"
          value={activeVehicles}
        />
        <VehicleInfoCard
          icon={IconInativos}
          title="Inativos"
          value={inactiveVehicles}
        />
      </div>

      {/* Seção de cadastro com botão e modal de cadastro */}
      <div className="flex justify-between items-center">
        <Button
          label="Cadastrar Veículo"
          onClick={() => setIsModalOpen(true)} //arbe o modal ao ser clicado
          iconPosition="left"
          icon={<CiCirclePlus size={30} />}
          classNameButton="rounded-3xl"
          classNameText="font-semibold"
        />
        <VehicleModal
          isOpen={isModalOpen} //so exibe quando o estado e true
          onClose={() => setIsModalOpen(false)} //quando essa funçao e clicada no modal ele fecha
        />
      </div>

      {/* Tabela de veículos  */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="bg-white flex-1 flex flex-col min-h-0">
          <VehicleTable
            // Lista completa de veículos que será filtrada/ordenada internamente no componente
            vehicles={vehicles}
            // Estado que indica se os dados estão sendo carregados
            isLoading={isLoading}
            // Recebe o ID do veículo a ser editado
            onEdit={(id) => {
              // Encontra o veículo correspondente na lista pelo ID
              const v = vehicles.find((v) => v.id === id);
              // Se encontrou o veículo: armazena no estado de ediçao e abre o modal
              if (v) {
                setVehicleToEdit(v);
                setIsEditModalOpen(true);
              }
            }}
            // Função para deletar, altera status e recaregar veiculos inplementadas no contexto e passadas para tabela
            onToggleActive={toggleVehicleActive}
            onDelete={deleteVehicle}
            onReload={reloadVehicles}
          />
          {/* modal de ediçao de veiculo  */}
          <EditVehicleModal
            isOpen={isEditModalOpen}
            // Callback chamado quando modal é fechado
            onClose={() => {
              setIsEditModalOpen(false);
              setVehicleToEdit(null); // Limpa o veículo ao fechar
            }}
            vehicleToEdit={vehicleToEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
