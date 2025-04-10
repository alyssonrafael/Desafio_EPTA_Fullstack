import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from "./Button";
import Input from "./Input";
import { Vehicle } from "../types";
import { useMessage } from "../contexts/MessageContext";
import { useVehicle } from "../contexts/VehicleContext";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoClose } from "react-icons/io5";

// Interface para as props do modal de edição
interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleToEdit: Vehicle | null;
}
// Interface para as props do modal de edição
interface EditVehicleData {
  name: string;
  plate: string;
}

export const EditVehicleModal = ({
  isOpen,
  onClose,
  vehicleToEdit,
}: EditVehicleModalProps) => {
  //hooks do contexto de veiculo e de mensagem
  const { updateVehicle } = useVehicle();
  const { showMessage } = useMessage();
  // estado para controlar o loading
  const [loading, setLoading] = useState(false);
  // Configuração do formulário com react-hook-form
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EditVehicleData>();
  // Efeito que preenche o formulário quando o veículo para editar muda preenchendo com os dados atuais
  useEffect(() => {
    if (vehicleToEdit) {
      reset({
        name: vehicleToEdit.name,
        plate: vehicleToEdit.plate,
      });
    }
  }, [vehicleToEdit, reset]);

  // Função chamada ao submeter o formulário
  const onSubmit = async (data: EditVehicleData) => {
    setLoading(true);
    try {
      if (!vehicleToEdit) return;
      // Chama a função de atualização do contexto
      await updateVehicle(
        { name: data.name, plate: data.plate },
        vehicleToEdit.id
      );
      showMessage("success", "Veículo atualizado com sucesso!", 2000);
      reset(); // limpa o formulário se deu sucesso
      onClose(); //fecha o modal
    } catch (err: unknown) {
      const mensagemDefault = "Erro ao atualizar veículo, tente novamente!";
      if (!vehicleToEdit) return;
      // Tratamento detalhado de erros da API
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.error;
        // erro caso a placa ja exista
        if (status === 409) {
          showMessage(
            "warning",
            "Este veículo já está cadastrado! tente outra placa",
            4000
          );
          reset({
            name: vehicleToEdit.name,
            plate: vehicleToEdit.plate,
          });
          return;
        }
        //erros especificos de validaçao
        if (typeof message === "string") {
          if (message.includes("Invalid plate format")) {
            showMessage("warning", "Formato de placa inválido!", 3000);
            reset({
              name: vehicleToEdit.name,
              plate: vehicleToEdit.plate,
            });
          } else {
            showMessage("warning", `${mensagemDefault} (${message})`, 3000);
            reset({
              name: vehicleToEdit.name,
              plate: vehicleToEdit.plate,
            });
          }
          return;
        }
        //erro 500 e sem resposta
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
      // Erro genérico
      showMessage("warning", mensagemDefault, 3000);
    } finally {
      setLoading(false);
    }
  };
  // Não renderiza se não estiver aberto ou não tiver veículo para editar
  if (!isOpen || !vehicleToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-6 mx-4 md:mx-0">
        {/* Botão de fechar no topo direito */}
        <button
          onClick={() => {
            onClose();
            reset({ name: "", plate: "" });
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          title="Fechar"
        >
          <IoClose size={24} />
        </button>
        {/* Cabeçalho do modal */}
        <div className="flex justify-center items-center space-x-4">
          <LiaCarSideSolid size={50} />
          <h2 className="text-lg font-bold">Atualizar Veículo</h2>
        </div>
        {/* Formulário de edição */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              type="text"
              label="Nome do veículo"
              placeholder="Digite o nome do veículo"
              error={errors.name?.message}
              {...register("name", {
                required: "O nome é obrigatório",
                minLength: {
                  value: 3,
                  message: "O tamanho mínimo do nome é 3 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "O tamanho maxio do nome e de 50 caracteres",
                },
              })}
            />
          </div>
          <div>
            <Input
              type="text"
              label="Placa do veículo"
              placeholder="Digite a placa do veículo"
              error={errors.plate?.message}
              {...register("plate", {
                required: "A placa é obrigatória",
                pattern: {
                  value: /^[A-Za-z]{3}\d{4}$|^[A-Za-z]{3}\d[A-Za-z]\d{2}$/,
                  message: "Formato de placa inválido. Ex: ABC1234 ou ABC1D23",
                },
              })}
            />
          </div>
          <div>
            {/* Botão de submit */}
            <Button
              type="submit"
              loading={loading}
              label="Confirmar Edição"
              classNameButton="w-full rounded-xl py-1"
              classNameText="font-bold"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
