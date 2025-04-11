import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useState } from "react";
import { useMessage } from "../contexts/MessageContext";
import axios from "axios";
import Button from "../components/Button";
import image from "../assets/image.svg";
import logo from "../assets/logosistemas3-339x96 1.svg";

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  // Hooks para autenticação, navegação e mensagens
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  // Configuração do react-hook-form para validação
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  // Função de submissão do formulário de login
  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
      showMessage("success", "Login realizado com sucesso!", 2000);
    } catch (err: unknown) {
      // Tratamento de diferentes tipos de erros
      showMessage(
        "warning",
        "Email ou senha incorretos, tente novamente!",
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Seção do formulário (esquerda em desktop, topo em mobile) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md space-y-10">
          <div className="text-center p-8 text-white">
            <img src={logo} alt="Logo" className="w-52 h-14 mx-auto" />
            <p className="text-gray-600 text-lg mt-4">
              Bem-vindo de volta! Insira seus dados.
            </p>
          </div>
          {/* Formulário de login */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              type="text"
              label="Email"
              placeholder="Digite seu e-mail"
              error={errors.email?.message}
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
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
            {/* Botão de submissão */}
            <Button
              type="submit"
              loading={loading}
              label="Entar"
              classNameButton="w-full rounded-xl py-3"
              classNameText="font-bold"
            />
            {/* Link para Register */}
            <div className="text-center text-sm text-gray-600 mt-16">
              Não tem uma conta?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Cadastre-se gratuitamente!
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

export default Login;
