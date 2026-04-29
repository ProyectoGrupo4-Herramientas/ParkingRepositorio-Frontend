import { useState, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import AccessTable from "../components/AccessTable";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import { useParking } from "../context/ParkingContext";

export default function HistoryPage() {
  const { accessLog } = useParking();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("Todas las Unidades");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Adaptar accessLog al formato que espera AccessTable
  const data = accessLog.map((log) => ({
    id: log.id,
    fecha: log.fecha,
    horaEntrada: log.horaEntrada,
    horaSalida: log.horaSalida || "Aún dentro",
    placa: log.placa,
    unidad: log.unidad || "--",
    tipo:
      log.tipoOcupante === "residente"
        ? "Residente"
        : log.tipoOcupante === "visitante"
          ? "Invitado"
          : "Desconocido",
    duracion: log.duracion || "--",
  }));

  const filteredData = useMemo(() => {
    const q = (searchQuery || searchTerm).toLowerCase();

    return data.filter((item) => {
      const matchSearch =
        item.placa.toLowerCase().includes(q) ||
        item.unidad.toLowerCase().includes(q);

      const matchUnit =
        unitFilter === "Todas las Unidades" || item.unidad === unitFilter;

      let matchType = true;
      if (typeFilter === "Entradas") {
        matchType = item.horaSalida === "Aún dentro";
      } else if (typeFilter === "Salidas") {
        matchType = item.horaSalida !== "Aún dentro";
      }

      return matchSearch && matchUnit && matchType;
    });
  }, [data, searchQuery, searchTerm, unitFilter, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="space-y-6">
        <Header dataToExport={filteredData} />

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          unitFilter={unitFilter}
          setUnitFilter={setUnitFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <AccessTable data={currentData} />

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Mostrando {currentData.length} de {filteredData.length} registros
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
