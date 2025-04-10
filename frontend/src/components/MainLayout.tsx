import { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { SidebarNav } from "./SideBarNav";
import { IoIosArrowDown } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logosistemas3-339x96 1.svg";

export const MainLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); //cpntrola o menu Nav mobile
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); //controla o menu de usuario (dropdown)
  const navigate = useNavigate();
  const { logout } = useAuth(); //inporta a funçao de logout do contexto

  //funçao para realizar o logout
  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    // Container principal da aplicação - layout flex em tela cheia
    <div className="flex h-screen bg-white">
      {/* Sidebar/Navegação Lateral e suas clases para responsividade */}
      <div
        className={`
        fixed md:relative z-30
        w-72 px-2 bg-white text-textoInativo
        md:shadow-xl
        transform ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        h-full flex-shrink-0
        overflow-y-auto min-h-0
        `}
      >
        {/* Cabeçalho da Sidebar */}
        <div className="p-4 pt-14 flex items-center justify-between md:justify-center">
          <img src={logo} alt="Logo" className="w-44 h-14 mx-auto" />
          {/* Botão de fechar (visível apenas no mobile) */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>
        {/* Componente de navegação principal recebe props para fechar o menu no mobile */}
        <SidebarNav onNavClick={() => setIsMobileNavOpen(false)} />
      </div>

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho Superior (fixo) */}
        <header className="z-20">
          <div className="flex items-center justify-between md:justify-end px-6 py-4">
            {/* Botão do menu hamburguer (mobile apenas) */}
            <button
              className="md:hidden text-gray-500"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <FiMenu size={24} />
            </button>
            {/* Menu do usuário (dropdown) */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-12 h-8 text-xl rounded-full flex items-center justify-between">
                  <FaUser className="text-gray-500" />
                  <IoIosArrowDown className="text-blue-500" />
                </div>
              </button>
              {/* Dropdown do usuário */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="inline mr-2" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Conteúdo dinâmico das rotas (com scroll se necessário) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />{" "}
          {/* Componente do React Router que renderiza a rota atual */}
        </main>
      </div>
    </div>
  );
};
