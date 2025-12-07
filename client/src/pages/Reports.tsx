import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext'; 

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, CheckCircle, Clock, Target
} from 'lucide-react';

interface Asset {
  asset_id: number;
  asset_name: string;
  category: string;
  status: string;
}

  export default function Analytics() {
  const { user } = useAuth();
  const { dataVersion } = useData();
  
  const [complaints, setComplaints] = useState<any[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  
  // Calculate performance data from real complaints (only show engineers with assigned complaints)
  const performanceData = engineers
    .map(eng => {
      const assignedComplaints = complaints.filter(c => c.eng_assigned === eng.user_id);
      const resolved = assignedComplaints.filter(c => c.comp_status === 'Resolved').length;
      const pending = assignedComplaints.filter(c => c.comp_status !== 'Resolved').length;
      const total = assignedComplaints.length;
      
      console.log(`Engineer ${eng.username} (ID: ${eng.user_id}):`, {
        assignedComplaints: assignedComplaints.length,
        resolved,
        pending,
        total
      });
      
      return {
        name: eng.username,
        resolved,
        pending,
        total
      };
    })
    .filter(eng => eng.total > 0); // Only show engineers who have assigned complaints
  
  console.log('Performance Data:', performanceData);
  console.log('Total Complaints:', complaints.length);
  console.log('Sample Complaints with eng_assigned:', complaints.map(c => ({
    comp_id: c.comp_id,
    eng_assigned: c.eng_assigned,
    comp_status: c.comp_status,
    asset_name: c.asset_name
  })));
    // Calculate monthly trends from last 7 months
  const monthlyTrends = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (6 - i));
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthComplaints = complaints.filter(c => 
      c.creation_time?.startsWith(monthYear)
    );
    const monthCalls = callLogs.filter(c => 
      c.created_at?.startsWith(monthYear)
    );
    
    return {
      month: monthName,
      complaints: monthComplaints.length,
      resolved: monthComplaints.filter(c => c.comp_status === 'Resolved').length,
      calls: monthCalls.length
    };
  });

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];
 const [assets, setAssets] = useState<any[]>([]);

const [categoryCounts, setCategoryCounts] = useState<{ category: string, count: number }[]>([]);

  const categoryDistribution = categoryCounts.map((cat, index) => ({
    name: cat.category,
    value: cat.count,
    color: colors[index % colors.length]
  }));

  
 useEffect(() => {
  const fetchAssets = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assets');
      setAssets(res.data);

      // Group assets by category
      const counts: { [key: string]: number } = {};
      res.data.forEach((asset: any) => {
        const cat = asset.category || 'Other';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      const categoryData = Object.keys(counts).map(key => ({
        category: key,
        count: counts[key],
      }));

      setCategoryCounts(categoryData);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  fetchAssets();
}, []);
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const params = new URLSearchParams();
        if (user?.role) params.append('user_role', user.role);
        if (user?.dept_id) params.append('dept_id', user.dept_id.toString());
        const queryString = params.toString();
        
        const [complaintsRes, callLogsRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/complaints?${queryString}`),
          axios.get('http://localhost:5000/api/call-logs'),
          axios.get('http://localhost:5000/api/users')
        ]);
                setComplaints(complaintsRes.data);
        setCallLogs(callLogsRes.data);
        setEngineers(usersRes.data.filter((u: any) => u.user_role === 'Engineer'));
        
        console.log('Complaints:', complaintsRes.data);
        console.log('Engineers:', usersRes.data.filter((u: any) => u.user_role === 'Engineer'));
        
        setComplaints(complaintsRes.data);
        setCallLogs(callLogsRes.data);
        // Filter only engineers
        setEngineers(usersRes.data.filter((u: any) => u.user_role === 'Engineer'));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, [dataVersion, user]);
  

 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const [statusData, setStatusData] = useState<{ status: string, count: number }[]>([]);


const handleBarClick = (category: string) => {
  setSelectedCategory(category);

  // Filter assets of this category
  const filtered = assets.filter(a => a.category === category);

  // Count statuses
  const statusCounts: { [key: string]: number } = {};
  filtered.forEach(a => {
    const status = a.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Convert to array for chart
  const data = Object.keys(statusCounts).map(key => ({
    status: key,
    count: statusCounts[key],
  }));

  setStatusData(data);
};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Performance insights and engineer analytics</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="complaints" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assets by Category Chart */}
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assets by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={categoryCounts}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis type="number" stroke="#9ca3af" />
      <YAxis dataKey="category" type="category" stroke="#9ca3af" />
      <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
      <Bar
     dataKey="count"
      fill="#3B82F6"
      animationDuration={1500}
      onClick={(data, index) => handleBarClick(categoryCounts[index].category)}
     cursor="pointer"
     />
     </BarChart>
        </ResponsiveContainer>
       </div>
        {/* Status Chart */}
      {selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Status breakdown for {selectedCategory}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={statusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="status" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="count" animationDuration={1500}>
                {statusData.map((entry, index) => {
                  let color = '#3B82F6'; // Default blue
                  if (entry.status.toLowerCase() === 'active') {
                    color = '#10B981'; // Green
                  } else if (entry.status.toLowerCase() === 'in repair') {
                    color = '#FF0000'; // Red
                  }
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Clear Selection
          </button>
        </div>
      )}
      
       </div>

      {/* Engineer Performance and Response Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engineer Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Engineer Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="resolved" fill="#10B981" />
              <Bar dataKey="pending" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
       

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Complaint Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} labelStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
      </div>

      {/* Engineer Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Engineer Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engineer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resolved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {performanceData.map((engineer, index) => {
                const total = engineer.resolved + engineer.pending;
                const resolutionRate = total > 0 ? ((engineer.resolved / total) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {engineer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{engineer.resolved}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{engineer.pending}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{resolutionRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
