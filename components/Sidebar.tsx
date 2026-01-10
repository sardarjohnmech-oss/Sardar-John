
import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  ClipboardCheck, 
  Wrench, 
  AlertTriangle, 
  Users, 
  UserSquare, 
  Settings, 
  LogOut, 
  ChevronRight,
  Database,
  Building2
} from 'lucide-react';
import { PageType, Role } from '../types';

interface SidebarProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  userRole: Role;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR, Role.VIEWER] },
    { id: 'master-list', label: 'Master List', icon: Database, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR, Role.VIEWER] },
    { id: 'sts-fleet', label: 'STS Fleet', icon: Truck, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR] },
    { id: 'hire-fleet', label: 'Hire Fleet', icon: Truck, roles: [Role.ADMIN, Role.MANAGER] },
    { id: 'sub-cont-fleet', label: 'Sub-Cont Fleet', icon: Truck, roles: [Role.ADMIN, Role.MANAGER] },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR, Role.TECHNICIAN] },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR, Role.TECHNICIAN] },
    { id: 'breakdown', label: 'Breakdowns', icon: AlertTriangle, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR, Role.TECHNICIAN] },
    { id: 'manpower', label: 'Manpower', icon: Users, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR] },
    { id: 'drivers', label: 'Drivers', icon: UserSquare, roles: [Role.ADMIN, Role.MANAGER, Role.SUPERVISOR] },
    { id: 'users', label: 'User Management', icon: Users, roles: [Role.ADMIN] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: [Role.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col shadow-sm fixed lg:relative z-40 transition-transform duration-300">
      <div className="p-6 border-b flex items-center space-x-3">
        <div className="px-2 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg min-w-[44px]">
          SJM
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">Fleet Management</h1>
          <p className="text-xs text-orange-600 font-medium mt-1">Multi-Site Manager</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="px-3 space-y-1">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as PageType)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
              }`}
            >
              <div className="flex items-center">
                <item.icon className={`w-5 h-5 mr-3 ${activePage === item.id ? 'text-orange-600' : 'text-gray-400'}`} />
                {item.label}
              </div>
              {activePage === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
