import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User,
  Calendar,
  MessageSquare,
  Filter
} from 'lucide-react';
import { Complaint, Asset } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';

const ComplaintManagement: React.FC = () => {
  const { user } = useAuth();
  const { refreshData } = useData();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Select Status');
  const [priorityFilter, setPriorityFilter] = useState<string>('Select Priority');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const statuses = ['All', 'Open', 'In Progress', 'Resolved'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    fetchComplaints();
    fetchAssets();
    fetchEngineers();
  }, []);

  const fetchComplaints = async () => {
    try {
      const params = new URLSearchParams();
      if (user?.role) params.append('user_role', user.role);
      if (user?.dept_id) params.append('dept_id', user.dept_id.toString());
      
      const res = await axios.get(`http://localhost:5000/api/complaints?${params.toString()}`);
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
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

  const fetchEngineers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setEngineers(res.data.filter((u: any) => u.user_role === 'Engineer'));
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reported_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.issue?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || statusFilter === 'Select Status' || complaint.comp_status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || priorityFilter === 'Select Priority' || complaint.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const AddComplaintModal: React.FC = () => {
    const [formData, setFormData] = useState({
      assetId: '',
      issue: '',
      priority: 'Medium' as Complaint['priority']
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        toast.error('❌ You must be logged in to raise a complaint', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      // Validation
      if (!formData.assetId) {
        toast.error('❌ Please select an asset', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      if (!formData.issue.trim()) {
        toast.error('❌ Please describe the issue', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      if (formData.issue.trim().length < 10) {
        toast.error('❌ Issue description must be at least 10 characters', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      try {
        await axios.post('http://localhost:5000/api/complaints', {
          asset_id: formData.assetId,
          raised_by: user.id,
          issue: formData.issue,
          priority: formData.priority,
          comp_status: 'Open'
        });
        
        const selectedAsset = assets.find(a => a.asset_id === Number(formData.assetId));
        toast.success(`✅ Complaint for "${selectedAsset?.asset_name}" registered successfully!`, {
          style: { background: "#2563eb", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        
        fetchComplaints();
        refreshData(); // Refresh dashboard
        setShowAddModal(false);
        
        // Reset form
        setFormData({
          assetId: '',
          issue: '',
          priority: 'Medium'
        });
      } catch (error: any) {
        console.error('Error adding complaint:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to register complaint';
        toast.error(`❌ ${errorMessage}`, {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Register New Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Asset
              </label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select an asset</option>
                {assets.map(asset => (
                  <option key={asset.asset_id} value={asset.asset_id}>
                    {asset.asset_name} ({asset.asset_id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issue Description
              </label>
              <textarea
                value={formData.issue}
                onChange={(e) => setFormData({...formData, issue: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Complaint['priority']})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Register Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ComplaintDetailModal: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
    const [updateStatus, setUpdateStatus] = useState(complaint.comp_status);
    const [assignedTo, setAssignedTo] = useState(complaint.eng_assigned || ''); 
    const [resolution, setResolution] = useState(''); 

    const handleUpdate = async () => {
      try {
        await axios.put(`http://localhost:5000/api/complaints/${complaint.comp_id}`, {
          ...complaint,
          comp_status: updateStatus,
          eng_assigned: assignedTo || null,
        });
        toast.success('Complaint updated successfully');
        fetchComplaints();
        refreshData();
        setSelectedComplaint(null);
      } catch (error) {
        console.error('Error updating complaint:', error);
        toast.error('Failed to update complaint');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Complaint Details</h3>
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complaint ID
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.comp_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Asset
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.asset_name}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {complaint.issue}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reported By
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint.reported_by}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assign Engineer
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">-- Select Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.user_id} value={eng.user_id}>
                    {eng.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as Complaint['comp_status'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Update Complaint
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaint Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage asset complaints</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Status">Select Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="Select Priority">Select Priority</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint) => (
          <div
            key={complaint.comp_id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {complaint.comp_id}
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {complaint.asset_name}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {complaint.issue}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{complaint.reported_by}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date(complaint.creation_time).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.comp_status)}`}>
                {complaint.comp_status}
              </span>
              {complaint.assigned_to && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Assigned to: {complaint.assigned_to}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && <AddComplaintModal />}
      {selectedComplaint && (
        <ComplaintDetailModal complaint={selectedComplaint} />
      )}
    </div>
  );
};

export default ComplaintManagement;
