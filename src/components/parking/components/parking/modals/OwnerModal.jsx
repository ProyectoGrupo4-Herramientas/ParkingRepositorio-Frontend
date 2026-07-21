import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useParking } from "../../../context/ParkingContext";

const COLORS = [
  "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700", "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
];

export default function OwnerModal({ spot, onClose }) {
  const { assignOwner, vehicles } = useParking();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [placa, setPlaca] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [focused, setFocused] = useState(false);

  const residentes = useMemo(
    () =>
      vehicles
        .filter((v) => v.tipoOcupante === "residente" && v.estado === "activo")
        .map((v, i) => ({
          id: v.id,
          nombres: v.usuarioNombre || v.propietario || "—",
          placa: v.placa,
          desc: v.vehiculoDesc,
          initials: (v.usuarioNombre || v.propietario || "")
            .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
          color: COLORS[i % COLORS.length],
        })),
    [vehicles],
  );

  const filtered = useMemo(
    () =>
      residentes.filter(
        (r) =>
          !query ||
          r.nombres.toLowerCase().includes(query.toLowerCase()) ||
          r.placa.toLowerCase().includes(query.toLowerCase()),
      ),
    [residentes, query],
  );

  const handleSelect = (r) => {
    setSelected(r);
    setPlaca(r.placa);
    setQuery(r.nombres);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected && !placa) return;
    setSubmitting(true);
    await assignOwner({
      idEstacionamiento: spot.id,
      idUsuario: selected?.id || 0,
      nombreUsuario: selected?.nombres || "",
      placaVehiculo: (placa || selected?.placa || "").toUpperCase(),
    });
    setSubmitting(false);
    onClose();
  };

  const showList = focused && !selected;

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
          <div className="relative">
            <label className="block text-xs font-bold text-slate-500 mb-1">Buscar Residente</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Nombre o placa..."
                className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            {showList && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Sin resultados</p>
                ) : (
                  filtered.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${r.color}`}>
                        {r.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{r.nombres}</p>
                        <p className="text-xs text-slate-400">{r.placa}{r.desc ? ` · ${r.desc}` : ""}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selected && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Vehículo</p>
              <p className="text-sm font-semibold text-slate-800">{selected.placa}</p>
              {selected.desc && <p className="text-xs text-slate-500">{selected.desc}</p>}
            </div>
          )}

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
              disabled={submitting || (!selected && !placa)}
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
