
import { Role, FleetCategory, VehicleStatus, Site, User, Vehicle, Staff, Driver } from './types';

export const SITES: Site[] = [
  { id: 'S1', name: 'PSH00001' },
  { id: 'S2', name: 'West Industrial Park' },
  { id: 'S3', name: 'East Logistics Center' },
];

export const MOCK_USERS: User[] = [
  { id: 'U1', username: 'admin', role: Role.ADMIN, assignedSiteIds: ['S1', 'S2', 'S3'], isActive: true },
  { id: 'U2', username: 'manager_s1', role: Role.MANAGER, assignedSiteIds: ['S1'], isActive: true },
  { id: 'U3', username: 'tech_s2', role: Role.TECHNICIAN, assignedSiteIds: ['S2'], isActive: true },
];

// Sample Base64 PDF (Minimum valid PDF structure)
const SAMPLE_PDF = "data:application/pdf;base64,JVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFszIDAgUl0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgo3MiA3MjAgVGQKKE9GRklDSUFMLURPQ1VNRU5ULVZFUklGSUVEEK0pIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAwNzcgMDAwMDAgbiAKMDAwMDAwMDE1NCAwMDAwMCBuIAowMDAwMDAwMjg0IDAwMDAwIG4gCjAwMDAwMDAzNzggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NzIKJSVFT0Y=";

export const MOCK_VEHICLES: Vehicle[] = [
  { 
    id: 'V1', 
    vehicleNo: 'VP-526', 
    regNo: '9454-MD',
    type: 'TOYOTA PICKUP', 
    make: 'Toyota', 
    model: 'Hilux', 
    year: 2022, 
    siteId: 'S1', 
    category: FleetCategory.STS, 
    status: VehicleStatus.ACTIVE, 
    lastInspectionDate: '2024-05-15',
    ropExp: '2026-03-03',
    rasExp: '2026-02-13',
    ivmsExp: '2026-01-28',
    speedLimiter: 'AVAILABLE',
    remark: 'Verified by Audit Team',
    // Hardcoded documents for universal testing
    regDoc: SAMPLE_PDF,
    regDoc_filename: 'Registration_VP526.pdf',
    ropDoc: SAMPLE_PDF,
    ropDoc_filename: 'ROP_Permit_2024.pdf'
  },
  { 
    id: 'V2', 
    vehicleNo: 'VP-550', 
    regNo: '1654-BK',
    type: 'TOYOTA PICKUP', 
    make: 'Toyota', 
    model: 'Hilux', 
    year: 2021, 
    siteId: 'S1', 
    category: FleetCategory.STS, 
    status: VehicleStatus.MAINTENANCE, 
    lastInspectionDate: '2024-05-10',
    ropExp: '2025-11-17',
    rasExp: '2025-11-07',
    ivmsExp: '2026-08-16',
    speedLimiter: 'AVAILABLE',
    regDoc: SAMPLE_PDF,
    regDoc_filename: 'Reg_Sample.pdf'
  },
  { 
    id: 'V6', 
    vehicleNo: 'VT-878', 
    regNo: '1229-MB',
    type: 'MIT 3TON TRUCK', 
    make: 'Mitsubishi', 
    model: 'Canter', 
    year: 2022, 
    siteId: 'S1', 
    category: FleetCategory.STS, 
    status: VehicleStatus.ACTIVE,
    ropExp: '2025-12-09',
    rasExp: '2025-12-11',
    ivmsExp: '2025-12-11',
    speedLimiter: '2025-11-27'
  }
];

export const MOCK_STAFF: Staff[] = [
  { 
    id: 'ST_LEAD', 
    name: 'Harish Padiyar', 
    employeeId: '164562', 
    designation: 'Supervisor', 
    siteId: 'S1', 
    contact: '96772254', 
    status: 'On Leave', 
    rating: 5.0,
    avatar: 'https://i.pravatar.cc/300?u=harish',
    email: 'proj.b10.plant@stsoman.com',
    phone: '96772254',
    companyJoinDate: '07/20/2012',
    siteJoinDate: '07/02/2024',
    passportNo: 'N2856533',
    passportExpiry: '12/23/2025',
    civilId: '789562342',
    h2sExpiry: '12/23/2025',
    chemicalCourse: false,
    notes: 'N/A'
  },
  { 
    id: 'ST1', 
    name: 'Sardar John Mohamed', 
    employeeId: '164563', 
    designation: 'Forman', 
    siteId: 'S1', 
    contact: '555-0101', 
    status: 'Active', 
    rating: 4.5,
    managerId: 'ST_LEAD',
    avatar: 'https://i.pravatar.cc/300?u=sardar',
    email: 'sardar.jm@stsoman.com',
    phone: '555-0101',
    companyJoinDate: '01/15/2015',
    siteJoinDate: '01/15/2015',
    passportNo: 'P1234567',
    passportExpiry: '10/10/2026',
    civilId: '111222333',
    h2sExpiry: '05/05/2025',
    chemicalCourse: true,
  }
];

export const MOCK_DRIVERS: Driver[] = [
  { id: 'D1', name: 'Robert Brown', employeeId: 'D101', licenseNo: 'ABC-12345', licenseExpiry: '2025-12-31', assignedVehicle: 'STS-001', siteId: 'S1', status: 'On Duty' },
  { id: 'D2', name: 'Sarah Wilson', employeeId: 'D102', licenseNo: 'XYZ-67890', licenseExpiry: '2024-06-15', siteId: 'S2', status: 'Available' },
];
