import { useState, useMemo } from "react";
import ParkingLayout from "../ParkingLayout";
import ParkingGrid from "../components/parking/grid/ParkingGrid";
import OccupancyCard from "../components/parking/cards/OccupancyCard";
import ParkingDetailsModal from "../components/parking/details/ParkingDetailsModal";
import { useParkingSelection } from "../hooks/UseParkingSelection";

export default function ParkingMapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [condoFilter, setCondoFilter] = useState("all");

  const {
    spots,
    occupancy,
    selectedId,
    selectedSpot,
    showDetailsModal,
    handleSelect,
    closeModal,
    reassignSpot,
    toggleMaintenance,
  } = useParkingSelection();

  const condominios = useMemo(
    () => [...new Set(spots.map((s) => s.condominio || "Sin condominio"))].sort(),
    [spots],
  );

  const filteredSpots = useMemo(() => {
    return spots.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        (s.plate || "").toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesCondo =
        condoFilter === "all" || (s.condominio || "Sin condominio") === condoFilter;
      return matchesSearch && matchesStatus && matchesCondo;
    });
  }, [spots, searchQuery, statusFilter, condoFilter]);

  const selectClass = `
    w-full appearance-none
    bg-white border border-slate-200
    text-slate-700 text-sm font-medium
    px-4 py-2.5 pr-10
    rounded-xl shadow-sm hover:shadow-md
    focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900
    transition-all cursor-pointer
  `;

  return (
    <ParkingLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Mapa de Estacionamiento
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Plano de espacios por condominio y torre.
          </p>
        </div>
        <OccupancyCard data={occupancy} />
      </div>

      {/* FILTROS */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:items-center">
        <div className="relative w-full lg:w-72">
          <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
            Condominio
          </label>
          <select
            value={condoFilter}
            onChange={(e) => setCondoFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">Todos los condominios</option>
            {condominios.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="absolute right-3 top-8.5 pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-base">expand_more</span>
          </div>
        </div>

        <div className="relative w-full lg:w-56">
          <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
            Estado
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="all">Todos</option>
            <option value="available">Disponibles</option>
            <option value="occupied">Ocupados</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
          <div className="absolute right-3 top-8.5 pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-base">expand_more</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 text-xs text-slate-500 lg:ml-auto pb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Libre
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-900" /> Ocupado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Mantención
          </span>
        </div>
      </div>

      {/* MAPA — ahora ocupa todo el ancho */}
      <ParkingGrid
        spots={filteredSpots}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      {/* MODAL en lugar del panel lateral y bottom sheet */}
      {showDetailsModal && selectedSpot && (
        <ParkingDetailsModal
          spot={selectedSpot}
          onClose={closeModal}
          onReassign={reassignSpot}
          onToggleMaintenance={toggleMaintenance}
        />
      )}
    </ParkingLayout>
  );
}