import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Reports";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { MessageProvider } from "../contexts/MessageContext";
import { MainLayout } from "../components/MainLayout";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    // provedor do contexto de mensagem para que ela seja gerenciada globalmente
    <MessageProvider>
      {/* provedor do contexto de autenticão envolvendo toda aplicação */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* rotas sem proteção */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Rotas Protegidas pelo PrivateRoute e com o layout padrao */}
            <Route
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
            </Route>
            {/* Rota para página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MessageProvider>
  );
};

export default AppRoutes;
