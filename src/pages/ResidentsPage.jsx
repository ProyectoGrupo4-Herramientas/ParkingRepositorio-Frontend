import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import StatsCards from "../components/StatsCards";
import VehicleTable from "../components/VehicleTable";
import VehicleModal from "../components/VehicleModal";
import {
  getVehicles,
  saveVehicles,
  updateStatuses,
} from "../utils/localStorage";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los Estados");
  const [typeFilter, setTypeFilter] = useState("Todos los Tipos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadedVehicles = getVehicles();
    const updatedVehicles = updateStatuses(loadedVehicles);
    setVehicles(updatedVehicles);

    const interval = setInterval(() => {
      setVehicles((prev) => updateStatuses(prev));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddVehicle = (newVehicle) => {
    const updatedVehicles = [
      ...vehicles,
      { ...newVehicle, id: Date.now().toString() },
    ];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
  };

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (statusFilter !== "Todos los Estados") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    if (typeFilter !== "Todos los Tipos") {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.plate.toLowerCase().includes(lowerQuery) ||
          v.owner.toLowerCase().includes(lowerQuery) ||
          v.unit.toLowerCase().includes(lowerQuery)
      );
    }

    return filtered;
  }, [vehicles, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const total = vehicles.length;
    const activeResidents = vehicles.filter(
      (v) => v.type === "Residente" && v.status === "Activo"
    ).length;
    const temporalPasses = vehicles.filter((v) => v.type === "Temporal").length;
    const alerts = vehicles.filter((v) => v.status === "Expirado").length;

    return { total, activeResidents, temporalPasses, alerts };
  }, [vehicles]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-8">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Directorio de Vehículos y Residentes</h1>
                <p className="text-sm text-gray-500 mt-1">Gestión centralizada de residentes, unidades y vehículos autorizados</p>
              </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 md:gap-4 w-full xl:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full lg:w-auto bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer outline-none appearance-none pr-8 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="Todos los Estados">Todos los Estados</option>
                  <option value="Activo">Activo</option>
                  <option value="Expirado">Expirado</option>
                </select>
                
                <div className="hidden lg:block w-px h-6 bg-gray-300"></div>
                
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full lg:w-auto bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer outline-none appearance-none pr-8 relative"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239ca3af\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1rem' }}
                >
                  <option value="Todos los Tipos">Todos los Tipos</option>
                  <option value="Residente">Residente</option>
                  <option value="Temporal">Temporal</option>
                </select>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full lg:w-auto flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m8 0h1M5.8 5l-2.2 5M18.2 5l2.2 5M4 19h16a1 1 0 001-1v-5a1 1 0 00-1-1H4a1 1 0 00-1 1v5a1 1 0 001 1z"></path></svg>
                  Añadir Vehículo
                </button>
              </div>
        </div>

        {/* STATS */}
        <StatsCards stats={stats} />

        {/* TABLE */}
        <VehicleTable
          vehicles={filteredVehicles}
          totalCount={vehicles.length}
        />
      </div>

      {/* MODAL */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
      />
    </MainLayout>
  );
}