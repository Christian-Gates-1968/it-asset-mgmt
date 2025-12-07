import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Phone, 
  FileText, 
  BarChart3,
  Monitor
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/assets', icon: Package, label: 'Asset Management' },
    { to: '/complaints', icon: AlertTriangle, label: 'Complaints' },
    { to: '/calls', icon: Phone, label: 'Call Logs' },
    { to: '/reports-upload', icon: FileText, label: 'PM Reports' },
    { to: '/reports', icon: BarChart3, label: 'Analytics' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
    
          <div>
          <img style={{ width: "200px", height: "90px" }} src="src\IOCL LOGO.jpg" alt="IOCL LOGO" />
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;