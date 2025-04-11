import { useState } from "react";
import { FaTrash, FaSpinner } from "react-icons/fa";
import { HiOutlinePencil } from "react-icons/hi";
import { FaBoxArchive } from "react-icons/fa6";
import { MdOutbox } from "react-icons/md";
import { Vehicle } from "../types";
import { IoClose } from "react-icons/io5";

//interface com as props do componentte
interface VehicleTableRowProps {
  vehicle: Vehicle; //detalhes do veiculo
  //funçoes de editar, mudar status e deletar
  onEdit?: (id: number) => void;
  onToggleActive: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const VehicleTableRow = ({
  vehicle,
  onEdit,
  onToggleActive,
  onDelete,
}: VehicleTableRowProps) => {
  // Estado para controlar qual ação está carregando
  const [loadingAction, setLoadingAction] = useState<
    "toggle" | "delete" | null
  >(null);
  // modal para confirmar a exclusão
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Função para lidar com ativar/desativar veículo
  const handleToggle = async () => {
    setLoadingAction("toggle");
    try {
      await onToggleActive(vehicle.id);
    } finally {
      setLoadingAction(null);
    }
  };
  // Função para lidar com deletar veículo e fechar o modal
  const handleDelete = async () => {
    setLoadingAction("delete");
    setShowConfirmModal(false);
    try {
      await onDelete(vehicle.id);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <tr className="odd:bg-gray-50 even:bg-white text-textoPrimario">
        <td className="px-6 py-2 whitespace-nowrap font-light">
          {vehicle.name}
        </td>
        <td className="px-6 py-2 whitespace-nowrap font-light">
          {vehicle.plate}
        </td>
        <td className="px-6 py-2 whitespace-nowrap bg-gray-50">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full  ${
                vehicle.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="capitalize font-light">
              {vehicle.isActive ? "ativo" : "inativo"}
            </span>
          </div>
        </td>
        <td className="px-6 py-2 whitespace-nowrap text-sm font-light flex justify-end gap-2 bg-gray-50">
          <div className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition">
            <button
              title="Editar"
              onClick={() => onEdit?.(vehicle.id)}
              disabled={loadingAction !== null}
              className="text-black"
            >
              <HiOutlinePencil size={17} />
            </button>
          </div>

          <div className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition">
            {/* botao de mudar status com renderizaçao condicional caso loading */}
            <button
              onClick={handleToggle}
              disabled={loadingAction !== null}
              className="text-black"
              title={vehicle.isActive ? "Arquivar veículo" : "Ativar veículo"}
            >
              {loadingAction === "toggle" ? (
                <FaSpinner className="animate-spin" size={17} />
              ) : vehicle.isActive ? (
                <FaBoxArchive size={17} />
              ) : (
                <MdOutbox size={17} />
              )}
            </button>
          </div>

          <div className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition">
            {/* botao de deletar com renderizaçao condicional caso loading */}
            <button
              title="Deletar"
              onClick={() => setShowConfirmModal(true)}
              disabled={loadingAction !== null}
              className="text-black"
            >
              {loadingAction === "delete" ? (
                <FaSpinner className="animate-spin" size={17} />
              ) : (
                <FaTrash color="red" size={17} />
              )}
            </button>
          </div>
        </td>
      </tr>
      
      {/* Modal de confirmação de exclusãao */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="relative bg-white p-6 rounded-2xl w-full max-w-md shadow-lg space-y-6 mx-4 md:mx-0">
            <button
              onClick={() => {
                setShowConfirmModal(false);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              title="Fechar"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
            <p className="text-lg text-gray-700 mb-6">
              Você realmente deseja excluir{" "}
              <strong className="text-red-500">Permanentemente</strong> o
              veículo <strong>{vehicle.name.toUpperCase()}</strong>, de placa{" "}
              <strong>{vehicle.plate}</strong> ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              {/* ao confirmar chama o handleDelete */}
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
