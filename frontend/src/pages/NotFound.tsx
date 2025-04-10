import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoBack = () => {
    logout(); // Executa o logout do contexto
    navigate("/"); // Redireciona para a página de login
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="text-8xl font-bold text-red-400 opacity-20">
              404
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Oops! Página não encontrada
        </h1>
        <p className="text-gray-600">
          A página que você está procurando pode ter sido removida ou está
          temporariamente indisponível.
        </p>

        <div className="pt-4">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Voltar para o Login
          </button>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          Se você acredita que isso é um erro, entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
