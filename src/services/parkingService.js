// Servicio de datos del frontend de ParkControl.
// Consume EL GATEWAY (que a su vez consume la API Central de CondoSaaS sobre la BD
// compartida) y normaliza la respuesta a la forma que espera ParkingContext.
// Flujo: este front -> gateway -> API Central -> BD.

const BASE = import.meta.env.VITE_GATEWAY_URL || "https://parkingrepositorio-backend.onrender.com";

async function req(path, opts = {}) {
    const res = await fetch(BASE + path, {
        headers: { "Content-Type": "application/json" },
        ...opts,
    });
    let json = {};
    try {
        json = await res.json();
    } catch {
        json = {};
    }
    if (!res.ok) {
        throw new Error(json?.message || `Error ${res.status}`);
    }
    // El gateway envuelve en { success, data }. Desenvolvemos.
    return json && Object.prototype.hasOwnProperty.call(json, "data") ? json.data : json;
}

// ── Normalizadores: shape del gateway → shape que usa ParkingContext ──
const normVehiculo = (v) => ({
    id: v.idVehiculo,
    placa: v.matricula,
    marca: v.marca,
    modelo: v.modelo,
    color: v.color,
    estado: v.estado,
    usuarioNombre: v.propietarioNombre,
    tipoOcupante: v.tipoOcupante,
    unidad: v.unidad,
    pisoNumero: v.pisoNumero,
    torreNombre: v.torreNombre,
    condominioNombre: v.condominioNombre,
    apartamentoId: v.idApartamento,
});

const normEstacionamiento = (e) => ({
    id: e.idEstacionamiento,
    codigo: e.codigoPlaza,
    estadoOcupacion: e.estadoOcupacion,
    zonaNombre: e.zonaNombre,
    zonaEstacionamientoId: e.zonaEstacionamientoId ?? null,
    condominioId: e.idCondominio,
    condominioNombre: e.condominioNombre,
    vehiculoActualId: e.idVehiculoActual,
    placaActual: e.placaActual,
    propietarioId: e.propietarioId ?? null,
    propietarioNombre: e.propietarioNombre ?? null,
    ocupanteNombre: e.ocupanteNombre ?? null,
    tipoUso: e.tipoUso ?? null,
    prestamoId: e.prestamoId ?? null,
    prestamoExpirado: e.prestamoExpirado ?? false,
});

const normPermanencia = (p) => ({
    id: p.idPermanencia,
    vehiculoId: p.idVehiculo,
    placa: p.placa,
    fechaEntrada: p.horaEntrada,
    fechaSalida: p.horaSalida,
    estado: p.estado,
});

const arr = (x) => (Array.isArray(x) ? x : []);

export const parkingService = {
    getVehiculos: async () => arr(await req("/api/vehiculos")).map(normVehiculo),
    getEstacionamientos: async () => arr(await req("/api/estacionamientos")).map(normEstacionamiento),
    getPermanencias: async () => arr(await req("/api/permanencias-activas")).map(normPermanencia),

    registrarEntrada: (data) =>
        req("/api/permanencias-activas/registrar-entrada", { method: "POST", body: JSON.stringify(data) }),
    registrarSalida: (data) =>
        req("/api/permanencias-activas/registrar-salida", { method: "POST", body: JSON.stringify(data) }),

    getCondominios: async () =>
        arr(await req("/api/condominios")).map((c) => ({ id: c.idCondominio, nombre: c.nombre })),
    getInquilinos: async (condominioId) =>
        arr(await req("/api/usuarios"))
            .filter((u) => condominioId == null || String(u.idCondominio) === String(condominioId))
            .map((u) => ({
                id: u.idUsuario,
                nombres: u.nombreCompleto,
                apellidos: "",
                unidad: u.unidad || null,
                apartamentoId: u.idApartamento || null,
            })),

    createVehiculo: (data) =>
        req("/api/vehiculos", {
            method: "POST",
            body: JSON.stringify({
                matricula: data.placa,
                idUsuarioPropietario: data.usuarioId,
                marcaModelo: [data.marca, data.modelo].filter(Boolean).join(" ") || "",
                estado: data.estado || "ACTIVO",
                tipoRegistro: data.tipoRegistro || "Propietario",
                idApartamento: data.idApartamento || null,
            }),
        }),
    updateVehiculo: (id, data) =>
        req(`/api/vehiculos/${id}`, {
            method: "PUT",
            body: JSON.stringify({ matricula: data.placa, idUsuarioPropietario: data.usuarioId }),
        }),
    deleteVehiculo: (id) => req(`/api/vehiculos/${id}`, { method: "DELETE" }),
    updateEstacionamiento: (id, data) =>
        req(`/api/estacionamientos/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    getPasesInvitados: async () =>
        arr(await req("/api/pases-invitados")).map((p) => ({
            id: p.idPase,
            codigo: p.codigoPase,
            placa: p.matricula,
            apartamentoId: p.idApartamento,
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin,
            estado: p.estado,
            nombreInvitado: p.nombreInvitado || "",
        })),

    createPaseInvitado: (data) =>
        req("/api/pases-invitados", {
            method: "POST",
            body: JSON.stringify({
                matricula: data.placa,
                idApartamento: data.apartamentoId,
                idUsuarioEmisor: data.usuarioId,
                fechaInicio: data.fechaInicio,
                fechaFin: data.fechaFin,
                estado: "ACTIVO",
                nombreInvitado: data.nombreInvitado || "",
            }),
        }),

    // ── PROPIETARIOS DE PLAZA ──
    getPropietariosPlaza: async () =>
        arr(await req("/api/propietarios-plaza")).map((p) => ({
            id: p.idPropietario,
            idEstacionamiento: p.idEstacionamiento,
            idUsuario: p.idUsuario,
            nombreUsuario: p.nombreUsuario,
            placaVehiculo: p.placaVehiculo,
            fechaAsignacion: p.fechaAsignacion,
            estado: p.estado,
        })),

    createPropietarioPlaza: (data) =>
        req("/api/propietarios-plaza", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    deletePropietarioPlaza: (id) =>
        req(`/api/propietarios-plaza/${id}`, { method: "DELETE" }),

    // ── PRESTAMOS DE PLAZA ──
    getPrestamosPlaza: async () =>
        arr(await req("/api/prestamos-plaza")).map((p) => ({
            id: p.idPrestamo,
            idPropietario: p.idPropietario,
            idUsuarioAutorizado: p.idUsuarioAutorizado,
            nombreUsuarioAutorizado: p.nombreUsuarioAutorizado,
            idEstacionamiento: p.idEstacionamiento,
            placaAutorizada: p.placaAutorizada,
            fechaInicio: p.fechaInicio,
            fechaFin: p.fechaFin,
            estado: p.estado,
        })),

    createPrestamoPlaza: (data) =>
        req("/api/prestamos-plaza", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updatePrestamoPlaza: (id, data) =>
        req(`/api/prestamos-plaza/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    finalizarPrestamoPlaza: (id) =>
        req(`/api/prestamos-plaza/${id}/finalizar`, { method: "POST" }),

    // No usados por las páginas principales (el dashboard calcula del contexto).
    getParkingStats: async () => null,
    getVehiculoByPlaca: async () => null,
    getLogs: async () => [],
    getZonas: async () => [],
};

export default parkingService;
