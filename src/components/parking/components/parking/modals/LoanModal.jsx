import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useParking } from "../../../context/ParkingContext";

const COLORS = [
  "bg-rose-100 text-rose-700", "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700", "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700", "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
];

export default function LoanModal({ spot, onClose }) {
  const { createLoan, propietariosPlaza, vehicles } = useParking();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [placa, setPlaca] = useState("");
  const [focused, setFocused] = useState(false);
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

  const usuarios = useMemo(
    () =>
      Array.from(
        new Map(
          vehicles.map((v, i) => [
            v.usuarioNombre,
            {
              id: v.id,
              nombres: v.usuarioNombre || v.propietario || "—",
              placa: v.placa,
              initials: (v.usuarioNombre || v.propietario || "")
                .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
              color: COLORS[i % COLORS.length],
            },
          ]),
        ).values(),
      ).filter((u) => u.nombres !== "—"),
    [vehicles],
  );

  const filtered = useMemo(
    () =>
      usuarios.filter(
        (u) =>
          !query ||
          u.nombres.toLowerCase().includes(query.toLowerCase()) ||
          u.placa.toLowerCase().includes(query.toLowerCase()),
      ),
    [usuarios, query],
  );

  const handleSelect = (u) => {
    setSelected(u);
    setPlaca(u.placa);
    setQuery(u.nombres);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected && !placa) return;
    setSubmitting(true);
    const placaFinal = (placa || selected?.placa || "").toUpperCase();
    let nombre = selected?.nombres || "";
    if (!nombre && placaFinal) {
      const v = vehicles.find((ve) => ve.placa === placaFinal);
      if (v) nombre = v.usuarioNombre || v.propietario || "";
    }
    await createLoan({
      idPropietario: propietario?.id || 0,
      idUsuarioAutorizado: selected?.id || 0,
      nombreUsuarioAutorizado: nombre,
      idEstacionamiento: spot.id,
      placaAutorizada: placaFinal,
      fechaInicio: new Date(fechaInicio).toISOString(),
      fechaFin: new Date(fechaFin).toISOString(),
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
            <h2 className="text-lg font-bold text-slate-900">Prestar Plaza {spot.code}</h2>
            <p className="text-sm text-slate-400 mt-0.5">Autorizar a otro residente a usar esta plaza</p>
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
                  filtered.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelect(u)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-left"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${u.color}`}>
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{u.nombres}</p>
                        <p className="text-xs text-slate-400">{u.placa}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
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
              disabled={submitting || (!selected && !placa)}
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
