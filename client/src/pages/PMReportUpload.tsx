import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  Download, 
  Eye, 
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { PMReport, Asset } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PMReportUpload: React.FC = () => {
  const { user } = useAuth();
  const { refreshData } = useData();
  const [reports, setReports] = useState<PMReport[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');    
  const [typeFilter, setTypeFilter] = useState<string>('Select Type');
  const [statusFilter, setStatusFilter] = useState<string>('Select Status');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchAssets();
  }, []);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.role) params.append('user_role', user.role);
      if (user?.dept_id) params.append('dept_id', user.dept_id.toString());
      
      const res = await axios.get(`http://localhost:5000/api/pm-reports?${params.toString()}`);
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching PM reports:', error);
      toast.error('Failed to fetch PM reports');
    }
  };

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.role) params.append('user_role', user.role);
      if (user?.dept_id) params.append('dept_id', user.dept_id.toString());
      
      const res = await axios.get(`http://localhost:5000/api/assets?${params.toString()}`);
      setAssets(res.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const types = ['Maintenance', 'Inspection', 'Repair'];
  const statuses = ['Pending', 'Reviewed', 'Approved'];

  const filteredReports = reports.filter(report => {
    const assetName = report.asset_name || report.assetName || '';
    const fileName = report.file_name || report.fileName || '';
    const uploadedBy = report.uploaded_by_name || report.uploadedBy || '';
    
    const matchesSearch = assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
  typeFilter === 'Select Type' || typeFilter === 'All' || report.reportType === typeFilter;
const matchesStatus =
  statusFilter === 'Select Status' || statusFilter === 'All' || report.status === statusFilter;    
  
  return matchesSearch && matchesType && matchesStatus;
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return FileText;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      default:
        return File;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Reviewed': return Eye;
      case 'Pending': return Clock;
      default: return AlertCircle;
    }
  };

  const handleDownload = async (reportId: number, fileName: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pm-reports/download/${reportId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('✅ File downloaded successfully!', {
        style: { background: "#16a34a", color: "#fff", fontWeight: "600", borderRadius: "8px" }
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('❌ Failed to download file', {
        style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
      });
    }
  };

  const handleDelete = async (reportId: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/pm-reports/${reportId}`);
      
      toast.success('🗑️ Report deleted successfully!', {
        style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
      });
      
      fetchReports();
      refreshData();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('❌ Failed to delete report', {
        style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  const UploadModal: React.FC = () => {
    const [formData, setFormData] = useState({
      assetId: '',
      reportType: 'Maintenance' as 'Maintenance' | 'Inspection' | 'Repair',
      files: [] as File[]
    });
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.assetId || formData.files.length === 0) {
        toast.error('Please select an asset and upload at least one file');
        return;
      }

      setUploading(true);

      try {
        // Upload each file
        for (const file of formData.files) {
          const formDataToSend = new FormData();
          formDataToSend.append('file', file);
          formDataToSend.append('asset_id', formData.assetId);
          formDataToSend.append('report_type', formData.reportType);
          formDataToSend.append('uploaded_by', user?.id || '');

          await axios.post('http://localhost:5000/api/pm-reports', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        toast.success(`✅ ${formData.files.length} report(s) uploaded successfully!`, {
          style: { background: "#16a34a", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });

        fetchReports();
        refreshData();
        setShowUploadModal(false);
        setFormData({
          assetId: '',
          reportType: 'Maintenance',
          files: []
        });
      } catch (error: any) {
        console.error('Error uploading reports:', error);
        toast.error(`❌ ${error.response?.data?.error || 'Failed to upload reports'}`, {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
      } finally {
        setUploading(false);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFormData({
          ...formData,
          files: Array.from(e.target.files)
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload PM Report</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asset
              </label>
              <select
  value={formData.assetId}
  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  required
>
   <option value="">Select an asset</option>
   {assets.map((asset) => (
     <option key={asset.asset_id} value={asset.asset_id}>
       {asset.asset_name} - {asset.s_no}
     </option>
   ))}
</select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <input 
              type="text"
              value="Preventive"
              disabled
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Files
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1 inline">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, XLS, or images up to 10MB
                </p>
              </div>
              
              {formData.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.assetId || formData.files.length === 0 || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PM Report Upload</h1>
          <p className="text-gray-600 dark:text-gray-400">Upload and manage preventive maintenance reports</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Report</span>
        </button>
      </div>

      {/* Stats Cards */}
      

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
           value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
          <option value="Select Type" disabled>Select Type</option>
          <option value="All">All</option>
          {types.map(type => (
          <option key={type} value={type}>{type}</option>
         ))}
        </select>
        </div>

          <div>
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="Select Status" disabled>Select Status</option>
    <option value="All">All</option>
    {statuses.map(status => (
      <option key={status} value={status}>{status}</option>
    ))}
  </select>
</div>

        </div>
      </div>

      {/* Reports Grid */}
      <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">FilePath</th>
        <th className="px-6 py-3"></th>
      </tr>
    </thead>
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {filteredReports.length === 0 ? (
        <tr>
          <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No PM reports found</p>
          </td>
        </tr>
      ) : (
        filteredReports.map((report) => {
          const reportId = report.report_id ? `PM${String(report.report_id).padStart(3, '0')}` : (report.id || '');
          const assetName = report.asset_name || report.assetName || '';
          const uploadedAt = report.uploaded_at || report.uploadedAt || new Date().toISOString();
          const reportType = report.report_type || report.reportType || '';
          const fileName = report.file_name || report.fileName || '';
          
          return (
          <tr key={reportId}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {assetName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {new Date(uploadedAt).toLocaleDateString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
            {reportType}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
            {fileName}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex space-x-3">
            <button 
              onClick={() => handleDownload(report.report_id!, fileName)}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDelete(report.report_id!)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>


      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default PMReportUpload;