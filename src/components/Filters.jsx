import { Calendar, ChevronDown } from "lucide-react";

const Filters = ({
  searchTerm,
  setSearchTerm,
  unitFilter,
  setUnitFilter,
  typeFilter,
  setTypeFilter,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Date Range */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rango de Fechas
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              defaultValue="Oct 10 - Oct 17"
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Plate Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Placa
          </label>
          <input
            type="text"
            placeholder="Buscar placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Unit/Resident Select */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Unidad / Residente
          </label>
          <div className="relative">
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors"
            >
              <option>Todas las Unidades</option>
              <option>Unidad 105</option>
              <option>Unidad 301</option>
              <option>Unidad 402</option>
              <option>Unidad 510</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-end gap-2 pt-5">
          <button
            onClick={() =>
              setTypeFilter(typeFilter === "Entradas" ? "Todos" : "Entradas")
            }
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === "Entradas"
                ? "bg-slate-100 border-slate-300 text-slate-900"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Filtrar Entradas
          </button>
          <button
            onClick={() =>
              setTypeFilter(typeFilter === "Salidas" ? "Todos" : "Salidas")
            }
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === "Salidas"
                ? "bg-slate-100 border-slate-300 text-slate-900"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Filtrar Salidas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
