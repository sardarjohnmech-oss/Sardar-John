
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Trash2, 
  Edit,
  AlertCircle,
  Save,
  CheckCircle,
  Camera,
  Star,
  Info
} from 'lucide-react';
import { Staff } from '../types';

interface StaffDetailModalProps {
  member: Staff;
  onClose: () => void;
  onUpdate: (member: Staff) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}

const DetailRow: React.FC<{ icon: any, label: string, value?: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center text-gray-500">
      <Icon className="w-4 h-4 mr-3" />
      {label}
    </div>
    <div className="font-semibold text-gray-900">{value || 'N/A'}</div>
  </div>
);

const ShieldCheckDetailRow: React.FC<{ icon: any, label: string, value?: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center text-gray-500">
      <Icon className="w-4 h-4 mr-3" />
      {label}
    </div>
    <div className="font-semibold text-gray-900 flex items-center">
      {value}
      {value === 'Yes' && <CheckCircle className="w-3 h-3 ml-1.5 text-green-500" />}
    </div>
  </div>
);

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({ 
  member, 
  onClose, 
  onUpdate, 
  onRemove,
  readOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Staff>({ ...member });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({ ...member });
    // If modal is swapped to read-only while editing, force exit edit mode
    if (readOnly) setIsEditing(false);
  }, [member, readOnly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (!readOnly) fileInputRef.current?.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Image Part */}
        <div className="relative h-40 flex-shrink-0 bg-slate-200 group">
          <img 
            src={formData.avatar || `https://i.pravatar.cc/300?u=${member.id}`} 
            alt={formData.name} 
            className="w-full h-full object-cover object-top opacity-90 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />

          {isEditing && !readOnly && (
            <button 
              onClick={triggerFileInput}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Camera className="w-10 h-10 mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Change Photo</span>
            </button>
          )}

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {!isEditing && (
            <div className="absolute bottom-4 left-8 text-white pointer-events-none">
               <h2 className="text-2xl font-bold">{formData.name}</h2>
               <p className="text-white/80 text-sm">{formData.designation} - {formData.employeeId}</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {isEditing && !readOnly ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Designation</label>
                  <input name="designation" value={formData.designation} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employee ID</label>
                  <input name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" type="email" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={formData.rating || 0} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Join Date</label>
                  <input name="companyJoinDate" value={formData.companyJoinDate || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="MM/DD/YYYY" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Site Join Date</label>
                  <input name="siteJoinDate" value={formData.siteJoinDate || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="MM/DD/YYYY" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Passport No</label>
                  <input name="passportNo" value={formData.passportNo || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Civil ID</label>
                  <input name="civilId" value={formData.civilId || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                 <input type="checkbox" name="chemicalCourse" checked={formData.chemicalCourse || false} onChange={handleChange} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
                 <label className="text-sm font-medium text-gray-700">Chemical Course Completed</label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
                <textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none min-h-[80px]" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm flex items-center justify-center hover:bg-orange-700 transition-colors">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Mail className="w-4 h-4 mr-3" />
                    Email
                  </div>
                  <div className="font-semibold text-gray-900">{member.email || 'N/A'}</div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Phone className="w-4 h-4 mr-3" />
                    Phone
                  </div>
                  <div className="font-semibold text-gray-900">{member.phone || 'N/A'}</div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500">Status</div>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                    member.status === 'Active' 
                      ? 'bg-green-500 text-white' 
                      : member.status === 'On Leave' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-gray-400 text-white'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4">
                <DetailRow icon={Calendar} label="Company Join Date" value={member.companyJoinDate} />
                <DetailRow icon={Calendar} label="Site Join Date" value={member.siteJoinDate} />
                <DetailRow icon={FileText} label="Passport" value={member.passportNo ? `${member.passportNo} (Expires: ${member.passportExpiry || 'N/A'})` : 'N/A'} />
                <DetailRow icon={AlertCircle} label="Civil ID" value={member.civilId} />
                <DetailRow icon={Calendar} label="H2S Card Valid Until" value={member.h2sExpiry} />
                <ShieldCheckDetailRow icon={ShieldCheck} label="Chemical Course" value={member.chemicalCourse ? 'Yes' : 'No'} />
                <DetailRow icon={Star} label="Rating" value={member.rating ? `${member.rating.toFixed(1)}/5.0` : 'N/A'} />
                <DetailRow icon={Info} label="Notes" value={member.notes} />
              </div>
            </>
          )}
        </div>

        {!isEditing && !readOnly && (
          <div className="p-6 bg-white border-t flex gap-4">
            <button 
              onClick={() => onRemove(member.id)}
              className="flex-1 flex items-center justify-center px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
