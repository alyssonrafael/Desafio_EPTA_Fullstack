import { useState } from "react";
import { Vehicle } from "../types";
import { VehicleTableRow } from "./VehicleTableRow";
import { FiRefreshCcw } from "react-icons/fi";

//interface com as props para o componente
interface VehicleTableProps {
  vehicles: Vehicle[]; //lista de veiculos
  isLoading: boolean; // Estado de carregamento
  // funçao de edit para o modal de ediçao
  onEdit?: (id: number) => void;
  // funçoes de deleçao mudar status e recarregar os veiculos
  onToggleActive: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReload: () => Promise<void>;
}
//tipo pra ordenação e filtro
type OrderBy = "newest" | "oldest";
type StatusFilter = "all" | "active" | "inactive";

export const VehicleTable = ({
  vehicles,
  isLoading,
  onEdit,
  onToggleActive,
  onDelete,
  onReload,
}: VehicleTableProps) => {
  // estados para ordenaçao e filtro
  const [orderBy, setOrderBy] = useState<OrderBy>("newest");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtragem e ordenação dos veículos
  let filteredAndSortedVehicles = [...vehicles];
  // Aplicar filtro por status (ativo/inativo)
  if (statusFilter !== "all") {
    const isActive = statusFilter === "active";
    filteredAndSortedVehicles = filteredAndSortedVehicles.filter(
      (v) => v.isActive === isActive
    );
  }
  // Aplicar filtro por termo de pesquisa
  if (searchTerm.trim()) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredAndSortedVehicles = filteredAndSortedVehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(lowerSearch) ||
        v.plate.toLowerCase().includes(lowerSearch)
    );
  }
  // Ordenar veículos por data
  filteredAndSortedVehicles.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return orderBy === "newest" ? dateB - dateA : dateA - dateB;
  });
  // Funções para manipulação dos filtros
  const toggleOrder = () => {
    setOrderBy((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  const toggleStatusFilter = () => {
    setStatusFilter((prev) =>
      prev === "all" ? "active" : prev === "active" ? "inactive" : "all"
    );
  };

  //funçao para limpar todos os filtros
  const clearFilters = () => {
    setOrderBy("newest");
    setStatusFilter("all");
    setSearchTerm("");
  };
  // Verifica se há filtros ativos
  const hasFilters =
    orderBy !== "newest" || statusFilter !== "all" || searchTerm.trim() !== "";

  return (
    <>
      {/* Barra de controles (pesquisa e filtros) */}
      <div className="w-full flex flex-col gap-2 sm:flex-row  sm:justify-between mb-4">
        {/* Input de pesquisa e botão de atualiza */}
        <div className="w-full sm:max-w-xs flex items-center gap-2">
          <input
            type="text"
            placeholder="Pesquisar veículos cadastrados"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm truncate"
            title="pesquisar veiculo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={onReload}
            className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Atualizar lista de veículos"
          >
            <FiRefreshCcw className="w-5 h-5" />
          </button>
        </div>
        {/* Botões de filtro */}
        <div className="flex flex-wrap  gap-2 mt-2 sm:mt-0">
          <button
            onClick={toggleOrder}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
          >
            {orderBy === "newest" ? "Mais novos ↓" : "Mais antigos ↑"}
          </button>

          <button
            onClick={toggleStatusFilter}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
          >
            {statusFilter === "all"
              ? "Todos"
              : statusFilter === "active"
              ? "Ativos"
              : "Inativos"}
          </button>
          {/* Botão para limpar filtros (só aparece quando há filtros ativos) */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              title="Limpar filtros"
              className="px-3 flex items-center justify-center  text-gray-500 hover:text-red-500 border border-gray-300 hover:border-red-400 rounded-full transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {/* Conteúdo da tabela se loading indica por meio da renderizaçao condicional */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Carregando veículos...</span>
        </div>
      ) : filteredAndSortedVehicles.length === 0 ? (
        // Mensagem quando não há veículos personalizada para melhor experiencia
        <p>
          Nenhum veículo{" "}
          {statusFilter === "all"
            ? ""
            : statusFilter === "active"
            ? "ativo"
            : "inativo"}{" "}
          encontrado
          {searchTerm.trim() && ` para: "${searchTerm}"`}
        </p>
      ) : (
         // Tabela de veículos que usa o restante do espaço disponivel na tela sem gerar scroll da pagina inteira so da tabela
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto rounded-lg">
          <table className="w-full table-auto border-separate border-spacing-y-1">
            <thead className="sticky top-0 bg-white z-10 ">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-light text-textoPrimario tracking-wider">
                  Veículo
                </th>
                <th className="px-6 py-3 text-left text-lg font-light text-textoPrimario tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-lg font-light text-textoPrimario tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Renderiza cada linha da tabela usando o componente VehicleTableRow usando os veiculos filtrados */}
              {filteredAndSortedVehicles.map((vehicle) => (
                <VehicleTableRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={onEdit}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
