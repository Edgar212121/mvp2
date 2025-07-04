// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, CheckCircle, XCircle, Building, RefreshCw } from 'lucide-react';

const AdminDashboard = ({
  verificationsList,
  setVerificationsList,
  loadSavedVerifications
}) => {
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientFilter, setClientFilter] = useState('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Auto-refresh cada 3 segundos si está activado
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshVerifications(true); // true = silent refresh
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, verificationsList.length]); // Agregar verificationsList.length como dependencia
  
  // Listen for custom events
  useEffect(() => {
    const handleVerificationsUpdated = (e) => {
      console.log('📨 Custom event received: verificationsUpdated', e.detail);
      refreshVerifications(true);
    };
    
    window.addEventListener('verificationsUpdated', handleVerificationsUpdated);
    return () => window.removeEventListener('verificationsUpdated', handleVerificationsUpdated);
  }, []);
  
  // Refresh verifications from localStorage
  const refreshVerifications = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    
    try {
      const saved = localStorage.getItem('verinex_verifications');
      if (saved) {
        const parsedVerifications = JSON.parse(saved);
        const currentCount = verificationsList.length;
        const newCount = parsedVerifications.length;
        
        // Solo actualizar si hay cambios
        if (newCount !== currentCount || JSON.stringify(parsedVerifications) !== JSON.stringify(verificationsList)) {
          setVerificationsList(parsedVerifications);
          setLastRefresh(new Date());
          
          if (!silent) {
            if (newCount > currentCount) {
              alert(`Found ${newCount - currentCount} new verification(s)! Total: ${newCount}`);
            } else {
              alert(`Refreshed! Total verifications: ${newCount}`);
            }
          } else if (newCount > currentCount) {
            console.log(`🔄 Auto-refresh: Found ${newCount - currentCount} new verification(s)`);
          }
        } else if (!silent) {
          alert('No new verifications found');
        }
      } else if (!silent) {
        alert('No saved verifications found');
      }
    } catch (error) {
      console.error('Error refreshing verifications:', error);
      if (!silent) {
        alert('Error refreshing verifications');
      }
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };
  
  // Filter verifications
  const filteredVerifications = verificationsList.filter(v => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && v.estadoRevision === 'Pending Review') ||
      (filter === 'approved' && v.estadoRevision === 'Approved') ||
      (filter === 'rejected' && v.estadoRevision === 'Rejected');
    
    const verificationDate = new Date(v.fecha).toISOString().split('T')[0];
    const matchesDate = verificationDate === selectedDate;
    
    const matchesClient = clientFilter === 'all' ||
      (clientFilter === 'xkard' && v.esDeXkard) ||
      (clientFilter === 'direct' && !v.esDeXkard);
    
    return matchesFilter && matchesDate && matchesClient;
  });
  
  // Statistics
  const stats = {
    total: verificationsList.length,
    pending: verificationsList.filter(v => v.estadoRevision === 'Pending Review').length,
    approved: verificationsList.filter(v => v.estadoRevision === 'Approved').length,
    rejected: verificationsList.filter(v => v.estadoRevision === 'Rejected').length,
    xkard: verificationsList.filter(v => v.esDeXkard).length
  };
  
  // Update verification status
  const updateVerificationStatus = (id, newStatus, reason = '') => {
    const updatedList = verificationsList.map(v => {
      if (v.id === id) {
        return {
          ...v,
          estadoRevision: newStatus,
          motivoRechazo: reason,
          fechaRevision: new Date().toISOString()
        };
      }
      return v;
    });
    
    setVerificationsList(updatedList);
    
    // Save to localStorage
    try {
      localStorage.setItem('verinex_verifications', JSON.stringify(updatedList));
      console.log('✅ Status update saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving status update:', error);
    }
    
    // Show alert
    alert(`Verification ${newStatus} successfully${reason ? '. Reason: ' + reason : ''}`);
  };
  
  // Logout
  const handleLogout = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-2xl font-bold text-gray-900">VERINEX ADMIN</span>
                <p className="text-sm text-gray-500">KYC Administration Panel</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 items-center">
              {/* Auto-refresh toggle */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-600">Auto-refresh</span>
                {autoRefresh && (
                  <span className="text-xs text-green-600 animate-pulse">
                    (every 3s)
                  </span>
                )}
              </label>
              
              {/* Last refresh indicator */}
              <span className="text-xs text-gray-500">
                Last: {lastRefresh.toLocaleTimeString()}
              </span>
              
              {/* Manual refresh button */}
              <button
                onClick={() => refreshVerifications(false)}
                disabled={isRefreshing}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isRefreshing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Now
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total KYCs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">From Xkard</p>
                <p className="text-3xl font-bold text-purple-600">{stats.xkard}</p>
              </div>
              <Building className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Client
              </label>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Clients</option>
                <option value="xkard">Xkard Only</option>
                <option value="direct">Direct Only</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Table */}
        {filteredVerifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pre-Analysis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVerifications.map((verification) => (
                  <tr key={verification.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(verification.fecha).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {verification.token}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.esDeXkard ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Xkard
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Direct
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        verification.estadoInterno === 'approved' ? 'bg-green-100 text-green-800' :
                        verification.estadoInterno === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {verification.estadoInterno === 'approved' ? 'Pass' : 
                         verification.estadoInterno === 'rejected' ? 'Fail' : 'Review'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({verification.confianza})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        verification.estadoRevision === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                        verification.estadoRevision === 'Approved' ? 'bg-green-100 text-green-800' :
                        verification.estadoRevision === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {verification.estadoRevision}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {verification.estadoRevision === 'Pending Review' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const confirmApprove = window.confirm('Approve this verification?');
                              if (confirmApprove) {
                                updateVerificationStatus(verification.id, 'Approved');
                                alert('User will be notified of approval via email');
                              }
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason or missing information:');
                              if (reason) {
                                updateVerificationStatus(verification.id, 'Rejected', reason);
                                alert('User will be notified via email with the reason');
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              const info = prompt('What additional information is needed?');
                              if (info) {
                                updateVerificationStatus(verification.id, 'Information Required', info);
                                alert('User will be notified to provide additional information');
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Request Info
                          </button>
                        </div>
                      )}
                      {verification.estadoRevision !== 'Pending Review' && (
                        <span className="text-gray-500 text-xs">
                          Reviewed on {new Date(verification.fechaRevision).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No verifications found with the selected filters</p>
            <button
              onClick={() => refreshVerifications(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh to check for new verifications
            </button>
          </div>
        )}
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono">
            <p>Total in state: {verificationsList.length}</p>
            <p>Showing: {filteredVerifications.length}</p>
            <p>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;