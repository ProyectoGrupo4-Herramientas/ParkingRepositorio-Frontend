import { useState, useEffect } from "react";
import { X, UserPlus, Handshake, UserX } from "lucide-react";
import OwnerModal from "../../../modals/OwnerModal";
import LoanModal from "../../../modals/LoanModal";
import MaintenanceModal from "../modals/MaintenanceModal";

const statusConfig = {
  occupied: { label: "OCUPADO", classes: "bg-red-100 text-red-600", dot: "bg-red-500" },
  available: { label: "DISPONIBLE", classes: "bg-green-100 text-green-600", dot: "bg-green-500" },
  reserved: { label: "RESERVADO", classes: "bg-blue-100 text-blue-600", dot: "bg-blue-500" },
  maintenance: { label: "MANTENIMIENTO", classes: "bg-amber-100 text-amber-600", dot: "bg-amber-400" },
};

const tipoOcupanteLabel = {
  PROPIO: "Uso propio",
  PRESTAMO: "Préstamo temporal",
  VISITANTE: "Visitante",
};

const tipoOcupanteClass = {
  PROPIO: "bg-green-100 text-green-700",
  PRESTAMO: "bg-indigo-100 text-indigo-700",
  VISITANTE: "bg-amber-100 text-amber-700",
};

export default function ParkingDetailsModal({
  spot,
  onClose,
  onReassign,
  onToggleMaintenance,
  onAssignOwner,
  onRemoveOwner,
  onCreateLoan,
  onFinalizeLoan,
}) {
  const [visible, setVisible] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
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
  const canLoan = spot.owner && spot.status === "available" && !spot.activeLoan;
  const hasActiveLoan = !!spot.activeLoan;

  const handleOwnerConfirm = (estacionamientoId, usuarioId, nombreUsuario, placaVehiculo) => {
    setShowOwnerModal(false);
    onAssignOwner?.(estacionamientoId, usuarioId, nombreUsuario, placaVehiculo);
    handleClose();
  };

  const handleLoanConfirm = (data) => {
    setShowLoanModal(false);
    onCreateLoan?.(data);
    handleClose();
  };

  const handleFinalizeLoan = () => {
    if (spot.activeLoan) {
      onFinalizeLoan?.(spot.activeLoan.idPrestamo);
      handleClose();
    }
  };

  const handleRemoveOwner = () => {
    onRemoveOwner?.(spot.id);
    handleClose();
  };

  const handleMaintenance = (newStatus) => {
    setShowMaintenance(false);
    onToggleMaintenance?.(spot.id, newStatus);
    handleClose();
  };

  return (
    <>
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
          <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cfg.classes}`}>
                <span className="material-symbols-outlined text-lg">
                  {spot.status === "occupied" ? "directions_car" : spot.status === "maintenance" ? "build" : "local_parking"}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 truncate">
                  Plaza {spot.code}
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

          <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {spot.condominio && (
              <InfoRow icon="apartment" label="Condominio" value={spot.condominio} />
            )}
            {spot.zona && (
              <InfoRow icon="meeting_room" label="Torre / Zona" value={spot.zona} />
            )}

            {spot.owner ? (
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Propietario
                  </p>
                  <button
                    onClick={handleRemoveOwner}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    title="Eliminar propietario"
                  >
                    <UserX size={14} />
                    Quitar
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {spot.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {spot.owner}
                    </p>
                    {spot.unit && (
                      <p className="text-xs text-slate-500">Unidad {spot.unit}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Propietario
                </p>
                <p className="text-sm text-slate-400">Sin propietario asignado</p>
              </div>
            )}

            {spot.status === "occupied" && spot.plate && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Ocupante Actual
                </p>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-600">directions_car</span>
                  <div>
                    <p className="font-bold text-slate-900">{spot.plate}</p>
                    <p className="text-xs text-slate-400">{spot.desc || "Vehículo registrado"}</p>
                  </div>
                </div>
                {spot.ocupanteTipo && (
                  <span
                    className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      tipoOcupanteClass[spot.ocupanteTipo] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tipoOcupanteLabel[spot.ocupanteTipo] || spot.ocupanteTipo}
                  </span>
                )}
              </div>
            )}

            {spot.status === "occupied" && spot.occupantName && (
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Ocupante
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {spot.occupantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {spot.occupantName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {hasActiveLoan && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      Préstamo Activo
                    </p>
                    <p className="text-sm font-semibold text-indigo-900">
                      {spot.activeLoan.nombreUsuarioAutorizado}
                    </p>
                    <p className="text-xs text-indigo-600">
                      Placa: {spot.activeLoan.placaAutorizada}
                    </p>
                  </div>
                  <button
                    onClick={handleFinalizeLoan}
                    className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            )}

            {!canToggleMaintenance && spot.status !== "maintenance" && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                <span className="material-symbols-outlined text-amber-500 shrink-0" style={{ fontSize: 18 }}>info</span>
                Solo se puede marcar para mantenimiento si el espacio está disponible.
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-2">
            {!spot.owner && (
              <button
                onClick={() => setShowOwnerModal(true)}
                className="w-full bg-brand text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
              >
                <UserPlus size={17} />
                Asignar Propietario
              </button>
            )}

            {spot.owner && !hasActiveLoan && canLoan && (
              <button
                onClick={() => setShowLoanModal(true)}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Handshake size={17} />
                Prestar Plaza
              </button>
            )}

            {spot.owner && spot.status === "available" && (
              <button
                onClick={() => setShowOwnerModal(true)}
                className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <UserPlus size={17} />
                Cambiar Propietario
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

      {showOwnerModal && (
        <OwnerModal
          spot={spot}
          onConfirm={handleOwnerConfirm}
          onCancel={() => setShowOwnerModal(false)}
        />
      )}

      {showLoanModal && (
        <LoanModal
          spot={spot}
          onConfirm={handleLoanConfirm}
          onCancel={() => setShowLoanModal(false)}
        />
      )}

      {showMaintenance && (
        <MaintenanceModal
          isEntering={!isMaintenance}
          onConfirm={handleMaintenance}
          onCancel={() => setShowMaintenance(false)}
        />
      )}
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
