import { FiInbox } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";

interface SidebarNavProps {
  onNavClick?: () => void; //opcional para fechar o menu quando navegar
}

export const SidebarNav = ({ onNavClick }: SidebarNavProps) => {
  return (
    <nav className="mt-8">
      <h1 className="ml-6 mb-6 text-xl text-textoPrimario font-light">
        Navegação
      </h1>
      {/* link para dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-200 rounded-xl ${
            isActive
              ? "bg-gray-100 text-blue-500 font-semibold"
              : "text-gray-700"
          }`
        }
        onClick={onNavClick}
      >
        <RxDashboard className="mr-3 text-2xl" />
        Dashboard
      </NavLink>
      {/* link para relatorios */}
      <NavLink
        to="/reports"
        className={({ isActive }) =>
          `flex items-center px-6 py-3 text-sm font-medium hover:bg-gray-200 rounded-xl ${
            isActive
              ? "bg-gray-100 text-blue-500 font-semibold"
              : "text-gray-700"
          }`
        }
        onClick={onNavClick}
      >
        <FiInbox className="mr-3 text-2xl" />
        Reports
      </NavLink>
    </nav>
  );
};
