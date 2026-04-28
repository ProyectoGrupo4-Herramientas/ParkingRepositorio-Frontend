import { Calendar, ChevronDown } from 'lucide-react';

const Filters = ({ 
  searchTerm, setSearchTerm, 
  unitFilter, setUnitFilter, 
  typeFilter, setTypeFilter,
  startDate, setStartDate,
  endDate, setEndDate
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-end">
        
        {/* Date Range */}
        <div className="lg:col-span-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Rango de Fechas</label>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors"
            />
            <span className="text-slate-400 font-medium">-</span>
            <input 
              type="date" 
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Plate Search */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Placa</label>
          <input 
            type="text" 
            placeholder="Buscar placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Unit/Resident Select */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-2">Unidad / Residente</label>
          <div className="relative">
            <select 
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-colors"
            >
              <option>Todas las Unidades</option>
              <option>Unit 105</option>
              <option>Unit 301</option>
              <option>Unit 402</option>
              <option>Unit 510</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row items-end gap-3 mt-2 lg:mt-0 w-full">
          <button 
            onClick={() => setTypeFilter(typeFilter === 'Entradas' ? 'Todos' : 'Entradas')}
            className={`w-full sm:flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === 'Entradas' 
                ? 'bg-slate-100 border-slate-300 text-slate-900' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Filtrar Entradas
          </button>
          <button 
            onClick={() => setTypeFilter(typeFilter === 'Salidas' ? 'Todos' : 'Salidas')}
            className={`w-full sm:flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              typeFilter === 'Salidas' 
                ? 'bg-slate-100 border-slate-300 text-slate-900' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
