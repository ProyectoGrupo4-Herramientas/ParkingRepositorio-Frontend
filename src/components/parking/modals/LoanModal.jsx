import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { parkingService } from "../../../services/parkingService";

export default function LoanModal({ spot, onConfirm, onCancel }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [plate, setPlate] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    parkingService
      .getInquilinos()
      .then(setUsers)
      .catch(() => {});
  }, []);

  const selectedUser = users.find((u) => String(u.id) === selectedUserId);
  const canSave = selectedUserId && selectedUser && plate.trim().length >= 5;

  const handleConfirm = () => {
    if (!canSave) return;
    onConfirm({
      idEstacionamiento: spot.id,
      idPropietario: spot.ownerId,
      nombrePropietario: spot.owner,
      idUsuarioAutorizado: selectedUser.id,
      nombreUsuarioAutorizado: selectedUser.nombres,
      placaAutorizada: plate.toUpperCase(),
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        visible ? "bg-black/40" : "bg-transparent pointer-events-none"
      }`}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Prestar Plaza
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {spot.code} · Propietario: {spot.owner}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Autorizar a
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none"
            >
              <option value="">Seleccionar residente...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombres} {u.unidad ? `- ${u.unidad}` : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                Autorizado
              </p>
              <p className="text-sm font-semibold text-indigo-900">
                {selectedUser.nombres}
              </p>
              {selectedUser.unidad && (
                <p className="text-xs text-indigo-600">
                  Unidad {selectedUser.unidad}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Placa del vehículo autorizado
            </label>
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:outline-none uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canSave}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Crear Préstamo
          </button>
        </div>
      </div>
    </div>
  );
}
