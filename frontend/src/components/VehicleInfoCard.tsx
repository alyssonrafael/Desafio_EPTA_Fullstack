import React from "react";
// interface com as props reebidas do componente
interface VehicleInfoCardProps {
  icon: string;
  title: string;
  value: number;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-white shadow-xs rounded-lg p-4 flex items-center gap-4">
      <img src={icon} alt="Ícone" className="w-14 h-14" />
      <div>
        <h3 className="text-textoCard">{title}</h3>
        <p className="text-3xl font-bold text-textoPrimario">{value}</p>
      </div>
    </div>
  );
};
