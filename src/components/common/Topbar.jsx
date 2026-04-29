import { useState, useRef, useEffect } from "react";
import { useParking } from "../../context/ParkingContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const typeStyles = {
  alert: { icon: "warning", bg: "bg-red-100", text: "text-red-600" },
  warning: { icon: "schedule", bg: "bg-amber-100", text: "text-amber-600" },
  success: { icon: "check_circle", bg: "bg-green-100", text: "text-green-600" },
  info: { icon: "info", bg: "bg-blue-100", text: "text-blue-600" },
};

export default function Topbar({ onMenuOpen }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useParking();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] h-16 z-40 border-b border-slate-200 bg-white flex items-center px-4 md:px-6 gap-3">
      <button
        onClick={onMenuOpen}
        className="md:hidden text-slate-500 hover:text-slate-900 flex-shrink-0"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          menu
        </span>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative text-slate-500 hover:text-slate-900"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 22 }}
            >
              notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Panel */}
          {open && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-visible z-50">
              {/* Triángulo */}
              <div className="absolute -top-[9px] right-2.5 w-4 h-[10px] overflow-hidden pointer-events-none">
                <div className="w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45 translate-y-[5px] mx-auto shadow-sm" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 rounded-t-2xl overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">
                    Notificaciones
                  </span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-slate-500 hover:text-slate-900 font-medium"
                    >
                      Marcar todas
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-400 hover:text-red-600 font-medium"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Lista */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 rounded-b-2xl">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <span
                      className="material-symbols-outlined text-slate-300 mb-2"
                      style={{ fontSize: 36 }}
                    >
                      notifications_off
                    </span>
                    <p className="text-sm">Sin notificaciones</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const style = typeStyles[n.type] || typeStyles.info;
                    return (
                      <button
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors ${!n.read ? "bg-slate-50/80" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}
                        >
                          <span
                            className={`material-symbols-outlined ${style.text}`}
                            style={{ fontSize: 16 }}
                          >
                            {style.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs leading-snug text-slate-800 ${!n.read ? "font-bold" : "font-semibold"}`}
                          >
                            {n.message}
                          </p>
                          {n.detail && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">
                              {n.detail}
                            </p>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1">
                            {formatDistanceToNow(parseISO(n.timestamp), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
