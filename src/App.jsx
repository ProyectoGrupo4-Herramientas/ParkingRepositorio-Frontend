import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Filters from './components/Filters';
import AccessTable from './components/AccessTable';
import Pagination from './components/Pagination';
import { useState, useMemo, useEffect } from 'react';
import { mockData } from './data/mockData';

function App() {
  // Inicializar estado desde LocalStorage si existe, si no, usar mockData
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('parkControlData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return mockData;
  });

  // Guardar en LocalStorage cada vez que la data cambie
  useEffect(() => {
    localStorage.setItem('parkControlData', JSON.stringify(data));
  }, [data]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas las Unidades');
  const [typeFilter, setTypeFilter] = useState('Todos'); // 'Todos', 'Entradas', 'Salidas'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.placa.toLowerCase().includes(searchTerm.toLowerCase());
      const matchUnit = unitFilter === 'Todas las Unidades' || item.unidad === unitFilter;

      let matchType = true;
      if (typeFilter === 'Entradas') {
        // simplified logic: if there is no exit time, or just want to see entries
        // The prompt says "Filtrar solo entradas", maybe meaning entries without exit yet? Or all? Let's assume entries only means we just show items with entry time, but all have entry time.
        // Let's assume "Entradas" means the user is filtering by something specific or sorting. 
        // Actually, maybe we filter by "Aún dentro" for entries?
        // Let's implement standard filtering: if 'Entradas', we show only those that are currently inside ("Aún dentro"). If 'Salidas', those that have left.
        matchType = item.horaSalida === 'Aún dentro';
      } else if (typeFilter === 'Salidas') {
        matchType = item.horaSalida !== 'Aún dentro';
      }

      return matchSearch && matchUnit && matchType;
    });
  }, [data, searchTerm, unitFilter, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f9]">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Header dataToExport={filteredData} />
            <Filters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              unitFilter={unitFilter}
              setUnitFilter={setUnitFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />

            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <AccessTable data={currentData} />
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Registro detallado de todos los movimientos vehiculares históricos.
                </span>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
