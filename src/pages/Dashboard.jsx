import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import VehicleTable from '../components/VehicleTable';
import VehicleModal from '../components/VehicleModal';
import { getVehicles, saveVehicles, updateStatuses } from '../utils/localStorage';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los Estados');
  const [typeFilter, setTypeFilter] = useState('Todos los Tipos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load and update initial vehicles
    const loadedVehicles = getVehicles();
    const updatedVehicles = updateStatuses(loadedVehicles);
    setVehicles(updatedVehicles);

    // Set interval to periodically update status for temporal passes
    const interval = setInterval(() => {
      setVehicles(prev => updateStatuses(prev));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddVehicle = (newVehicle) => {
    const updatedVehicles = [...vehicles, { ...newVehicle, id: Date.now().toString() }];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
  };

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (statusFilter !== 'Todos los Estados') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (typeFilter !== 'Todos los Tipos') {
      filtered = filtered.filter(v => v.type === typeFilter);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.plate.toLowerCase().includes(lowerQuery) ||
        v.owner.toLowerCase().includes(lowerQuery) ||
        v.unit.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  // Derived stats
  const stats = useMemo(() => {
    const total = vehicles.length;
    const activeResidents = vehicles.filter(v => v.type === 'Residente' && v.status === 'Activo').length;
    const temporalPasses = vehicles.filter(v => v.type === 'Temporal').length;
    const alerts = vehicles.filter(v => v.status === 'Expirado').length;

    return { total, activeResidents, temporalPasses, alerts };
  }, [vehicles]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      <Sidebar onOpenModal={() => setIsModalOpen(true)} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Directorio de Vehículos y Residentes</h1>
                <p className="text-sm text-gray-500 mt-1">Gestión centralizada de residentes, unidades y vehículos autorizados</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer outline-none appearance-none pr-8 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="Todos los Estados">Todos los Estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Expirado">Expirado</option>
                </select>
                
                <div className="w-px h-6 bg-gray-300"></div>
                
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer outline-none appearance-none pr-8 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="Todos los Tipos">Todos los Tipos</option>
                  <option value="Residente">Residente</option>
                  <option value="Temporal">Temporal</option>
                </select>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m8 0h1M5.8 5l-2.2 5M18.2 5l2.2 5M4 19h16a1 1 0 001-1v-5a1 1 0 00-1-1H4a1 1 0 00-1 1v5a1 1 0 001 1z"></path></svg>
                  Añadir Vehículo
                </button>
              </div>
            </div>

            <StatsCards stats={stats} />
            
            <VehicleTable vehicles={filteredVehicles} totalCount={vehicles.length} />
          </div>
        </main>
      </div>

      <VehicleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddVehicle} 
      />
    </div>
  );
};

export default Dashboard;
