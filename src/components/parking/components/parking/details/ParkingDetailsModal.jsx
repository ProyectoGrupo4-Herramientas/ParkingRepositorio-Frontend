import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ReassignModal from "../modals/ReassignModal";
import MaintenanceModal from "../modals/MaintenanceModal";

const statusConfig = {
  occupied: { label: "OCUPADO", classes: "bg-red-100 text-red-600", dot: "bg-red-500" },
  available: { label: "DISPONIBLE", classes: "bg-green-100 text-green-600", dot: "bg-green-500" },
  reserved: { label: "RESERVADO", classes: "bg-blue-100 text-blue-600", dot: "bg-blue-500" },
  maintenance: { label: "MANTENIMIENTO", classes: "bg-amber-100 text-amber-600", dot: "bg-amber-400" },
};

export default function ParkingDetailsModal({ spot, onClose, onReassign, onToggleMaintenance }) {
  const [visible, setVisible] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  if (!spot) return null;

  const cfg = statusConfig[spot.status] || statusConfig.available;
  const isMaintenance = spot.status === "maintenance";
  const canToggleMaintenance = spot.status === "available" || isMaintenance;

  const handleReassign = (unit, plate) => {
    setShowReassign(false);
    onReassign?.(spot.id, unit, plate);
    handleClose();
  };

  const handleMaintenance = (newStatus) => {
    setShowMaintenance(false);
    onToggleMaintenance?.(spot.id, newStatus);
    handleClose();
  };

  return (
    <>
      {showReassign && (
        <ReassignModal onConfirm={handleReassign} onCancel={() => setShowReassign(false)} />
      )}
      {showMaintenance && (
        <MaintenanceModal
          isEntering={!isMaintenance}
          onConfirm={handleMaintenance}
          onCancel={() => setShowMaintenance(false)}
        />
      )}

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
          visible ? "bg-black/40" : "bg-transparent pointer-events-none"
        }`}
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.classes}`}>
                <span className="material-symbols-outlined text-lg">
                  {spot.status === "occupied" ? "directions_car" : spot.status === "maintenance" ? "build" : "local_parking"}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 truncate">
                  Espacio {spot.code}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className={`text-xs font-semibold ${cfg.classes.split(" ")[0]} px-1.5 py-0.5 rounded`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Info cards */}
            {spot.condominio && (
              <InfoRow icon="apartment" label="Condominio" value={spot.condominio} />
            )}
            {spot.zona && (
              <InfoRow icon="meeting_room" label="Torre / Zona" value={spot.zona} />
            )}

            {/* Vehículo (solo ocupado) */}
            {spot.status === "occupied" && spot.plate && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Vehículo Actual
                </p>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-600">directions_car</span>
                  <div>
                    <p className="font-bold text-slate-900">{spot.plate}</p>
                    <p className="text-xs text-slate-400">{spot.desc || "Vehículo registrado"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Residente (solo ocupado) */}
            {spot.status === "occupied" && (
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Residente Asignado
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {spot.initials || "JD"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">
                      {spot.owner || "Ocupación Actual"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {spot.unit || "Unidad --"} • Inquilino Principal
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Aviso */}
            {!canToggleMaintenance && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                <span className="material-symbols-outlined text-amber-500 shrink-0" style={{ fontSize: 18 }}>info</span>
                Solo se puede marcar para mantenimiento si el espacio está disponible.
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-2">
            {!isMaintenance && (
              <button
                onClick={() => setShowReassign(true)}
                className="w-full bg-brand text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>swap_horiz</span>
                Reasignar a Unidad
              </button>
            )}

            <button
              onClick={() => canToggleMaintenance && setShowMaintenance(true)}
              disabled={!canToggleMaintenance}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                isMaintenance
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : canToggleMaintenance
                    ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    : "border border-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                {isMaintenance ? "check_circle" : "build"}
              </span>
              {isMaintenance ? "Marcar como Disponible" : "Marcar para Mantenimiento"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="material-symbols-outlined text-slate-500 shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}