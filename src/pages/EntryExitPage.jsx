import MainLayout from "../layouts/MainLayout";
import VehicleEntry from "../components/VehicleEntry";
import ActiveStays from "../components/ActiveStays";

export default function EntryExitPage() {
  return (
    <MainLayout>
      <div className="flex gap-6">
        <VehicleEntry />
        <ActiveStays />
      </div>
    </MainLayout>
  );
}
