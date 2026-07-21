import { useMemo, useState, useEffect } from "react";
import { format } from "date-fns";
import { useParking } from "../context/ParkingContext";
import { Link } from "react-router-dom";
import { parkingService } from "../../../services/parkingService";
import {
  Car,
  ParkingSquare,
  Wrench,
  DoorOpen,
  Shield,
  Map,
  Users,
  History,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";

function MetricCard({ icon: Icon, label, value, bgColor, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5 flex items-center gap-4 h-[110px]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{value}</p>
        <p className="text-sm text-slate-500 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function CircularProgress({ percent }) {
  const radius = 56;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={percent >= 80 ? "#ef4444" : percent >= 50 ? "#eab308" : "#22c55e"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 leading-none">{percent}%</span>
        <span className="text-[11px] text-slate-400 font-medium mt-0.5">Ocupado</span>
      </div>
    </div>
  );
}

function AccessChart({ accessLog, today }) {
  const hours = useMemo(() => {
    const counts = new Array(24).fill(0);
    for (const log of accessLog) {
      if (log.fecha === today && log.horaEntrada) {
        const h = parseInt(log.horaEntrada.split(":")[0], 10);
        if (!isNaN(h) && h >= 0 && h < 24) counts[h]++;
      }
    }
    return counts;
  }, [accessLog, today]);

  const maxVal = Math.max(...hours, 1);
  const now = new Date().getHours();

  return (
    <div className="w-full mt-4">
      <div className="flex items-end gap-[2px] h-24">
        {hours.map((count, i) => {
          const isCurrent = i === now && count > 0;
          return (
            <div
              key={i}
              title={`${i.toString().padStart(2, "0")}:00 — ${count} acceso(s)`}
              className={`flex-1 rounded-t transition-all duration-300 ${
                count > 0 ? (isCurrent ? "bg-brand" : "bg-brand/50") : "bg-slate-100"
              }`}
              style={{ height: `${(count / maxVal) * 100}%`, minHeight: count > 0 ? "4px" : "1px" }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
        <span>00</span>
        <span>06</span>
        <span>12</span>
        <span>18</span>
        <span>23</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { parkingSpaces, accessLog, prestamosPlaza, spacesAvailable, spacesOccupied } = useParking();

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [pasesActivos, setPasesActivos] = useState([]);

  useEffect(() => {
    parkingService.getPasesInvitados().then((all) => {
      const now = new Date();
      const activos = all.filter(
        (p) =>
          p.estado === "ACTIVO" &&
          new Date(p.fechaFin) >= now &&
          new Date(p.fechaInicio) <= now,
      );
      setPasesActivos(activos);
    }).catch(() => {});
  }, []);

  const vehiclesInside = useMemo(
    () => accessLog.filter((l) => !l.horaSalida).length,
    [accessLog],
  );

  const maintenanceCount = useMemo(
    () => parkingSpaces.filter((s) => s.enMantenimiento).length,
    [parkingSpaces],
  );

  const todayAccesses = useMemo(
    () => accessLog.filter((l) => l.fecha === todayStr).length,
    [accessLog, todayStr],
  );

  const yesterdayAccesses = useMemo(
    () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterdayStr = format(d, "yyyy-MM-dd");
      return accessLog.filter((l) => l.fecha === yesterdayStr).length;
    },
    [accessLog],
  );

  const variation =
    yesterdayAccesses > 0
      ? Math.round(((todayAccesses - yesterdayAccesses) / yesterdayAccesses) * 100)
      : todayAccesses > 0
        ? 100
        : 0;

  const total = parkingSpaces.length;
  const percent = total ? Math.round((spacesOccupied / total) * 100) : 0;

  const quickLinks = [
    {
      icon: Shield,
      label: "Control de Acceso",
      desc: "Gestión de barreras y permisos de entrada.",
      to: "/access",
    },
    {
      icon: Map,
      label: "Mapa de Estacionamiento",
      desc: "Visualización interactiva de niveles y plazas.",
      to: "/parking",
    },
    {
      icon: PlusCircle,
      label: "Registrar Vehículo",
      desc: "Asociar un nuevo vehículo a propietario o unidad.",
      to: null,
      isAction: "register-vehicle",
    },
    {
      icon: Clock,
      label: "Crear Pase Temporal",
      desc: "Autorizar ingreso de vehículo por tiempo limitado.",
      to: null,
      isAction: "guest-pass",
    },
    {
      icon: Users,
      label: "Directorio de Residentes",
      desc: "Base de datos de usuarios y vehículos asignados.",
      to: "/residents",
    },
    {
      icon: History,
      label: "Historial de Acceso",
      desc: "Logs completos de movimientos y alertas.",
      to: "/history",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">

      {/* ──────── SECCIÓN 1: Título ──────── */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Resumen del estado actual del estacionamiento.
        </p>
      </div>

      {/* ──────── SECCIÓN 2: Métricas ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Car} label="Vehículos dentro" value={vehiclesInside} bgColor="bg-blue-50" iconColor="text-blue-600" />
        <MetricCard icon={ParkingSquare} label="Espacios libres" value={spacesAvailable} bgColor="bg-emerald-50" iconColor="text-emerald-600" />
        <MetricCard icon={DoorOpen} label="Espacios ocupados" value={spacesOccupied} bgColor="bg-red-50" iconColor="text-red-500" />
        <MetricCard icon={Wrench} label="En mantenimiento" value={maintenanceCount} bgColor="bg-amber-50" iconColor="text-amber-500" />
      </div>

      {/* ──────── SECCIÓN 3: Dos columnas ──────── */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">

        {/* Columna izquierda — Accesos del día */}
        <div className="flex-1 lg:w-[70%] bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Accesos del Día</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tráfico de entrada detectado hoy.</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={14} />
              {variation >= 0 ? "+" : ""}{variation}%
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900 mt-3 mb-1">{todayAccesses}</p>
          <p className="text-xs text-slate-400">
            vs {yesterdayAccesses} ayer
          </p>
          <AccessChart accessLog={accessLog} today={todayStr} />
          {/* Últimos accesos */}
          {todayAccesses > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Últimos accesos</p>
              <div className="space-y-1.5">
                {accessLog
                  .filter((l) => l.fecha === todayStr)
                  .slice(0, 5)
                  .map((l) => (
                    <div key={l.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{l.placa}</span>
                        <span className="text-slate-400">{l.horaEntrada}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        l.estadoEntrada === "entrada_aprobada"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {l.estadoEntrada === "entrada_aprobada" ? "Dentro" : "Fuera"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha — Ocupación */}
        <div className="w-full lg:w-[30%] bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-6 flex flex-col">
          <div className="mb-1">
            <h2 className="text-base font-semibold text-slate-900">Ocupación</h2>
            <p className="text-xs text-slate-400 mt-0.5">Capacidad total en tiempo real.</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4">
            <CircularProgress percent={percent} />

            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Espacios libres</span>
                <span className="font-semibold text-slate-900">{spacesAvailable}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${total ? (spacesAvailable / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4 pt-3 border-t border-slate-50">
            Última actualización · {new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      {/* ──────── SECCIÓN 3.5: Pases Activos ──────── */}
      {pasesActivos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Pases Temporales Activos</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] divide-y divide-slate-100">
            {pasesActivos.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{p.placa}</p>
                  <p className="text-xs text-slate-400">
                    Hasta el {new Date(p.fechaFin).toLocaleDateString("es-PE")}
                    {p.codigo ? ` · ${p.codigo}` : ""}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────── SECCIÓN 3.75: Préstamos Activos ──────── */}
      {prestamosPlaza.filter((p) => p.estado === "ACTIVO").length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Préstamos de Plaza Activos</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] divide-y divide-slate-100">
            {prestamosPlaza.filter((p) => p.estado === "ACTIVO").map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Plaza {parkingSpaces.find((s) => s.id === p.idEstacionamiento)?.code || p.idEstacionamiento}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.nombreUsuarioAutorizado || p.placaAutorizada} · Hasta {new Date(p.fechaFin).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────── SECCIÓN 4: Acceso Directo ──────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">Acceso Directo</h2>
        <Link to="/history" className="text-xs font-medium text-brand hover:text-brand-dark transition-colors flex items-center gap-1">
          Ver todos <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickLinks.map((item) =>
          item.isAction ? (
            <button
              key={item.label}
              onClick={() => {
                window.dispatchEvent(new CustomEvent(`open:${item.isAction}`));
              }}
              className="group bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5 text-left hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand/10 transition-colors">
                <item.icon size={20} className="text-slate-500 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
              <span className="text-xs font-medium text-slate-400 group-hover:text-brand transition-colors">
                Ir al módulo →
              </span>
            </button>
          ) : (
            <Link
              key={item.label}
              to={item.to}
              className="group bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5 block hover:shadow-md hover:border-slate-200 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-brand/10 transition-colors">
                <item.icon size={20} className="text-slate-500 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
              <span className="text-xs font-medium text-slate-400 group-hover:text-brand transition-colors">
                Ir al módulo →
              </span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
