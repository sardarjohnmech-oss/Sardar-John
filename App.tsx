
import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User as UserIcon, 
  Clock,
  QrCode,
  ChevronLeft,
  Search,
  CheckCircle2,
  Maximize2,
  Ghost,
  XCircle,
  Download,
  Upload,
  ShieldCheck,
  ExternalLink,
  FileText,
  BadgeCheck,
  ArrowUpRight,
  Printer,
  Share2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataTable, { Column } from './components/DataTable';
import VehicleModal from './components/VehicleModal';
import { StaffDetailModal } from './components/StaffDetailModal';
import { Role, PageType, User, Vehicle, VehicleStatus, FleetCategory, Staff, Driver } from './types';
import { SITES, MOCK_USERS, MOCK_VEHICLES, MOCK_STAFF, MOCK_DRIVERS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('sts_fleet_v9_stable');
    return saved ? JSON.parse(saved) : MOCK_VEHICLES;
  });

  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalReadOnly, setIsModalReadOnly] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleModalMode, setVehicleModalMode] = useState<'add' | 'edit'>('add');
  const [currentTableColumns, setCurrentTableColumns] = useState<Column<any>[]>([]);
  
  const [isScanView, setIsScanView] = useState(false);
  const [scannedVehicle, setScannedVehicle] = useState<Vehicle | null>(null);
  const [scanError, setScanError] = useState<boolean>(false);
  const [bigQrVehicle, setBigQrVehicle] = useState<Vehicle | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('sts_fleet_v9_stable', JSON.stringify(vehicles));
  }, [vehicles]);

  /**
   * CRITICAL: Fix for the "Site Not Found" / Malformed URL error.
   * This function creates a perfectly clean, absolute URL for any QR scanner.
   */
  const getPublicBaseUrl = () => {
    try {
      // Use window.location directly for the most accurate current host
      const url = new URL(window.location.href);
      // Remove any trailing slashes and query params for the base
      return (url.origin + url.pathname).replace(/\/$/, "");
    } catch (e) {
      // Fallback for edge cases
      return window.location.href.split('?')[0].replace(/\/$/, "");
    }
  };

  const generateScannerLink = (id: string) => {
    const base = getPublicBaseUrl();
    // Use the cleanest 'v=' parameter structure
    return `${base}?v=${id}`;
  };

  useEffect(() => {
    const handleUrlQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const vehicleId = params.get('v');
      
      if (vehicleId) {
        // Priority 1: Check Local Storage (data created on this device)
        // Priority 2: Check Master Registry (MOCK_VEHICLES which has hardcoded PDFs)
        let vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
          vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId);
        }

        if (vehicle) {
          setScannedVehicle(vehicle);
          setScanError(false);
          setIsScanView(true);
        } else {
          setScanError(true);
          setIsScanView(true);
        }
      } else {
        setIsScanView(false);
      }
    };

    handleUrlQuery();
    window.addEventListener('popstate', handleUrlQuery);
    return () => window.removeEventListener('popstate', handleUrlQuery);
  }, [vehicles]);

  const resetScanState = () => {
    const cleanUrl = getPublicBaseUrl();
    window.history.pushState({}, '', cleanUrl);
    setIsScanView(false);
    setScannedVehicle(null);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    if (vehicleModalMode === 'add') {
      const newV = { ...updatedVehicle, id: `V_${Date.now()}` };
      setVehicles(prev => [...prev, newV]);
    } else {
      setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    }
    setIsVehicleModalOpen(false);
  };

  const renderQrCell = (v: Vehicle) => {
    const qrUrl = generateScannerLink(v.id);
    return (
      <div className="flex flex-col items-center no-print">
        <button 
          onClick={(e) => { e.stopPropagation(); setBigQrVehicle(v); }}
          className="p-1.5 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-orange-500 hover:shadow-lg transition-all"
        >
          <QRCodeSVG value={qrUrl} size={42} level="H" />
        </button>
      </div>
    );
  };

  if (isScanView) {
    return (
      <div className="min-h-screen bg-white sm:bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden">
        {/* Simplified Mobile-First Header */}
        <header className="p-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-3">
             <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
                <ShieldCheck className="w-5 h-5 text-white" />
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Profile Access</p>
                <h1 className="text-sm font-black text-slate-900 uppercase mt-1">{scannedVehicle?.vehicleNo || 'Asset Portal'}</h1>
             </div>
          </div>
          <button onClick={resetScanState} className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all">
             <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 p-4 sm:p-10 max-w-xl mx-auto w-full">
           {scanError ? (
             <div className="bg-white rounded-[2rem] shadow-xl p-16 text-center border-2 border-dashed border-slate-100 mt-10">
                <Ghost className="w-12 h-12 mx-auto mb-6 text-slate-200" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Access Denied</h2>
                <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-widest leading-loose">Asset not found in Registry.</p>
                <button onClick={resetScanState} className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Return Home</button>
             </div>
           ) : scannedVehicle && (
             <div className="animate-in slide-in-from-bottom-8 duration-500">
               {/* Identity Card Style Header */}
               <div className="bg-slate-900 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl mb-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <BadgeCheck className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase">{scannedVehicle.vehicleNo}</h2>
                  <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mt-2">{scannedVehicle.type}</p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-3">
                     <div className="bg-white/5 border border-white/5 rounded-xl py-3">
                        <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Status</p>
                        <p className="text-[10px] text-green-400 font-black uppercase">{scannedVehicle.status}</p>
                     </div>
                     <div className="bg-white/5 border border-white/5 rounded-xl py-3">
                        <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Reg No</p>
                        <p className="text-[10px] text-white font-black uppercase">{scannedVehicle.regNo || '---'}</p>
                     </div>
                  </div>
               </div>

               {/* Full Vehicle Profile Component (Guest Mode) */}
               <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                  <VehicleModal 
                    mode="edit"
                    vehicle={scannedVehicle}
                    onClose={resetScanState}
                    onSave={() => {}} 
                    isPublicView={true} 
                    readOnly={true}
                  />
               </div>
               
               <div className="mt-8 text-center">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">Official Asset Certificate</p>
               </div>
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} userRole={currentUser?.role || Role.VIEWER} onLogout={() => setIsAuthenticated(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 z-30 shadow-sm no-print">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-600/30">F</div>
            <div>
               <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">{activePage.replace('-', ' ')}</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Fleet Stable v9.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
               <button onClick={() => {
                 const blob = new Blob([JSON.stringify(vehicles, null, 2)], { type: 'application/json' });
                 const link = document.createElement('a');
                 link.href = URL.createObjectURL(blob);
                 link.download = "STS_Fleet_Master.json";
                 link.click();
               }} className="p-3 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl transition-all"><Download className="w-5 h-5" /></button>
               <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-50 text-slate-400 hover:text-orange-600 rounded-xl transition-all"><Upload className="w-5 h-5" /></button>
               <input type="file" ref={fileInputRef} onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { try { setVehicles(JSON.parse(ev.target?.result as string)); alert("Registry Updated!"); } catch(e) { alert("Error"); } };
                    reader.readAsText(file);
                 }
               }} className="hidden" accept=".json" />
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300"><UserIcon className="w-6 h-6" /></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#f8fafc] custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-40">
            {activePage === 'dashboard' ? (
               <Dashboard vehicles={vehicles} staff={staff} drivers={drivers} onStaffClick={(s) => { setSelectedStaff(s); setIsModalReadOnly(true); }} />
            ) : activePage === 'master-list' || activePage === 'sts-fleet' ? (
              <DataTable<Vehicle> 
                title={activePage === 'master-list' ? "Registry Portal" : "Corporate Fleet"}
                data={activePage === 'sts-fleet' ? vehicles.filter(v => v.category === FleetCategory.STS) : vehicles}
                columns={[
                  { header: 'SCANNER', accessor: (v) => renderQrCell(v), align: 'center', id: 'col-qr' },
                  { header: 'UNIT ID', accessor: 'vehicleNo' },
                  { header: 'REG NO', accessor: (v) => v.regNo || '-' },
                  { header: 'SITE', accessor: (v) => SITES.find(s => s.id === v.siteId)?.name || 'N/A' },
                  { header: 'STATUS', accessor: (v) => (
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${v.status === VehicleStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{v.status}</span>
                  )},
                ]}
                onAdd={activePage === 'sts-fleet' ? () => { setSelectedVehicle(null); setVehicleModalMode('add'); setIsVehicleModalOpen(true); } : undefined}
                onView={(v) => { 
                  // Construct and go to the link
                  const link = generateScannerLink(v.id);
                  window.history.pushState({}, '', link);
                  setScannedVehicle(v);
                  setIsScanView(true);
                }}
                onEdit={(v) => { setSelectedVehicle(v); setVehicleModalMode('edit'); setIsVehicleModalOpen(true); }}
                onDelete={(v) => { if (confirm(`Delete ${v.vehicleNo}?`)) setVehicles(prev => prev.filter(item => item.id !== v.id)); }}
              />
            ) : (
              <div className="p-20 text-center text-slate-200 font-black uppercase tracking-[0.5em]">Module Offline</div>
            )}
          </div>
        </main>
      </div>

      {/* Large Modal for QR Sharing */}
      {bigQrVehicle && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300" onClick={() => setBigQrVehicle(null)}>
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center space-y-10 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setBigQrVehicle(null)} className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"><XCircle className="w-8 h-8" /></button>
            <div className="text-center">
              <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{bigQrVehicle.vehicleNo}</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3">Link to Mobile Registry</p>
            </div>
            
            <div className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-2xl relative group">
               <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]"></div>
               <QRCodeSVG value={generateScannerLink(bigQrVehicle.id)} size={320} level="H" />
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
               <button onClick={() => { navigator.clipboard.writeText(generateScannerLink(bigQrVehicle.id)); alert("Registry URL Copied!"); }} className="py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center active:scale-95 transition-all">
                  <Share2 className="w-4 h-4 mr-3" /> Copy URL
               </button>
               <button onClick={() => window.print()} className="py-5 bg-orange-600 text-white rounded-[1.75rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center shadow-xl shadow-orange-600/30 active:scale-95 transition-all">
                  <Printer className="w-4 h-4 mr-3" /> Print Label
               </button>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest leading-loose">
               Scan with mobile to see PDF documents <br/> and full inspection history instantly.
            </p>
          </div>
        </div>
      )}

      {isVehicleModalOpen && <VehicleModal mode={vehicleModalMode} vehicle={selectedVehicle} onClose={() => setIsVehicleModalOpen(false)} onSave={handleSaveVehicle} readOnly={false} />}
      {selectedStaff && <StaffDetailModal member={selectedStaff} onClose={() => setSelectedStaff(null)} onUpdate={(m) => setStaff(prev => prev.map(s => s.id === m.id ? m : s))} onRemove={(id) => setStaff(prev => prev.filter(s => s.id !== id))} readOnly={isModalReadOnly} />}
    </div>
  );
};

export default App;
