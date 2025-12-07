import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();


  const [role, setRole] = useState<'Admin' | 'Engineer'>('Engineer');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flip, setFlip] = useState(false); // 👈 state to trigger flip


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
  const success = await login(formData.username, formData.password, role); // ✅ use context login
  if (success) {
    navigate('/dashboard'); // ✅ now will redirect correctly
  } else {
    setError('Invalid credentials. Please try again.');
  }
} catch (err) {
  console.error('Login error:', err);
  setError('Something went wrong. Please try again.');
} finally {
  setIsLoading(false);
}

  };

  // Flip trigger
  const handleRoleChange = (newRole: 'Admin' | 'Engineer') => {
    if (role !== newRole) {
      setFlip(true);
      setTimeout(() => {
        setRole(newRole);
        setFlip(false);
      }, 150); // Match duration
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url('/refinery.png')` }}
    >
      {/* Left Logo */}
      <div className="absolute top-5 left-3 hidden md:flex flex-col items-center">
        <img src="/iocl_logo.png" alt="IOCL" className="w-24 md:w-32 mb-2" />
      </div>

      {/* FLIP container */}
      <div
        className={`transform transition-transform duration-500 perspective-1000 ${
          flip ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Login Card */}
        <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30 text-white transform transition-transform duration-500"
          style={{
            backfaceVisibility: 'hidden',
            transform: flip ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <h2 className="text-4xl font-bold font-young text-center mb-6 tracking-wider">LOGIN</h2>

          {/* Role Toggle */}
          <div className="flex justify-center mb-6 relative w-fit mx-auto rounded-full bg-white p-1">
            <div
              className={`absolute top-0.5 left-1 h-8 w-24 rounded-full bg-gradient-to-r from-orange-500 to-blue-800 transition-transform duration-300 ${
                role === 'Admin' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ zIndex: 0 }}
            />
            <button
              type="button"
              onClick={() => handleRoleChange('Admin')}
              className={`relative z-10 w-24 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${
                role === 'Admin' ? 'text-white' : 'text-orange-600'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('Engineer')}
              className={`relative z-10 w-24 py-1 text-sm font-semibold rounded-full transition-all duration-300 ${
                role === 'Engineer' ? 'text-white' : 'text-blue-800'
              }`}
            >
              Engineer
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 rounded-lg bg-white/70 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <p className="text-red-200 bg-red-500/20 p-2 rounded text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
