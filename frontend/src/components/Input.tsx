import React, { InputHTMLAttributes } from 'react';

// Estende as propriedades padrão do input HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;        
  error?: string;       
  className?: string;    
  containerClassName?: string; 
}

// Componente Input com encaminhamento de ref (para uso com react-hook-form)
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',     // Tipo padrão é 'text'
      label,             // Rótulo do campo
      name,              // Nome do campo
      placeholder = '',  // Placeholder do input
      error,             // Mensagem de erro
      className = '',    // Classes CSS adicionais
      containerClassName = '', // Classes do container
      ...props           // Todas outras props padrão do input
    },
    ref                 // Ref para acesso direto ao elemento input
  ) => {
    return (
      <div className={`mb-4 ${containerClassName}`}>
        {/* Rótulo do campo (se fornecido) */}
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
            {label}
          </label>
        )}
        
        {/* Elemento input principal */}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-xl border-black/25 shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-500' : 'border-gray-300'} // Borda vermelha se erro
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
          {...props} // Todas outras props do input
        />
        
        {/* Mensagem de erro (se houver) */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

export default Input;