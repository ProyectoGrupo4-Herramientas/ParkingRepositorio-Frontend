import Sidebar from './components/Sidebar';
import TopAppBar from './components/TopAppBar';
import VehicleEntry from './components/VehicleEntry';
import ActiveStays from './components/ActiveStays';
import './App.css';

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-900 font-body-md antialiased min-h-screen flex">
      <Sidebar />
      <TopAppBar />
      <div className="ml-[260px] mt-16 flex-1 flex justify-center">
        <main className="p-8 w-full max-w-[1440px] flex gap-6">
          <VehicleEntry />
          <ActiveStays />
        </main>
      </div>
    </div>
  );
}
