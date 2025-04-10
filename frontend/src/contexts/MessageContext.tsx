import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
// Ícones para cada tipo de mensagem
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";

// Tipos possíveis de mensagem
type MessageType = "success" | "danger" | "info" | "warning";

// Interface do contexto - define o que o contexto oferece
interface MessageContextData {
  showMessage: (type: MessageType, text: string, duration?: number) => void;
}

// Cria o contexto com tipo definido
const MessageContext = createContext<MessageContextData | undefined>(undefined);

// Props do componente de mensagem temática
interface ThemedMessageProps {
  type: MessageType;
  message: string;
  isVisible: boolean;
}

// Mapeamento de ícones para cada tipo de mensagem
const iconMap = {
  success: AiOutlineCheckCircle,
  danger: AiOutlineCloseCircle,
  info: AiOutlineInfoCircle,
  warning: AiOutlineWarning,
};

// Componente que renderiza a mensagem estilizada
const ThemedMessage = ({ type, message, isVisible }: ThemedMessageProps) => {
  const bgColors = {
    success: "bg-green-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  const textColors = {
    success: "text-green-100",
    danger: "text-red-100",
    info: "text-blue-100",
    warning: "text-yellow-100",
  };

  const Icon = iconMap[type];
  
  // Animação horizontal para ambos (mobile e desktop)
  const transitionClass = isVisible
    ? "translate-x-0 opacity-100"  // Visível: sem translação
    : "translate-x-full opacity-0"; // Invisível: deslocado para direita

  return (
    <div
      className={`
        /* Estilos gerais */
        ${bgColors[type]} ${textColors[type]}
        px-4 py-3 rounded-lg shadow-lg 
        w-[calc(100vw-2rem)] max-w-md
        transition-all duration-500 ease-out transform
        ${transitionClass}
        
        /* Estilos mobile */
        mx-4

        /* Estilos desktop */
        sm:mx-0 sm:w-full
      `}
    >
      <div className="flex items-center gap-3">
        {/* Ícone responsivo */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Texto responsivo */}
        <div className="flex-1">
          <span className="text-sm sm:text-base font-medium leading-snug">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};

// Provider que envolve a aplicação
export const MessageProvider = ({ children }: { children: ReactNode }) => {
  // Estados para controlar a mensagem
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Função para exibir mensagens
  const showMessage = (type: MessageType, text: string, duration = 5000) => {
    // Limpa timeout anterior se existir
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Atualiza estados
    setMessage(text);
    setMessageType(type);
    setIsVisible(false); // Começa invisível para animação de entrada

    // Pequeno delay para iniciar animação de entrada
    setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Configura timeout para esconder a mensagem após a duração
    const id = window.setTimeout(() => {
      setIsVisible(false); // Inicia animação de saída
      
      // Remove a mensagem do DOM após animação de saída
      window.setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 1000);
    }, duration) as unknown as number;

    setTimeoutId(id);
  };

  // Limpa timeout quando o componente desmonta
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {/* Container principal - posição diferente para mobile/desktop */}
      <div className={`
        fixed z-50 pointer-events-none

        /* Mobile: parte inferior centralizada */
        bottom-4 left-0 right-0 flex justify-center

        /* Desktop: canto superior direito */
        sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto
      `}>
        {message && messageType && (
          <ThemedMessage
            type={messageType}
            message={message}
            isVisible={isVisible}
          />
        )}
      </div>
    </MessageContext.Provider>
  );
};

// Hook para usar o contexto de mensagem
export const useMessage = (): MessageContextData => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage deve ser usado dentro de um MessageProvider");
  }
  return context;
};