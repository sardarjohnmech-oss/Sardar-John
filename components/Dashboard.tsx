
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Truck, AlertCircle, Wrench, Users, UserCheck, Calendar } from 'lucide-react';
import { Vehicle, Staff, Driver, FleetCategory, VehicleStatus } from '../types';

interface DashboardProps {
  vehicles: Vehicle[];
  staff: Staff[];
  drivers: Driver[];
  onStaffClick: (staff: Staff, readOnly: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ vehicles, staff, drivers, onStaffClick }) => {
  const stats = [
    { label: 'Total STS Fleet', value: vehicles.filter(v => v.category === FleetCategory.STS).length, icon: Truck, color: 'bg-orange-500' },
    { label: 'Hire Fleet', value: vehicles.filter(v => v.category === FleetCategory.HIRE).length, icon: Truck, color: 'bg-blue-500' },
    { label: 'Sub-Cont Fleet', value: vehicles.filter(v => v.category === FleetCategory.SUB_CONT).length, icon: Truck, color: 'bg-purple-500' },
    { label: 'Active Vehicles', value: vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Under Maintenance', value: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length, icon: Wrench, color: 'bg-yellow-500' },
    { label: 'Breakdown', value: vehicles.filter(v => v.status === VehicleStatus.BREAKDOWN).length, icon: AlertCircle, color: 'bg-red-500' },
    { label: 'Total Manpower', value: staff.length, icon: Users, color: 'bg-indigo-500' },
    { label: 'Total Drivers', value: drivers.length, icon: Users, color: 'bg-teal-500' },
  ];

  const pieData = [
    { name: 'Active', value: vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length, color: '#22c55e' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length, color: '#eab308' },
    { name: 'Breakdown', value: vehicles.filter(v => v.status === VehicleStatus.BREAKDOWN).length, color: '#ef4444' },
  ];

  const barData = [
    { name: 'S1', STS: 12, Hire: 5, Sub: 3 },
    { name: 'S2', STS: 8, Hire: 4, Sub: 2 },
    { name: 'S3', STS: 15, Hire: 2, Sub: 6 },
  ];

  const maintenanceData = [
    { name: 'Mon', main: 4, break: 2 },
    { name: 'Tue', main: 3, break: 1 },
    { name: 'Wed', main: 5, break: 3 },
    { name: 'Thu', main: 2, break: 4 },
    { name: 'Fri', main: 6, break: 2 },
    { name: 'Sat', main: 2, break: 1 },
    { name: 'Sun', main: 1, break: 0 },
  ];

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'On Leave': return 'bg-yellow-500';
      case 'Resigned': return 'bg-gray-400';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border shadow-sm flex items-center">
            <div className={`${stat.color} p-3 rounded-lg text-white mr-4 shadow-inner`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Manpower Status</h3>
          <p className="text-sm text-blue-500">Real-time status of all personnel.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 items-start">
          {staff.map((person) => (
            <div 
              key={person.id} 
              className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
              onClick={() => onStaffClick(person, true)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-orange-200 transition-all">
                  <img 
                    src={person.avatar || `https://i.pravatar.cc/100?u=${person.id}`} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${getStatusDotColor(person.status)}`}></div>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-600 truncate max-w-[80px]">
                {person.name.split(' ')[0]}
              </p>
            </div>
          ))}
          {staff.length === 0 && (
            <p className="text-sm text-slate-400 italic">No personnel records found.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Status Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet by Site</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="STS" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Hire" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sub" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Maintenance vs Breakdown (Weekly)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maintenanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="main" stroke="#eab308" strokeWidth={2} name="Routine Maintenance" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="break" stroke="#ef4444" strokeWidth={2} name="Breakdown Repairs" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
