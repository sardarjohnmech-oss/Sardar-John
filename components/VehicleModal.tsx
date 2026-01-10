
import React, { useState, useEffect } from 'react';
import { X, Save, Truck, Calendar, Hash, MapPin, Activity, ShieldCheck, ClipboardList } from 'lucide-react';
import { Vehicle, VehicleStatus, FleetCategory, Site } from '../types';
import { SITES } from '../constants';

interface VehicleModalProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  mode: 'add' | 'edit';
}

const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vehicleNo: '',
    regNo: '',
    type: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    siteId: SITES[0].id,
    category: FleetCategory.STS,
    status: VehicleStatus.ACTIVE,
    ropExp: '',
    rasExp: '',
    ivmsExp: '',
    speedLimiter: '',
    tpiExp: '',
    mpiExp: '',
    loadTest: '',
    bucket: 'N/A',
    centreOfGravity: 'N/A',
    healthCert: '',
    civilDefence: '',
    hydroTest: '',
    tankTechnical: '',
    fifthWheel: '',
    kingPin: '',
    reliefValve: '',
    lmsValid: '',
    remark: ''
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'compliance'>('basic');

  useEffect(() => {
    if (vehicle && mode === 'edit') {
      setFormData(vehicle);
    }
  }, [vehicle, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: mode === 'edit' ? vehicle!.id : `V_${Date.now()}`
    } as Vehicle);
  };

  const InputField = ({ label, name, type = "text", placeholder = "" }: { label: string, name: keyof Vehicle, type?: string, placeholder?: string }) => (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</label>
      <input 
        name={name as string} 
        type={type}
        value={(formData as any)[name] || ''} 
        onChange={handleChange} 
        className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-orange-600 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6" />
            <h2 className="text-xl font-bold">{mode === 'add' ? 'Add New Fleet Entry' : 'Edit Fleet Details'}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b shrink-0">
          <button 
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'basic' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Basic Info
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'compliance' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Compliance & Inspections
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === 'basic' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-left-2 duration-300">
              <div className="col-span-full">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fleet No</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none" required placeholder="e.g. VP-526" />
                </div>
              </div>

              <InputField label="Reg No" name="regNo" placeholder="e.g. 9454-MD" />
              <InputField label="Make & Type" name="type" placeholder="e.g. TOYOTA PICKUP" />
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Site / Location</label>
                <select name="siteId" value={formData.siteId} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  {SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value={VehicleStatus.ACTIVE}>Active</option>
                  <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
                  <option value={VehicleStatus.BREAKDOWN}>Breakdown</option>
                </select>
              </div>

              <InputField label="Make" name="make" />
              <InputField label="Model" name="model" />
              <InputField label="Year" name="year" type="number" />
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InputField label="ROP EXP" name="ropExp" type="date" />
                <InputField label="RAS EXP" name="rasExp" type="date" />
                <InputField label="IVMS EXP" name="ivmsExp" type="date" />
                <InputField label="Speed Limiter" name="speedLimiter" />
                <InputField label="TPI EXP" name="tpiExp" type="date" />
                <InputField label="MPI EXP" name="mpiExp" type="date" />
                <InputField label="Load Test" name="loadTest" type="date" />
                <InputField label="Bucket" name="bucket" />
                <InputField label="COG" name="centreOfGravity" />
                <InputField label="Health Cert" name="healthCert" type="date" />
                <InputField label="Civil Defence" name="civilDefence" type="date" />
                <InputField label="Hydro Test" name="hydroTest" type="date" />
                <InputField label="Tank Tech" name="tankTechnical" type="date" />
                <InputField label="5th Wheel" name="fifthWheel" type="date" />
                <InputField label="King Pin" name="kingPin" type="date" />
                <InputField label="Relief Valve" name="reliefValve" type="date" />
                <InputField label="LMS Valid" name="lmsValid" type="date" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Remarks</label>
                <textarea 
                  name="remark" 
                  value={formData.remark} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px]"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-8 sticky bottom-0 bg-white border-t mt-4">
            <button type="submit" className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 active:scale-95">
              <Save className="w-4 h-4 mr-2" />
              {mode === 'add' ? 'Save Record' : 'Update Record'}
            </button>
            <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
