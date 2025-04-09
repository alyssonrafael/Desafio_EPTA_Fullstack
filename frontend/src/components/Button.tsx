import { FC, ReactNode } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  classNameButton?: string;
  classNameText?: string;
  icon?: ReactNode; // Para receber o ícone (qualquer componente React ou JSX)
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  classNameButton = "",
  classNameText = "",
  icon,
  iconPosition = "left", // Ícone por padrão na esquerda
  loading = false,
}) => {
  return (
    <button
    type={type}
    onClick={onClick}
    disabled={loading}
    className={`flex items-center justify-center gap-2 px-4 py-2 bg-botaoBg text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:opacity-70 disabled:cursor-not-allowed ${classNameButton}`}
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      <>
        {/* Ícone na esquerda */}
        {icon && iconPosition === "left" && (
          <span className="flex items-center">{icon}</span>
        )}
        <p className={`font-semibold ${classNameText}`}>{label}</p>
        {/* Ícone na direita */}
        {icon && iconPosition === "right" && (
          <span className="flex items-center">{icon}</span>
        )}
      </>
    )}
  </button>
  );
};

export default Button;
