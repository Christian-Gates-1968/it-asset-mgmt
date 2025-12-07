import { Asset, Complaint, CallLog, PMReport } from '../types';

export const mockAssets: Asset[] = [
  {
    asset_id: 1,
    asset_name: 'Dell Latitude 5520',
    category: 'Laptop',
    s_no: 'DL5520001',
    status: 'Active',
    location: 'Floor 3, Desk 15',
    amc_or_war: 'Warranty',
    stock_in: '2023-01-15',
    stock_out: null,
    inventory: 1,
    vendor_name: 'Dell India',
    dept_id: 1
  },
  {
    asset_id: 2,
    asset_name: 'HP LaserJet Pro',
    category: 'Printer',
    s_no: 'HP4500002',
    status: 'Under Repair',
    location: 'Floor 2, Print Room',
    amc_or_war: 'AMC',
    stock_in: '2022-06-10',
    stock_out: null,
    inventory: 1,
    vendor_name: 'HP Solutions',
    dept_id: 2
  },
  {
    asset_id: 3,
    asset_name: 'Cisco Catalyst 2960',
    category: 'Router',
    s_no: 'CC2960003',
    status: 'Active',
    location: 'Server Room A',
    amc_or_war: 'Warranty',
    stock_in: '2023-03-20',
    stock_out: null,
    inventory: 1,
    vendor_name: 'Cisco Systems',
    dept_id: 1
  }
];

export const mockComplaints: Complaint[] = [
  {
    comp_id: 1,
    asset_id: 1,
    asset_name: 'Dell Latitude 5520',
    raised_by: 101,
    reported_by: 'John Smith',
    issue: 'Laptop screen flickering intermittently',
    comp_status: 'In Progress',
    priority: 'Medium',
    creation_time: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:20:00Z',
    assigned_to: 'Tech Engineer 1',
    eng_assigned: 201
  },
  {
    comp_id: 2,
    asset_id: 2,
    asset_name: 'HP LaserJet Pro',
    raised_by: 102,
    reported_by: 'IT Department',
    issue: 'Printer not responding, paper jam issues',
    comp_status: 'Open',
    priority: 'High',
    creation_time: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:15:00Z'
  },
  {
    comp_id: 3,
    asset_id: 3,
    asset_name: 'Cisco Catalyst 2960',
    raised_by: 103,
    reported_by: 'Network Team',
    issue: 'Network connectivity issues in Building A',
    comp_status: 'Resolved',
    priority: 'Critical',
    creation_time: '2024-01-14T08:00:00Z',
    updated_at: '2024-01-15T16:30:00Z',
    assigned_to: 'Senior Network Engineer',
    eng_assigned: 202
  }
];

export const mockCallLogs: CallLog[] = [
  {
    id: 'CALL001',
    type: 'Phone',
    contactPerson: 'Sarah Johnson',
    contactNumber: '+1-555-0123',
    description: 'Unable to connect to company VPN',
    status: 'Closed',
    createdAt: '2024-01-16T11:00:00Z',
    handledBy: 'Tech Support Team'
  },
  {
    id: 'CALL002',
    type: 'Email',
    contactPerson: 'Mike Wilson',
    contactNumber: 'mike.wilson@company.com',
    description: 'Request for software installation - Adobe Creative Suite',
    status: 'In Progress',
    createdAt: '2024-01-16T13:30:00Z',
    handledBy: 'Software Installation Team'
  },
  {
    id: 'CALL003',
    type: 'Walk-in',
    contactPerson: 'Emily Davis',
    contactNumber: 'Ext: 4567',
    description: 'Keyboard and mouse replacement request',
    status: 'Open',
    createdAt: '2024-01-16T15:45:00Z',
    handledBy: 'Hardware Support Team'
  }
];

export const mockPMReports: PMReport[] = [
  {
    id: 'PM001',
    assetId: 'AST001',
    assetName: 'Dell Latitude 5520',
    reportType: 'Maintenance',
    fileName: 'laptop_maintenance_jan2024.pdf',
    fileSize: '2.3 MB',
    uploadedBy: 'Tech Engineer 1',
    uploadedAt: '2024-01-15T16:00:00Z',
    status: 'Approved'
  },
  {
    id: 'PM002',
    assetId: 'AST002',
    assetName: 'HP LaserJet Pro',
    reportType: 'Repair',
    fileName: 'printer_repair_report.xlsx',
    fileSize: '1.5 MB',
    uploadedBy: 'Service Center',
    uploadedAt: '2024-01-10T09:00:00Z',
    status: 'Reviewed'
  }
];
