export default function ParkingSpot({ spot, onClick, isSelected }) {
  const config = {
    available: {
      wrap: "border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md",
      bay: "bg-emerald-50",
      icon: "local_parking",
      iconColor: "text-emerald-500",
      label: "Libre",
      labelClass: "text-emerald-700 bg-emerald-100",
    },
    occupied: {
      wrap: "border-slate-300 bg-white hover:shadow-md",
      bay: "bg-slate-900",
      icon: "directions_car",
      iconColor: "text-white",
      label: spot.plate || "Ocupado",
      labelClass: "text-red-700 bg-red-100",
    },
    maintenance: {
      wrap: "border-amber-200 bg-white hover:border-amber-400 hover:shadow-md",
      bay: "bg-amber-50",
      icon: "build",
      iconColor: "text-amber-500",
      label: "Mantención",
      labelClass: "text-amber-700 bg-amber-100",
    },
    reserved: {
      wrap: "border-blue-200 bg-white hover:shadow-md",
      bay: "bg-blue-50",
      icon: "event_available",
      iconColor: "text-blue-500",
      label: "Reservado",
      labelClass: "text-blue-700 bg-blue-100",
    },
  };

  const c = config[spot.status] || config.available;
  const esMoto = spot.tipoVehiculo === "MOTO";
  const infoParts = [spot.code];
  if (esMoto) infoParts.push(`Motos: ${spot.ocupacionActual ?? 0}/${spot.capacidad ?? 1}`);
  if (spot.propietarioNombre) infoParts.push(`Dueño: ${spot.propietarioNombre}`);
  if (spot.plate) infoParts.push(`Placa: ${spot.plate}`);
  if (spot.tipoUso === "PRESTAMO" && spot.prestamoExpirado) infoParts.push("(Préstamo vencido)");
  else if (spot.tipoUso === "PRESTAMO") infoParts.push("(Préstamo)");
  return (
    <button
      onClick={onClick}
      title={infoParts.join(" · ")}
      className={`
        group relative border-2 rounded-xl overflow-hidden text-left transition-all w-full cursor-pointer
        ${c.wrap}
        ${isSelected ? "ring-2 ring-slate-900 ring-offset-1" : ""}
      `}
    >
      {/* Código de la plaza + tipo de vehículo (spec V6) */}
      <div className="flex items-center justify-between px-2 pt-1.5">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-600 truncate">
          {spot.code}
        </span>
        <span
          className={`material-symbols-outlined shrink-0 ${esMoto ? "text-indigo-400" : "text-slate-300"}`}
          style={{ fontSize: 14 }}
          title={esMoto ? "Plaza de motos" : "Plaza de auto"}
        >
          {esMoto ? "two_wheeler" : "local_parking"}
        </span>
      </div>

      {/* Cupo de motos (1 auto = varias motos, spec V6) */}
      {esMoto && (
        <div className="px-2 pt-0.5">
          <span className="inline-block text-[8px] sm:text-[9px] font-bold text-indigo-700 bg-indigo-100 rounded px-1 py-0.5 tracking-wide">
            MOTO {spot.ocupacionActual ?? 0}/{spot.capacidad ?? 1}
          </span>
        </div>
      )}

      {/* Bahía: auto / icono de estado */}
      <div className={`mx-2 mt-1 rounded-lg ${c.bay} flex items-center justify-center h-11 sm:h-14`}>
        <span className={`material-symbols-outlined ${c.iconColor}`} style={{ fontSize: 26 }}>
          {c.icon}
        </span>
      </div>

      {/* Etiqueta de estado / placa */}
      <div className="px-2 py-1.5">
        <div
          className={`text-[9px] sm:text-[10px] font-bold text-center py-0.5 rounded ${c.labelClass} truncate tracking-wide`}
        >
          {c.label}
        </div>
      </div>
    </button>
  );
}
