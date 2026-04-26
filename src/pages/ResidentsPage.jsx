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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Directorio de Vehículos y Residentes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestión centralizada de residentes, unidades y vehículos autorizados
            </p>
          </div>

          <div className="flex items-center space-x-4">

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="Todos los Estados">Todos los Estados</option>
              <option value="Activo">Activo</option>
              <option value="Expirado">Expirado</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
            >
              <option value="Todos los Tipos">Todos los Tipos</option>
              <option value="Residente">Residente</option>
              <option value="Temporal">Temporal</option>
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
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