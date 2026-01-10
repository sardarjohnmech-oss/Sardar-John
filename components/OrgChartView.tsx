
import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  Settings, 
  Info, 
  Star
} from 'lucide-react';
import { Staff } from '../types';

interface StaffCardProps {
  member: Staff;
  onClick: (member: Staff) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ member, onClick }) => {
  return (
    <div 
      onClick={() => onClick(member)}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center min-w-[200px] w-full max-w-[240px] relative transition-all hover:scale-105 hover:shadow-lg duration-200 cursor-pointer"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-orange-50 flex items-center justify-center">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-orange-600">{member.name.charAt(0)}</span>
        )}
      </div>
      
      <h4 className="text-base font-bold text-gray-900 text-center mb-1 leading-tight">{member.name}</h4>
      <p className="text-xs font-medium text-blue-600 mb-3 text-center">{member.designation}</p>
      
      <div className="flex items-center justify-center space-x-3 w-full mt-auto">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
          member.status === 'Active' 
            ? 'bg-green-500 text-white' 
            : member.status === 'On Leave' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-400 text-white'
        }`}>
          {member.status}
        </span>
        
        {member.rating && (
          <div className="flex items-center text-yellow-500 font-bold text-xs">
            <Star className="w-3 h-3 fill-current mr-1" />
            {member.rating.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
};

interface OrgChartViewProps {
  staff: Staff[];
  onStaffClick: (staff: Staff) => void;
  onAddStaff: (member: Staff) => void;
  onRemoveStaff: (id: string) => void;
}

const OrgChartView: React.FC<OrgChartViewProps> = ({ staff, onStaffClick, onAddStaff, onRemoveStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const lead = staff.find(s => !s.managerId);
  const subordinates = staff.filter(s => s.managerId === lead?.id);
  
  const filteredSubordinates = subordinates.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewEmployee = () => {
    const newId = `ST_${Date.now()}`;
    const newMember: Staff = {
      id: newId,
      name: 'New Employee',
      employeeId: 'TBD',
      designation: 'Technician',
      siteId: 'S1',
      contact: '',
      status: 'Active',
      managerId: lead?.id,
    };
    onAddStaff(newMember);
    onStaffClick(newMember);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-4 rounded-xl border border-gray-100 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Employee"
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddNewEmployee}
            className="flex items-center px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
          
          <button 
            onClick={() => alert('Search for an employee to remove them, or use the individual card menus.')}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <UserMinus className="w-4 h-4 mr-2" />
            Remove Employee
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {lead && (
          <div className="flex flex-col items-center relative mb-12">
            <StaffCard member={lead} onClick={onStaffClick} />
            <div className="h-12 w-0.5 bg-gray-200 mt-0 shadow-sm"></div>
          </div>
        )}

        <div className="w-full relative px-4">
          {filteredSubordinates.length > 1 && (
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <div 
                className="h-0.5 bg-gray-200 shadow-sm"
                style={{ 
                  width: `calc(100% - ${100 / filteredSubordinates.length}%)`,
                  maxWidth: 'calc(100% - 240px)'
                }}
              ></div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 pt-0">
            {filteredSubordinates.map((sub) => (
              <div key={sub.id} className="flex flex-col items-center">
                <div className="h-8 w-0.5 bg-gray-200 mb-0"></div>
                <StaffCard member={sub} onClick={onStaffClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChartView;
