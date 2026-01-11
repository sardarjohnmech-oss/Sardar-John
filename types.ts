
export enum Role {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  SUPERVISOR = 'Supervisor',
  TECHNICIAN = 'Technician',
  VIEWER = 'Viewer'
}

export enum FleetCategory {
  STS = 'STS',
  HIRE = 'Hire',
  SUB_CONT = 'Sub-Cont'
}

export enum VehicleStatus {
  ACTIVE = 'Active',
  MAINTENANCE = 'Maintenance',
  BREAKDOWN = 'Breakdown'
}

export interface Site {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  role: Role;
  assignedSiteIds: string[];
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  regNo?: string;
  type: string;
  make: string;
  model: string;
  year: number;
  siteId: string;
  category: FleetCategory;
  status: VehicleStatus;
  lastInspectionDate?: string;
  
  // Compliance Fields
  ropExp?: string;
  rasExp?: string;
  ivmsExp?: string;
  speedLimiter?: string;
  tpiExp?: string;
  mpiExp?: string;
  loadTest?: string;
  bucket?: string;
  centreOfGravity?: string;
  healthCert?: string;
  civilDefence?: string;
  hydroTest?: string;
  tankTechnical?: string;
  fifthWheel?: string;
  kingPin?: string;
  reliefValve?: string;
  lmsValid?: string;
  remark?: string;

  // Support for custom fields added via UI
  [key: string]: any;
}

export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  siteId: string;
  contact: string;
  status: 'Active' | 'On Leave' | 'Resigned';
  avatar?: string;
  rating?: number;
  managerId?: string;
  email?: string;
  phone?: string;
  companyJoinDate?: string;
  siteJoinDate?: string;
  passportNo?: string;
  passportExpiry?: string;
  civilId?: string;
  h2sExpiry?: string;
  chemicalCourse?: boolean;
  notes?: string;
  [key: string]: any;
}

export interface Driver {
  id: string;
  name: string;
  employeeId: string;
  licenseNo: string;
  licenseExpiry: string;
  assignedVehicle?: string;
  siteId: string;
  status: 'Available' | 'On Duty' | 'Leave';
}

export type PageType = 
  | 'dashboard' 
  | 'master-list' 
  | 'sts-fleet' 
  | 'hire-fleet' 
  | 'sub-cont-fleet' 
  | 'inspections' 
  | 'maintenance' 
  | 'breakdown' 
  | 'manpower' 
  | 'drivers' 
  | 'users' 
  | 'settings';
