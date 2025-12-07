import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Users, 
  Clock, 
  Filter,
  MessageSquare,
  User,
  Calendar
} from 'lucide-react';
import { CallLog } from '../types';
import { useData } from '../context/DataContext';

const CallLogging: React.FC = () => {
  const { refreshData } = useData();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Select Type');
  const [statusFilter, setStatusFilter] = useState<string>('Select Status');
  const [showAddModal, setShowAddModal] = useState(false);

  const types = ['All', 'Phone', 'Email', 'Walk-in'];
  const statuses = ['All', 'Open', 'In Progress', 'Closed'];

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/call-logs');
      setCallLogs(response.data);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      toast.error('Failed to fetch call logs');
    }
  };

  const filteredCallLogs = callLogs.filter(call => {
    const contactPerson = call.contact_person || call.contactPerson || '';
    const description = call.description || '';
    const contactNumber = call.contact_number || call.contactNumber || '';
    const callType = call.call_type || call.type || '';
    
    const matchesSearch = contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contactNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || typeFilter === 'Select Type' || callType === typeFilter;
    const matchesStatus = statusFilter === 'All' || statusFilter === 'Select Status' || call.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Phone': return Phone;
      case 'Email': return Mail;
      case 'Walk-in': return Users;
      default: return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Phone': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Email': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Walk-in': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const AddCallLogModal: React.FC = () => {
    const [formData, setFormData] = useState({
      type: 'Phone' as CallLog['call_type'],
      contactPerson: '',
      contactNumber: '',
      description: '',
      handledBy: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation
      if (!formData.contactPerson.trim()) {
        toast.error('❌ Contact person name is required', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      if (!formData.contactNumber.trim()) {
        toast.error('❌ Contact number/email is required', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      if (!formData.description.trim()) {
        toast.error('❌ Description is required', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      if (!formData.handledBy.trim()) {
        toast.error('❌ Handler name is required', {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
        return;
      }

      try {
        await axios.post('http://localhost:5000/api/call-logs', {
          call_type: formData.type,
          contact_person: formData.contactPerson,
          contact_number: formData.contactNumber,
          description: formData.description,
          handled_by: formData.handledBy
        });

        toast.success(`✅ Call from ${formData.contactPerson} logged successfully!`, {
          style: { background: "#2563eb", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });

        fetchCallLogs();
        refreshData();
        setShowAddModal(false);
        setFormData({
          type: 'Phone',
          contactPerson: '',
          contactNumber: '',
          description: '',
          handledBy: ''
        });
      } catch (error: any) {
        console.error('Error adding call log:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to log call';
        toast.error(`❌ ${errorMessage}`, {
          style: { background: "#dc2626", color: "#fff", fontWeight: "600", borderRadius: "8px" }
        });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Log New Call</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'Phone' | 'Email' | 'Walk-in'})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Number/Email
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={formData.type === 'Email' ? 'Enter email address' : 'Enter phone number'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe the issue or request"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Handled By
              </label>
              <input
                type="text"
                value={formData.handledBy}
                onChange={(e) => setFormData({...formData, handledBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your name or team"
                required
              />
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
                Log Call
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Call Logging System</h1>
          <p className="text-gray-600 dark:text-gray-400">Track support calls and communications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Log Call</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{callLogs.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-600">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {callLogs.filter(c => c.status === 'Open').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {callLogs.filter(c => c.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {callLogs.filter(c => c.status === 'Closed').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-600">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls..."
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Call Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Call Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Handled By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCallLogs.map((call) => {
                const callType = call.call_type || call.type || 'Phone';
                const TypeIcon = getTypeIcon(callType);
                const callId = call.call_id ? `CALL${String(call.call_id).padStart(3, '0')}` : (call.id || '');
                const contactPerson = call.contact_person || call.contactPerson || '';
                const contactNumber = call.contact_number || call.contactNumber || '';
                const handledBy = call.handled_by || call.handledBy || '';
                const createdAt = call.created_at || call.createdAt || new Date().toISOString();
                
                return (
                  <tr key={callId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {callId}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {call.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TypeIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(callType)}`}>
                          {callType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {contactPerson}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contactNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {handledBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Call Log Modal */}
      {showAddModal && <AddCallLogModal />}
    </div>
  );
};

export default CallLogging;