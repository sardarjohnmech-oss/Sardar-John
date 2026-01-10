
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Bell, 
  User as UserIcon, 
  Search,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import OrgChartView from './components/OrgChartView';
import VehicleModal from './components/VehicleModal';
import { StaffDetailModal } from './components/StaffDetailModal';
import { Role, PageType, User, Vehicle, VehicleStatus, FleetCategory, Staff, Driver, Site } from './types';
import { SITES, MOCK_USERS, MOCK_VEHICLES, MOCK_STAFF, MOCK_DRIVERS } from './constants';

const App: React.FC = () => {
  // Bypassing login for development: default to true and admin user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);

  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data State
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // Modal states
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isModalReadOnly, setIsModalReadOnly] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleModalMode, setVehicleModalMode] = useState<'add' | 'edit'>('add');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === loginData.username);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('sts_authenticated', 'true');
      localStorage.setItem('sts_user', JSON.stringify(user));
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('sts_authenticated');
    localStorage.removeItem('sts_user');
  };

  // Staff Handlers
  const handleUpdateStaff = (updatedMember: Staff) => {
    setStaff(prev => prev.map(s => s.id === updatedMember.id ? updatedMember : s));
    if (selectedStaff?.id === updatedMember.id) {
      setSelectedStaff(updatedMember);
    }
  };

  const handleAddStaff = (newMember: Staff) => {
    setStaff(prev => [...prev, newMember]);
  };

  const handleRemoveStaff = (id: string) => {
    if (confirm('Are you sure you want to remove this employee?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
      setSelectedStaff(null);
    }
  };

  const openStaffModal = (member: Staff, readOnly: boolean = false) => {
    setSelectedStaff(member);
    setIsModalReadOnly(readOnly);
  };

  // Vehicle Handlers
  const openAddVehicle = () => {
    setVehicleModalMode('add');
    setSelectedVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const openEditVehicle = (v: Vehicle) => {
    setVehicleModalMode('edit');
    setSelectedVehicle(v);
    setIsVehicleModalOpen(true);
  };

  const handleSaveVehicle = (v: Vehicle) => {
    if (vehicleModalMode === 'add') {
      setVehicles(prev => [...prev, v]);
    } else {
      setVehicles(prev => prev.map(item => item.id === v.id ? v : item));
    }
    setIsVehicleModalOpen(false);
  };

  const handleRemoveVehicle = (v: Vehicle) => {
    if (confirm(`Are you sure you want to delete vehicle ${v.vehicleNo}?`)) {
      setVehicles(prev => prev.filter(item => item.id !== v.id));
    }
  };

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE: return 'bg-green-100 text-green-700 border-green-200';
      case VehicleStatus.MAINTENANCE: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case VehicleStatus.BREAKDOWN: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSiteName = (id: string) => SITES.find(s => s.id === id)?.name || 'Unknown';

  const DateExpiryLabel = ({ date }: { date?: string }) => {
    if (!date || date === 'N/A') return <span className="text-gray-400">N/A</span>;
    const expiry = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let colorClass = "bg-green-50 text-green-700";
    if (diffDays < 0) colorClass = "bg-red-600 text-white font-black";
    else if (diffDays < 30) colorClass = "bg-orange-100 text-orange-700 font-bold border-orange-200";
    else if (diffDays < 90) colorClass = "bg-yellow-100 text-yellow-700 font-bold border-yellow-200";

    const formattedDate = expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] border whitespace-nowrap ${colorClass}`}>
        {formattedDate}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden border animate-in fade-in zoom-in duration-500">
          <div className="bg-orange-600 p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            </div>
            <div className="relative z-10">
              <div className="inline-block px-8 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-2xl mb-8 shadow-inner border border-white/20">
                SJM
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none mb-2">Fleet</h1>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase leading-none mb-4">Management</h1>
              <p className="text-orange-100/80 text-[10px] font-bold uppercase tracking-[0.2em]">Multi-Site Fleet Management</p>
            </div>
          </div>
          <form className="p-10 space-y-8" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Username</label>
              <input type="text" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium" placeholder="Enter your username" required value={loginData.username} onChange={(e) => setLoginData({...loginData, username: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
              <input type="password" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium" placeholder="••••••••" required value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-orange-700 active:scale-[0.98] transition-all shadow-xl shadow-orange-600/30">Log In</button>
          </form>
          <div className="px-10 py-6 text-center border-t border-gray-100 bg-gray-50/30">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Demo Access: <span className="text-slate-600">admin / password</span></p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard vehicles={vehicles} staff={staff} drivers={drivers} onStaffClick={(s) => openStaffModal(s, true)} />;
      
      case 'master-list':
        return (
          <DataTable<Vehicle> 
            key="master-list-table"
            title="Central Vehicle Register"
            data={vehicles}
            columns={[
              { header: 'Fleet No', accessor: 'vehicleNo' },
              { header: 'Reg No', accessor: (v) => v.regNo || '-' },
              { header: 'Type', accessor: 'type' },
              { header: 'Site', accessor: (v: Vehicle) => getSiteName(v.siteId) },
              { header: 'Category', accessor: 'category' },
              { header: 'Status', accessor: (v: Vehicle) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              )},
            ]}
            onView={(v) => openEditVehicle(v)}
            onEdit={(v) => openEditVehicle(v)}
            onDelete={handleRemoveVehicle}
          />
        );

      case 'sts-fleet':
        return (
          <DataTable<Vehicle> 
            key="sts-fleet-table"
            title="STS Fleet List"
            data={vehicles.filter(v => v.category === FleetCategory.STS)}
            columns={[
              { header: 'SL NO', accessor: (v) => vehicles.indexOf(v) + 1 },
              { header: 'LOCATION', accessor: (v) => getSiteName(v.siteId) },
              { header: 'FLEET NO', accessor: 'vehicleNo' },
              { header: 'REG NO', accessor: (v) => v.regNo || 'N/A' },
              { header: 'MAKE & TYPE', accessor: 'type' },
              { header: 'CATEGORY', accessor: (v) => v.category + ' VEHICLE' },
              { header: 'ROP.EXP', accessor: (v) => <DateExpiryLabel date={v.ropExp} /> },
              { header: 'RAS EXP', accessor: (v) => <DateExpiryLabel date={v.rasExp} /> },
              { header: 'IVMS EXP', accessor: (v) => <DateExpiryLabel date={v.ivmsExp} /> },
              { header: 'SPEED LIMITER', accessor: (v) => v.speedLimiter || 'N/A' },
              { header: 'TPI EXP', accessor: (v) => <DateExpiryLabel date={v.tpiExp} /> },
              { header: 'MPI EXP', accessor: (v) => <DateExpiryLabel date={v.mpiExp} /> },
              { header: 'LOAD TEST', accessor: (v) => <DateExpiryLabel date={v.loadTest} /> },
              { header: 'BUCKET', accessor: (v) => v.bucket || 'N/A' },
              { header: 'COG', accessor: (v) => v.centreOfGravity || 'N/A' },
              { header: 'HEALTH', accessor: (v) => <DateExpiryLabel date={v.healthCert} /> },
              { header: 'DEFENCE', accessor: (v) => <DateExpiryLabel date={v.civilDefence} /> },
              { header: 'HYDRO', accessor: (v) => <DateExpiryLabel date={v.hydroTest} /> },
              { header: 'TANK TECH', accessor: (v) => <DateExpiryLabel date={v.tankTechnical} /> },
              { header: '5TH WHEEL', accessor: (v) => <DateExpiryLabel date={v.fifthWheel} /> },
              { header: 'KING PIN', accessor: (v) => <DateExpiryLabel date={v.kingPin} /> },
              { header: 'RELIEF', accessor: (v) => <DateExpiryLabel date={v.reliefValve} /> },
              { header: 'LMS VALID', accessor: (v) => <DateExpiryLabel date={v.lmsValid} /> },
              { header: 'REMARK', accessor: (v) => v.remark || '' },
            ]}
            onAdd={openAddVehicle}
            onEdit={openEditVehicle}
            onDelete={handleRemoveVehicle}
          />
        );

      case 'hire-fleet':
        return (
          <DataTable<Vehicle> 
            key="hire-fleet-table"
            title="Hire Fleet Management"
            data={vehicles.filter(v => v.category === FleetCategory.HIRE)}
            columns={[
              { header: 'Fleet No', accessor: 'vehicleNo' },
              { header: 'Reg No', accessor: (v) => v.regNo || 'N/A' },
              { header: 'Make', accessor: 'make' },
              { header: 'Model', accessor: 'model' },
              { header: 'Site', accessor: (v: Vehicle) => getSiteName(v.siteId) },
              { header: 'Status', accessor: (v: Vehicle) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              )},
            ]}
            onAdd={openAddVehicle}
            onEdit={openEditVehicle}
            onDelete={handleRemoveVehicle}
          />
        );

      case 'sub-cont-fleet':
        return (
          <DataTable<Vehicle> 
            key="sub-cont-fleet-table"
            title="Sub-Contractor Fleet"
            data={vehicles.filter(v => v.category === FleetCategory.SUB_CONT)}
            columns={[
              { header: 'Fleet No', accessor: 'vehicleNo' },
              { header: 'Reg No', accessor: (v) => v.regNo || 'N/A' },
              { header: 'Type', accessor: 'type' },
              { header: 'Site', accessor: (v: Vehicle) => getSiteName(v.siteId) },
              { header: 'Status', accessor: (v: Vehicle) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              )},
            ]}
            onAdd={openAddVehicle}
            onEdit={openEditVehicle}
            onDelete={handleRemoveVehicle}
          />
        );

      case 'manpower':
        return (
          <OrgChartView 
            staff={staff} 
            onStaffClick={(s) => openStaffModal(s, false)}
            onAddStaff={handleAddStaff}
            onRemoveStaff={handleRemoveStaff}
          />
        );

      case 'drivers':
        return (
          <DataTable<Driver> 
            key="drivers-table"
            title="Drivers & Operators"
            data={drivers}
            columns={[
              { header: 'Emp ID', accessor: 'employeeId' },
              { header: 'Name', accessor: 'name' },
              { header: 'License No', accessor: 'licenseNo' },
              { header: 'Expiry', accessor: (d: Driver) => {
                const isExpiring = d.licenseExpiry && new Date(d.licenseExpiry) < new Date(new Date().setMonth(new Date().getMonth() + 1));
                return (
                  <span className={isExpiring ? 'text-red-600 font-bold flex items-center' : ''}>
                    {d.licenseExpiry}
                    {isExpiring && <AlertCircle className="w-3 h-3 ml-1" />}
                  </span>
                );
              }},
              { header: 'Assigned Vehicle', accessor: (d: Driver) => d.assignedVehicle || 'Unassigned' },
              { header: 'Status', accessor: (d: Driver) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  d.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {d.status}
                </span>
              )},
            ]}
            onAdd={() => {}}
            onEdit={() => {}}
          />
        );

      default:
        return (
          <div className="bg-white p-12 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Module Under Construction</h2>
            <p className="text-gray-500 mt-2 max-w-md">We're currently working on this feature. This will include full CRUD operations and reporting capabilities in the next release.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        userRole={currentUser?.role || Role.VIEWER}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 z-30 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="ml-3 text-lg font-bold text-gray-900 uppercase tracking-wide">
              {activePage.replace('-', ' ')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-9 pr-4 py-1.5 bg-gray-50 border rounded-full text-sm w-64 focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center pl-4 border-l">
              <div className="mr-3 text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{currentUser?.username}</p>
                <p className="text-[10px] text-orange-600 font-bold uppercase mt-1 leading-none">{currentUser?.role}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold border-2 border-orange-50 shadow-sm">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#f1f5f9]">
          <div className="max-w-[100vw] lg:max-w-full overflow-x-auto">
            <div className="min-w-max">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {selectedStaff && (
        <StaffDetailModal 
          member={selectedStaff} 
          onClose={() => setSelectedStaff(null)}
          onUpdate={handleUpdateStaff}
          onRemove={handleRemoveStaff}
          readOnly={isModalReadOnly}
        />
      )}

      {isVehicleModalOpen && (
        <VehicleModal 
          mode={vehicleModalMode}
          vehicle={selectedVehicle}
          onClose={() => setIsVehicleModalOpen(false)}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
};

export default App;
