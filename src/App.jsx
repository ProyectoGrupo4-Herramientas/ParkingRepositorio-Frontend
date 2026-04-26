import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ParkingMapPage from "./pages/ParkingMapPage";
import EntryExitPage from "./pages/EntryExitPage";
import ResidentsPage from "./pages/ResidentsPage";
import HistoryPage from "./pages/HistoryPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/parking" element={<ParkingMapPage />} />
      <Route path="/access" element={<EntryExitPage/>} />
      <Route path="/residents" element={<ResidentsPage/>} />
      <Route path="/history" element={<HistoryPage />} />

    </Routes>
  );
}
