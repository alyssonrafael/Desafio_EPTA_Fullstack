import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { JSX } from 'react';

interface PrivateRouteProps {
  children: JSX.Element; // O conteúdo que será protegido pela rota privada
}
// Componente que atua como um guardião de rota privada
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Obtém o token de autenticação do contexto de autenticação
  const { token } = useAuth();

  // Se existir um token, renderiza o conteúdo filho
  // Caso contrário, redireciona para a página " / " login
  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
