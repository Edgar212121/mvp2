// src/components/AdminLogin.js
import React from 'react';
import { Shield } from 'lucide-react';

const AdminLogin = ({
  adminPassword,
  setAdminPassword,
  setIsAdminAuthenticated,
  setCurrentView
}) => {
  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setCurrentView('admin');
      setAdminPassword('');
    } else {
      alert('Incorrect password. Use: admin123');
      setAdminPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-gray-600 mt-2">Verinex Administration Panel</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Administrator Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLogin(e);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter password"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              For demo use: admin123
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            Access Panel
          </button>
          
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full mt-3 text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;