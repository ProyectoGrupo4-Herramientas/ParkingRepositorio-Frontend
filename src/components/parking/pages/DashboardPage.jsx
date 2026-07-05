import { useMemo } from "react";
import { useParking } from "../context/ParkingContext";
import OccupancyCard from "../components/parking/cards/OccupancyCard";
import { useParkingSelection } from "../hooks/UseParkingSelection";
import { Shield, Map, Users, History, Car, ParkingSquare, Wrench, DoorOpen } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, label, to, color }) {
  return (
    <a
      href={to}
      className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400">Ir al módulo →</p>
      </div>
    </a>
  );
}

export default function DashboardPage() {
  const { parkingSpaces, accessLog, spacesAvailable, spacesOccupied } = useParking();

  const vehiclesInside = useMemo(
    () => accessLog.filter((l) => !l.horaSalida).length,
    [accessLog],
  );

  const maintenanceCount = useMemo(
    () => parkingSpaces.filter((s) => s.enMantenimiento).length,
    [parkingSpaces],
  );

  const todayAccesses = useMemo(
    () =>
      accessLog.filter((l) => {
        if (!l.fechaEntrada) return false;
        const today = new Date();
        const entry = new Date(l.fechaEntrada);
        return (
          entry.getDate() === today.getDate() &&
          entry.getMonth() === today.getMonth() &&
          entry.getFullYear() === today.getFullYear()
        );
      }).length,
    [accessLog],
  );

  const total = parkingSpaces.length;
  const occupancy = useMemo(
    () => ({ occupied: spacesOccupied, available: spacesAvailable, total }),
    [spacesOccupied, spacesAvailable, total],
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Resumen del estado actual del estacionamiento.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Car}
          label="Vehículos dentro"
          value={vehiclesInside}
          color="bg-brand"
        />
        <StatCard
          icon={ParkingSquare}
          label="Espacios libres"
          value={spacesAvailable}
          color="bg-green-500"
        />
        <StatCard
          icon={DoorOpen}
          label="Espacios ocupados"
          value={spacesOccupied}
          color="bg-red-500"
        />
        <StatCard
          icon={Wrench}
          label="En mantenimiento"
          value={maintenanceCount}
          color="bg-amber-500"
        />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Accesos del día
          </p>
          <p className="text-3xl font-black text-slate-900">{todayAccesses}</p>
        </div>
        <OccupancyCard data={occupancy} />
      </div>

      {/* Quick links */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Acceso directo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLink icon={Shield} label="Control de Acceso" to="/access" color="bg-brand" />
        <QuickLink icon={Map} label="Mapa de Estacionamiento" to="/parking" color="bg-slate-700" />
        <QuickLink icon={Users} label="Directorio de Residentes" to="/residents" color="bg-indigo-500" />
        <QuickLink icon={History} label="Historial de Acceso" to="/history" color="bg-cyan-600" />
      </div>
    </div>
  );
}
