import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Package, 
  AlertTriangle, 
  Phone, 
  TrendingUp,  
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Complaint, CallLog } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [pmReports, setPmReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { dataVersion } = useData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (user?.role) params.append('user_role', user.role);
        if (user?.dept_id) params.append('dept_id', user.dept_id.toString());
        const queryString = params.toString();
        
        const [assetsRes, complaintsRes, callLogsRes, pmReportsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/assets?${queryString}`),
          axios.get(`http://localhost:5000/api/complaints?${queryString}`),
          axios.get('http://localhost:5000/api/call-logs'),
          axios.get(`http://localhost:5000/api/pm-reports?${queryString}`)
        ]);
        setAssets(assetsRes.data);
        setComplaints(complaintsRes.data);
        setCallLogs(callLogsRes.data);
        setPmReports(pmReportsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataVersion]);

  const stats = {
    totalAssets: assets.length,
    assetsUnderRepair: assets.filter(a => a.status === 'In Repair' || a.status === 'Under Repair').length,
    activeAssets: assets.filter(a => a.status === 'Active').length,
    activeComplaints: complaints.filter(c => c.comp_status !== 'Resolved').length,
    callLogs: callLogs.length,
    pmReports: pmReports.length,
    criticalComplaints: complaints.filter(c => c.priority === 'Critical').length,
    resolutionRate: complaints.length > 0 
  ? Math.round((complaints.filter(c => c.comp_status === 'Resolved').length / complaints.length) * 100)
  : 0,
  };

  const recentComplaints = complaints.slice(0, 5);
  const recentCallLogs = callLogs.slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Here's your system overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Assets"
          value={stats.totalAssets}
          icon={Package}
          color="bg-blue-600"
        />
        <StatCard
          title="Active Complaints"
          value={stats.activeComplaints}
          icon={AlertTriangle}
          color="bg-red-600"
        />
        <StatCard
          title="Call Logs"
          value={stats.callLogs}
          icon={Phone}
          color="bg-green-600"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Status</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stats.activeAssets}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Under Repair</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {stats.assetsUnderRepair}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: stats.totalAssets ? `${(stats.activeAssets / stats.totalAssets) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complaint Priority</h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Critical</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {stats.criticalComplaints}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {complaints.filter(c => c.priority === 'High').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Medium</span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {complaints.filter(c => c.priority === 'Medium').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resolution Rate</h3>
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolutionRate}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This month</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.resolutionRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Complaints</h3>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentComplaints.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No complaints yet</p>
            ) : (
              recentComplaints.map((complaint) => (
                <div key={complaint.comp_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {complaint.asset_name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {complaint.reported_by}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      complaint.comp_status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      complaint.comp_status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {complaint.comp_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Call Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Call Logs</h3>
            <Phone className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentCallLogs.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No call logs yet</p>
            ) : (
              recentCallLogs.map((call: CallLog) => (
                <div key={call.call_id || call.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {call.contact_person || call.contactPerson}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {call.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      call.status === 'Closed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      call.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
