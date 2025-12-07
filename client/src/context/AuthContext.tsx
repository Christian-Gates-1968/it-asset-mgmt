import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'Admin' | 'Engineer') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username: string, password: string, role: 'Admin' | 'Engineer'): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const user: User = {
        id: data.user.user_id.toString(), 
        username: data.user.username,
        role: data.user.user_role,
        name: data.user.username, // Use actual username instead of hardcoded value
        email: `${data.user.username}@company.com`,
        dept_id: data.user.dept_id
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } else {
      console.error('Login failed:', data.message);
      return false;
    }
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
