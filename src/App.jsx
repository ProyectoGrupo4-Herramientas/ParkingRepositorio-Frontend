import { Routes, Route, Navigate } from "react-router-dom";
import { ParkingProvider } from "./components/parking/context/ParkingContext";
import MainLayout from "./layouts/MainLayout";
import ParkingMapPage from "./components/parking/pages/ParkingMapPage";
import EntryExitPage from "./components/parking/pages/EntryExitPage";
import ResidentsPage from "./components/parking/pages/ResidentsPage";
import HistoryPage from "./components/parking/pages/HistoryPage";

export default function App() {
  return (
    <ParkingProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ParkingMapPage />} />
          <Route path="/parking" element={<ParkingMapPage />} />
          <Route path="/access" element={<EntryExitPage />} />
          <Route path="/residents" element={<ResidentsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </ParkingProvider>
  );
}
