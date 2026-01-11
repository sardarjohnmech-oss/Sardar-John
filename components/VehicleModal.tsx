
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Save, 
  Truck, 
  Hash, 
  PlusCircle, 
  FileText, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  CheckCircle, 
  Info, 
  Calendar,
  ShieldAlert,
  ArrowRight,
  ClipboardList,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Vehicle, VehicleStatus, FleetCategory } from '../types';
import { SITES } from '../constants';
import { Column } from './DataTable';

interface VehicleModalProps {
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  mode: 'add' | 'edit';
  currentColumns?: Column<Vehicle>[];
  isPublicView?: boolean;
  readOnly?: boolean;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ 
  vehicle, 
  onClose, 
  onSave, 
  mode, 
  currentColumns = [],
  isPublicView = false,
  readOnly = false
}) => {
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
    remark: ''
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'compliance' | 'docs'>('basic');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const isAttachmentField = (label: string) => {
    const l = label.toUpperCase();
    return l.includes('ATTACHMENT') || l.includes('DOCUMENT') || l.includes('FILE') || l.includes('PDF');
  };

  useEffect(() => {
    if (vehicle && mode === 'edit') setFormData(vehicle);
  }, [vehicle, mode]);

  const customFields = useMemo(() => {
    const hardcodedKeys = new Set([
      'id', 'vehicleNo', 'regNo', 'type', 'make', 'model', 'year', 'siteId', 'category', 'status', 'remark',
      'ropExp', 'rasExp', 'ivmsExp', 'speedLimiter', 'tpiExp', 'mpiExp', 'loadTest', 'healthCert', 'civilDefence', 'lmsValid'
    ]);
    
    const fields: {id: string, header: string, accessor: string}[] = [];
    if (vehicle) {
      Object.keys(vehicle).forEach(key => {
        if (!hardcodedKeys.has(key) && !key.endsWith('_filename')) {
          fields.push({ id: key, header: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toUpperCase(), accessor: key });
        }
      });
    }
    return fields;
  }, [vehicle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value) || 0 : value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (readOnly) return;
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result, [`${name}_filename`]: file.name }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Invalid file. Please select a PDF.");
    }
  };

  const openPdf = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder = "", icon: Icon = Calendar }: { label: string, name: string, type?: string, placeholder?: string, icon?: any, key?: any }) => {
    const isAttachment = isAttachmentField(label);
    const value = (formData as any)[name];
    const fileName = (formData as any)[`${name}_filename`] || 'VehicleDoc.pdf';

    if (isAttachment) {
      return (
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
          <div className={`p-5 rounded-[1.5rem] border-2 ${readOnly ? 'border-slate-100 bg-slate-50/50' : 'border-dashed transition-all ' + (value ? 'border-green-200 bg-green-50/30' : 'border-slate-100 bg-slate-50')}`}>
            {/* Fix: Explicitly return void from ref callback to satisfy TypeScript strict types */}
            <input type="file" accept=".pdf" className="hidden" ref={el => { fileInputRefs.current[name] = el; }} onChange={(e) => handleFileUpload(e, name)} />
            {value ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden" onClick={() => openPdf(value)}>
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-green-100"><FileText className="w-5 h-5 text-green-600" /></div>
                  <div className="truncate cursor-pointer group/pdf">
                    <p className="text-xs font-black text-slate-900 truncate group-hover/pdf:text-orange-600 transition-colors">{fileName}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase flex items-center">
                       Verified PDF <ExternalLink className="w-2.5 h-2.5 ml-1.5" />
                    </p>
                  </div>
                </div>
                {!readOnly && (
                  <button type="button" onClick={() => setFormData(prev => { const u = {...prev}; delete u[name]; return u; })} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-6 text-slate-300">
                <ShieldAlert className="w-6 h-6 mb-2 opacity-30" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Document Attached</span>
                {!readOnly && (
                   <button type="button" onClick={() => fileInputRefs.current[name]?.click()} className="mt-2 text-[11px] text-orange-600 font-black hover:underline">Upload PDF</button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
        <div className="relative group">
          {readOnly ? (
            <div className="w-full px-5 py-4 bg-slate-50/80 border border-slate-100 rounded-[1.25rem] text-sm font-black text-slate-800 flex items-center justify-between">
               <span>{value || '-'}</span>
               <Icon className="w-4 h-4 text-slate-300" />
            </div>
          ) : (
            <input 
              name={name} 
              type={type}
              value={value || ''} 
              onChange={handleChange} 
              placeholder={placeholder}
              className="w-full pl-5 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-black text-slate-900 focus:ring-4 focus:ring-orange-600/5 focus:bg-white outline-none transition-all shadow-sm group-hover:shadow-md" 
            />
          )}
          {!readOnly && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg border border-slate-50 shadow-sm text-slate-400 group-focus-within:text-orange-600 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const ModalShell = ({ children }: { children?: React.ReactNode }) => {
    if (isPublicView) return <div className="bg-white h-full flex flex-col">{children}</div>;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20">
          <div className="p-8 bg-orange-600 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="flex items-center space-x-5 relative z-10">
               <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md"><Truck className="w-6 h-6" /></div>
               <div>
                  <h2 className="text-xl font-black uppercase tracking-tight leading-none">{mode === 'add' ? 'New Fleet entry' : `ID: ${formData.vehicleNo}`}</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1 opacity-70">Fleet Asset Management</p>
               </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90 relative z-10"><X className="w-6 h-6" /></button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <ModalShell>
      <div className="flex border-b bg-slate-50/50 sticky top-0 z-20">
        {[
          { id: 'basic', label: 'OVERVIEW' },
          { id: 'compliance', label: 'COMPLIANCE' },
          { id: 'docs', label: 'DOCUMENTS' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-4 ${activeTab === tab.id ? 'text-orange-600 border-orange-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-white/50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (!readOnly) onSave({...formData, id: vehicle?.id || `V_${Date.now()}`} as Vehicle); }} className={`p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-1 bg-white ${isPublicView ? '' : 'max-h-[70vh]'}`}>
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-300">
            <div className="col-span-full">
               <InputField label="Fleet Number / Unit Identifier" name="vehicleNo" icon={Hash} placeholder="e.g. VP-526" />
            </div>
            <InputField label="Official Registration No" name="regNo" icon={ShieldCheck} placeholder="e.g. 9454-MD" />
            <InputField label="Manufacturer Brand" name="make" icon={ClipboardList} placeholder="e.g. TOYOTA" />
            <InputField label="Operational Status" name="status" icon={Info} placeholder="Active / Maintenance" />
            <InputField label="Deployment Site" name="siteId" icon={ArrowRight} />
            <InputField label="Model Series" name="model" icon={ClipboardList} />
            <InputField label="Year of Build" name="year" type="number" icon={Calendar} />
            
            {customFields.length > 0 && (
               <div className="col-span-full pt-10 border-t border-dashed mt-4">
                  <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center">
                    <Info className="w-4 h-4 mr-3 text-orange-600" /> SITE-SPECIFIC RECORDS
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {customFields.map(f => <InputField key={f.id} label={f.header} name={f.accessor} />)}
                  </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in slide-in-from-right-4 duration-300">
             <InputField label="ROP EXPIRY DATE" name="ropExp" type="date" icon={Calendar} />
             <InputField label="RAS EXPIRY DATE" name="rasExp" type="date" icon={Calendar} />
             <InputField label="IVMS CERTIFICATE" name="ivmsExp" type="date" icon={Calendar} />
             <InputField label="TPI / MPI CERTIFICATE" name="tpiExp" type="date" icon={Calendar} />
             <InputField label="LOAD TEST DATE" name="loadTest" type="date" icon={Calendar} />
             <InputField label="HEALTH CARD EXPIRY" name="healthCert" type="date" icon={Calendar} />
             <InputField label="LMS VALIDITY" name="lmsValid" type="date" icon={Calendar} />
             <InputField label="SPEED LIMITER" name="speedLimiter" icon={ShieldCheck} />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-orange-600 rounded-[2rem] flex items-center shadow-2xl shadow-orange-600/20 text-white relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <ShieldAlert className="w-10 h-10 mr-6 shrink-0 opacity-80" />
               <p className="text-[11px] font-black uppercase leading-loose tracking-widest">
                 Archived digital copies of vehicle permits. Any device scanning the QR code will sync these files instantly.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <InputField label="REGISTRATION PDF" name="regDoc" />
              <InputField label="ROP PERMIT ATTACHMENT" name="ropDoc" />
              <InputField label="IVMS REPORT FILE" name="ivmsDoc" />
              <InputField label="INSURANCE DOCUMENT" name="insDoc" />
            </div>
          </div>
        )}

        <div className="mt-14 pt-10 border-t border-slate-100">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1 flex items-center">
             <ClipboardList className="w-3.5 h-3.5 mr-2" /> MAINTENANCE LOGS & REMARKS
          </label>
          <div className={`w-full px-6 py-5 rounded-[1.5rem] text-sm font-bold min-h-[160px] ${readOnly ? 'bg-slate-50/80 text-slate-800' : 'bg-slate-50 border-none shadow-inner'}`}>
             {readOnly ? (formData.remark || 'No technical remarks found.') : (
               <textarea 
                name="remark" 
                value={formData.remark || ''} 
                onChange={handleChange} 
                className="w-full bg-transparent border-none outline-none resize-none h-full" 
                placeholder="Log technical findings here..."
               />
             )}
          </div>
        </div>

        {!readOnly && (
          <div className="mt-12 flex flex-col sm:flex-row gap-5 pt-10 sticky bottom-0 bg-white border-t border-slate-50 z-30">
            <button type="submit" className="flex-1 py-5 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-orange-600/30 hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center group">
              <Save className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" /> UPDATE RECORD
            </button>
            <button type="button" onClick={onClose} className="px-12 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-200 transition-all active:scale-95">
              DISCARD
            </button>
          </div>
        )}
        
        {readOnly && (
          <div className="mt-12 pt-10 border-t border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Asset Registry Record</p>
          </div>
        )}
      </form>
    </ModalShell>
  );
};

export default VehicleModal;
