import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AssetManagement from './pages/AssetManagement';
import ComplaintManagement from './pages/ComplaintManagement';
import CallLogging from './pages/CallLogging';
import PMReportUpload from './pages/PMReportUpload';
import Reports from './pages/Reports';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assets" element={<AssetManagement />} />
                <Route path="/complaints" element={<ComplaintManagement />} />
                <Route path="/calls" element={<CallLogging />} />
                <Route path="/reports-upload" element={<PMReportUpload />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <AppRoutes />
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                theme="colored"
                aria-label="Notification Toasts"
              />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}


  


export default App;