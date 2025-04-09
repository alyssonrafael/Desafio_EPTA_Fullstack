import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../contexts/MessageContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";
import image from "../assets/image.svg";
import logo from "../assets/logosistemas3-339x96 1.svg";

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const Register = () => {
  // Hooks para autenticação, navegação e mensagens
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  // Configuração do react-hook-form para validação
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  // Função de submissão do formulário de cadastro de cliente
  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      navigate("/");
      showMessage(
        "success",
        "Cadastro realizado com sucesso, efetue o login!",
        4000
      );
    } catch (err: unknown) {
      // Tratamento de diferentes tipos de erros
      showMessage(
        "warning",
        "Erro ao realizar cadastro, tente novamente!",
        3000
      );
      // Erros específicos da API
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 500) {
          showMessage(
            "danger",
            "Erro interno do servidor. Tente novamente mais tarde.",
            3000
          );
        } else if (err.response?.status === 409) {
          showMessage(
            "warning",
            "Erro ao realizar Cadastro. Confirme seu email",
            3000
          );
        } else if (err.request && !err.response) {
          showMessage(
            "danger",
            "Servidor indisponível. Verifique sua conexão.",
            3000
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Seção do formulário (esquerda em desktop, topo em mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md space-y-2">
          {/* Cabeçalho com logo */}
          <div className="text-center p-8 text-white">
            <img src={logo} alt="Logo" className="w-52 h-14 mx-auto" />
            <p className="text-gray-600 text-lg mt-4">
              Bem-vindo de volta! Insira seus dados.
            </p>
          </div>
          {/* Formulário de registro */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              type="email"
              label="Email"
              placeholder="Digite seu e-mail"
              error={errors.email?.message}
              {...register("email", {
                required: "Email é obrigatório",
                // validaçao de email
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
            />

            <Input
              type="text"
              label="Nome"
              placeholder="Digite seu nome"
              error={errors.name?.message}
              {...register("name", {
                required: "Nome é obrigatório",
                minLength: {
                  value: 3,
                  message: "Nome deve ter pelo menos 3 caracteres",
                },
              })}
            />

            <Input
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              error={errors.password?.message}
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: {
                  value: 6,
                  message: "Senha deve ter pelo menos 6 caracteres",
                },
              })}
            />

            <Input
              type="password"
              label="Confirmar senha"
              placeholder="Digite novamente sua senha"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Confirmação de senha é obrigatória",
                validate: (value) =>
                  value === watch("password") || "As senhas não coincidem",
              })}
            />
            {/* Botão de submissão */}
            <Button
              type="submit"
              loading={loading}
              label="Registar"
              classNameButton="w-full rounded-xl py-3"
              classNameText="font-bold"
            />
            {/* Link para login */}
            <div className="text-center text-sm text-gray-600 mt-8">
              Já tem uma conta?{" "}
              <a
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Faça login!
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Seção da imagem (direita em desktop, oculta em mobile) */}
      <div className="md:w-1/2 bg-backgroundLogin/20 hidden md:flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-8 text-white">
            <img src={image} alt="Logo" className="w-14 h-14 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
