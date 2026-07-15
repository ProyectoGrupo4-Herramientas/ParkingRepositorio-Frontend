import { useState } from "react";
import { X } from "lucide-react";
import { useParking } from "../../../context/ParkingContext";

export default function LoanModal({ spot, onClose }) {
  const { createLoan, propietariosPlaza, vehicles } = useParking();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [placa, setPlaca] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [fechaFin, setFechaFin] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  );
  const [submitting, setSubmitting] = useState(false);

  const propietario = propietariosPlaza.find(
    (p) => p.idEstacionamiento === spot.id,
  );

  const usuarios = Array.from(
    new Map(
      vehicles.map((v) => [
        v.usuarioNombre,
        { id: v.id, nombres: v.usuarioNombre || v.propietario || "—", placa: v.placa },
      ]),
    ).values(),
  ).filter((u) => u.nombres !== "—");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId && !placa) return;
    setSubmitting(true);
    const user = usuarios.find((u) => String(u.id) === selectedUserId);
    await createLoan({
      idPropietario: propietario?.id || 0,
      idUsuarioAutorizado: selectedUserId ? Number(selectedUserId) : 0,
      nombreUsuarioAutorizado: user?.nombres || "",
      idEstacionamiento: spot.id,
      placaAutorizada: placa.toUpperCase(),
      fechaInicio: new Date(fechaInicio).toISOString(),
      fechaFin: new Date(fechaFin).toISOString(),
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Prestar Plaza {spot.code}</h2>
            <p className="text-sm text-slate-400 mt-0.5">Autorizar a otro residente a usar esta plaza</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Seleccionar Residente</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="">Seleccionar...</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombres} ({u.placa})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">O escribir placa directamente</label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Desde</label>
              <input
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Hasta</label>
              <input
                type="datetime-local"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || (!selectedUserId && !placa)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-40"
            >
              {submitting ? "Creando..." : "Crear Préstamo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
