import { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import StatsCards from "../components/StatsCards";
import VehicleTable from "../components/VehicleTable";
import VehicleModal from "../components/VehicleModal";
import { useParking } from "../context/ParkingContext";

export default function Residents() {
  const { vehicles, addVehicle } = useParking();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los Estados");
  const [typeFilter, setTypeFilter] = useState("Todos los Tipos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adaptedVehicles = vehicles.map((v) => ({
    id: v.id,
    plate: v.placa,
    unit: v.unidad,
    owner: v.propietario,
    type: v.tipoOcupante === "residente" ? "Residente" : "Temporal",
    status: v.estado === "activo" ? "Activo" : "Expirado",
    expiration: v.fechaExpiracion,
  }));

  const handleAddVehicle = (newVehicle) => {
    addVehicle({
      placa: newVehicle.plate,
      unidad: newVehicle.unit,
      propietario: newVehicle.owner,
      vehiculoDesc: "",
      tipoOcupante: newVehicle.type === "Residente" ? "residente" : "visitante",
      estado: "activo",
      fechaExpiracion: newVehicle.expiration || null,
      espacioAsignado: null,
    });
  };

  const filteredVehicles = useMemo(() => {
    let filtered = adaptedVehicles;

    if (statusFilter !== "Todos los Estados") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }
    if (typeFilter !== "Todos los Tipos") {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.plate.toLowerCase().includes(q) ||
          v.owner.toLowerCase().includes(q) ||
          v.unit.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [adaptedVehicles, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: adaptedVehicles.length,
      activeResidents: adaptedVehicles.filter(
        (v) => v.type === "Residente" && v.status === "Activo",
      ).length,
      temporalPasses: adaptedVehicles.filter((v) => v.type === "Temporal")
        .length,
      alerts: adaptedVehicles.filter((v) => v.status === "Expirado").length,
    }),
    [adaptedVehicles],
  );

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-7xl mx-auto space-y-6 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Directorio de Vehículos y Residentes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestión centralizada de residentes, unidades y vehículos
              autorizados
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

            <input
              type="text"
              placeholder="Buscar placa o propietario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm max-w-xs focus:ring-1 focus:ring-gray-900 focus:outline-none"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
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

        <StatsCards stats={stats} />

        <VehicleTable
          vehicles={filteredVehicles}
          totalCount={adaptedVehicles.length}
        />
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
      />
    </MainLayout>
  );
}
