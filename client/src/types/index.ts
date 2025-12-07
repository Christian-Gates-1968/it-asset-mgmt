export interface User {
  id: string;
  username: string;
  role: 'Admin' | 'Engineer';
  name: string;
  email: string;
  dept_id?: number;
}

export interface Asset {
  asset_id: number;
  asset_name: string;
  category: string;
  s_no: string;
  location: string;
  amc_or_war: string;
  status: string;
  purchase_date?: string;
  warranty_expiry?: string;
  inventory: number;
  vendor_name: string;
  dept_id: number;
  dept_name?: string;
}

export interface Complaint {
  comp_id: number;
  asset_id: number;
  asset_name: string;
  raised_by: number;
  reported_by: string;
  issue: string;
  comp_status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  creation_time: string;
  eng_assigned?: number | null;
  assigned_to?: string | null;
  expected_res_date?: string | null;
  spare_req?: string | null;
  total_time_taken?: string | null;
  actual_res_date?: string | null;
  comp_type?: string | null;
  updated_at: string;
}



export interface CallLog {
  call_id?: number;
  id?: string;
  call_type: 'Phone' | 'Email' | 'Walk-in';
  type?: 'Phone' | 'Email' | 'Walk-in';
  contact_person: string;
  contactPerson?: string;
  contact_number: string;
  contactNumber?: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  handled_by?: string;
  handledBy?: string;
}

export interface PMReport {
  report_id?: number;
  id?: string;
  asset_id?: number;
  assetId?: string;
  asset_name?: string;
  assetName?: string;
  report_type: 'Maintenance' | 'Inspection' | 'Repair';
  reportType?: 'Maintenance' | 'Inspection' | 'Repair';
  file_name: string;
  fileName?: string;
  file_size?: number;
  fileSize?: string;
  file_path?: string;
  uploaded_by?: number;
  uploadedBy?: string;
  uploaded_by_name?: string;
  uploaded_at?: string;
  uploadedAt?: string;
  reviewed_at?: string;
  notes?: string;
  status: 'Pending' | 'Reviewed' | 'Approved';
}