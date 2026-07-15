import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { useParking } from "../../../context/ParkingContext";

export default function OwnerModal({ spot, onClose }) {
  const { assignOwner, vehicles } = useParking();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [placa, setPlaca] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const residentes = useMemo(
    () =>
      vehicles
        .filter((v) => v.tipoOcupante === "residente" && v.estado === "activo")
        .map((v) => ({
          id: v.id,
          usuarioId: v.id,
          nombres: v.usuarioNombre || v.propietario || "—",
          placa: v.placa,
          desc: v.vehiculoDesc,
        })),
    [vehicles],
  );

  const uniqueResidentes = Array.from(
    new Map(residentes.map((r) => [r.nombres, r])).values(),
  ).filter((r) => r.nombres !== "—");

  const selected = uniqueResidentes.find((r) => String(r.id) === selectedUserId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId && !placa) return;
    setSubmitting(true);
    await assignOwner({
      idEstacionamiento: spot.id,
      idUsuario: selectedUserId ? Number(selectedUserId) : 0,
      nombreUsuario: selected?.nombres || "",
      placaVehiculo: (placa || selected?.placa || "").toUpperCase(),
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Asignar Propietario</h2>
            <p className="text-sm text-slate-400 mt-0.5">Plaza {spot.code}</p>
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
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                const r = uniqueResidentes.find((u) => String(u.id) === e.target.value);
                if (r) setPlaca(r.placa);
              }}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="">Seleccionar...</option>
              {uniqueResidentes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombres} ({r.placa})
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Vehículo</p>
              <p className="text-sm font-semibold text-slate-800">{selected.placa}</p>
              {selected.desc && <p className="text-xs text-slate-500">{selected.desc}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              O escribir placa directamente
            </label>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
            <span className="material-symbols-outlined text-blue-500 shrink-0" style={{ fontSize: 18 }}>info</span>
            Esta acción asigna al propietario permanente de la plaza. No afecta la ocupación actual.
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || (!selectedUserId && !placa)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-40"
            >
              {submitting ? "Asignando..." : "Asignar Propietario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
