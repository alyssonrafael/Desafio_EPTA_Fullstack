import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Reports";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";

const AppRoutes = () => {
  return (
    //provedor do contexto de autenticão envolvendo toda aplicação
    <AuthProvider> 
      <Router>
        <Routes>
          {/* rotas sem proteção */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rotas Protegidas pelo PrivateRoute */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/reports" element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
