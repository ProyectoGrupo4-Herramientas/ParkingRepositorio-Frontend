import { useState } from "react";

const UNITS = [
  {
    id: 1,
    code: "101",
    resident: "Ana García",
    initials: "AG",
    color: "bg-rose-200 text-rose-700",
  },
  {
    id: 2,
    code: "202",
    resident: "Luis Pérez",
    initials: "LP",
    color: "bg-amber-200 text-amber-700",
  },
  {
    id: 3,
    code: "305",
    resident: "Juan Díaz",
    initials: "JD",
    color: "bg-indigo-200 text-indigo-700",
  },
  {
    id: 4,
    code: "410",
    resident: "María Torres",
    initials: "MT",
    color: "bg-teal-200 text-teal-700",
  },
  {
    id: 5,
    code: "512",
    resident: "Carlos Ramos",
    initials: "CR",
    color: "bg-purple-200 text-purple-700",
  },
];

function ReassignModal({ onConfirm, onCancel }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [plate, setPlate] = useState("");

  const filtered = UNITS.filter(
    (u) =>
      u.code.includes(query) ||
      u.resident.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            Reasignar a Unidad
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2">
          <span
            className="material-symbols-outlined text-slate-400"
            style={{ fontSize: 18 }}
          >
            search
          </span>
          <input
            autoFocus
            type="text"
            placeholder="Buscar unidad o residente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none text-slate-700 placeholder-slate-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                close
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Sin resultados
            </p>
          ) : (
            filtered.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelected(u)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                ${
                  selected?.id === u.id
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${u.color}`}
                >
                  {u.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Unidad {u.code}
                  </p>
                  <p className="text-xs text-slate-400">{u.resident}</p>
                </div>
                {selected?.id === u.id && (
                  <span
                    className="material-symbols-outlined text-slate-900 ml-auto"
                    style={{ fontSize: 18 }}
                  >
                    check_circle
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* PLACA */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Placa del Vehículo
          </p>
          <input
            type="text"
            placeholder="Ej: ABC-1234"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-400"
          />
        </div>

        <button
          onClick={() => selected && plate && onConfirm(selected, plate)}
          disabled={!selected || !plate}
          className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold
            disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          Confirmar Reasignación
        </button>
      </div>
    </div>
  );
}

function MaintenanceModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            Salir de Mantenimiento
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </div>

        <p className="text-sm text-slate-500">
          ¿Confirmas que el espacio está listo? Se marcará como{" "}
          <span className="font-semibold text-green-600">Disponible</span>.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm("available")}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParkingDetails({
  spot,
  onClose,
  onReassign,
  onToggleMaintenance,
}) {
  const [showReassign, setShowReassign] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);

  if (!spot) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 text-sm min-h-[200px]">
        <span
          className="material-symbols-outlined text-slate-300 mb-2"
          style={{ fontSize: 40 }}
        >
          local_parking
        </span>
        Selecciona un espacio para ver detalles
      </div>
    );
  }

  const statusLabel = {
    occupied: { label: "OCUPADO", classes: "bg-red-100 text-red-600" },
    available: { label: "DISPONIBLE", classes: "bg-green-100 text-green-600" },
    reserved: { label: "RESERVADO", classes: "bg-blue-100 text-blue-600" },
    maintenance: {
      label: "MANTENIMIENTO",
      classes: "bg-slate-100 text-slate-500",
    },
  };

  const { label, classes } = statusLabel[spot.status] || {};
  const isMaintenance = spot.status === "maintenance";

  function handleConfirmReassign(unit, plate) {
    setShowReassign(false);
    onReassign?.(spot.id, unit, plate);
  }

  function handleConfirmMaintenance(newStatus) {
    setShowMaintenance(false);
    onToggleMaintenance?.(spot.id, newStatus);
  }

  return (
    <>
      {showReassign && (
        <ReassignModal
          onConfirm={handleConfirmReassign}
          onCancel={() => setShowReassign(false)}
        />
      )}
      {showMaintenance && (
        <MaintenanceModal
          onConfirm={handleConfirmMaintenance}
          onCancel={() => setShowMaintenance(false)}
        />
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Espacio {spot.code}
              </h2>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${classes}`}
              >
                {label}
              </span>
            </div>
            <p className="text-sm text-slate-400">Nivel 1, Ala Norte</p>
          </div>
          <div className="flex items-center gap-1">
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 lg:hidden"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  close
                </span>
              </button>
            )}
            <button className="text-slate-400 hover:text-slate-700">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                more_vert
              </span>
            </button>
          </div>
        </div>

        {spot.status === "occupied" && spot.plate && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Vehículo Actual
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-slate-600"
                  style={{ fontSize: 22 }}
                >
                  directions_car
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-base tracking-wide">
                  {spot.plate}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Toyota Camry Plateado
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SOLO muestra residente si fue asignado via reasignación */}
        {spot.unit && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Residente Asignado
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 ${spot.unit.color}`}
              >
                {spot.unit.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {spot.unit.resident}
                </p>
                <p className="text-xs text-slate-400">
                  Unidad {spot.unit.code} • Inquilino Principal
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-auto pt-1">
          {!isMaintenance && (
            <button
              onClick={() => setShowReassign(true)}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold
                flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 17 }}
              >
                swap_horiz
              </span>
              Reasignar a Unidad
            </button>
          )}

          <button
            onClick={() =>
              isMaintenance
                ? setShowMaintenance(true)
                : onToggleMaintenance?.(spot.id, "maintenance")
            }
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors
              ${
                isMaintenance
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 17 }}
            >
              {isMaintenance ? "check_circle" : "build"}
            </span>
            {isMaintenance
              ? "Marcar como Disponible"
              : "Marcar para Mantenimiento"}
          </button>
        </div>
      </div>
    </>
  );
}
