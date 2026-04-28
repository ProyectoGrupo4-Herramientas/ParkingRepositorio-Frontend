import { useState, useMemo, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import Filters from "../components/Filters";
import AccessTable from "../components/AccessTable";
import Pagination from "../components/Pagination";
import { mockData } from "../data/mockData";

export default function HistoryPage() {
  // 🔹 LocalStorage + normalización de datos
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("parkControlData");

    if (savedData) {
      let parsed = JSON.parse(savedData);

      parsed = parsed.map((item) => {
        let tipo = item.tipoOcupante || item.tipo || "Invitado";

        // 🔹 Normalización segura
        const normalizados = {
          Visitante: "Invitado",
          Invitado: "Invitado",
          Residente: "Residente",
          Entrega: "Entrega",
          Servicio: "Servicio",
        };

        tipo = normalizados[tipo] || "Invitado";

        return {
          ...item,
          tipoOcupante: tipo,
        };
      });

      // 🔹 Fallback si hay pocos datos
      if (parsed.length < 15) {
        return mockData;
      }

      return parsed;
    }

    return mockData;
  });

  // 🔹 Guardar en LocalStorage
  useEffect(() => {
    localStorage.setItem("parkControlData", JSON.stringify(data));
  }, [data]);

  // 🔹 Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [unitFilter, setUnitFilter] = useState("Todas las Unidades");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 Filtros completos
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.placa
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchUnit =
        unitFilter === "Todas las Unidades" ||
        item.unidad === unitFilter;

      let matchType = true;

      if (typeFilter === "Entradas") {
        matchType = item.horaSalida === "Aún dentro";
      } else if (typeFilter === "Salidas") {
        matchType = item.horaSalida !== "Aún dentro";
      }

      let matchDate = true;

      if (startDate || endDate) {
        const itemDate = new Date(item.fecha);

        if (!isNaN(itemDate)) {
          if (startDate) {
            const sDate = new Date(startDate + "T00:00:00");
            if (itemDate < sDate) matchDate = false;
          }

          if (endDate) {
            const eDate = new Date(endDate + "T23:59:59");
            if (itemDate > eDate) matchDate = false;
          }
        }
      }

      return matchSearch && matchUnit && matchType && matchDate;
    });
  }, [data, searchTerm, unitFilter, typeFilter, startDate, endDate]);

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <Header dataToExport={filteredData} />

        {/* FILTROS */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          unitFilter={unitFilter}
          setUnitFilter={setUnitFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* TABLA */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <AccessTable data={currentData} />

          {/* PAGINACIÓN */}
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