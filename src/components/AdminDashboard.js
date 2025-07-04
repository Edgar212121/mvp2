// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Shield, FileText, Clock, CheckCircle, XCircle, Building, RefreshCw, Eye, X, Phone, User, FileImage, Camera } from 'lucide-react';

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
  const [selectedUser, setSelectedUser] = useState(null); // Para el modal de detalles
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Auto-refresh cada 3 segundos si está activado
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshVerifications(true); // true = silent refresh
    }, 3000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, verificationsList.length]);
  
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

  // Abrir modal con detalles del usuario
  const openUserDetails = (verification) => {
    setSelectedUser(verification);
    setShowUserModal(true);
  };

  // Cerrar modal
  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
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
    
    // Update selected user if modal is open
    if (selectedUser && selectedUser.id === id) {
      const updatedUser = updatedList.find(v => v.id === id);
      setSelectedUser(updatedUser);
    }
    
    // Show alert
    alert(`Verification ${newStatus} successfully${reason ? '. Reason: ' + reason : ''}`);
  };
  
  // Logout
  const handleLogout = () => {
    window.location.href = '/';
  };

  // Modal de detalles del usuario
  const UserDetailsModal = () => {
    if (!showUserModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          {/* Header del modal */}
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">User Details - {selectedUser.nombre}</h3>
            <button
              onClick={closeUserModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-6">
            {/* Información personal */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{selectedUser.nombre}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone:
                  </span>
                  <p className="text-gray-900">{selectedUser.telefono || 'Not provided'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Document Type:</span>
                  <p className="text-gray-900 capitalize">{selectedUser.tipoDocumento || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submission Date:</span>
                  <p className="text-gray-900">{new Date(selectedUser.fecha).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Estados y confianza */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Pre-Analysis:</span>
                  <p className={`font-medium ${
                    selectedUser.estadoInterno === 'approved' ? 'text-green-600' :
                    selectedUser.estadoInterno === 'rejected' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {selectedUser.estadoInterno === 'approved' ? 'Passed' : 
                     selectedUser.estadoInterno === 'rejected' ? 'Failed' : 'Needs Review'}
                  </p>
                  <p className="text-sm text-gray-600">Confidence: {selectedUser.confianza}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Review Status:</span>
                  <p className={`font-medium ${
                    selectedUser.estadoRevision === 'Pending Review' ? 'text-yellow-600' :
                    selectedUser.estadoRevision === 'Approved' ? 'text-green-600' :
                    selectedUser.estadoRevision === 'Rejected' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {selectedUser.estadoRevision}
                  </p>
                  {selectedUser.fechaRevision && (
                    <p className="text-sm text-gray-600">
                      Reviewed: {new Date(selectedUser.fechaRevision).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-gray-700">Client Source:</span>
                  <p className="font-medium">
                    {selectedUser.esDeXkard ? (
                      <span className="text-purple-600">Xkard Integration</span>
                    ) : (
                      <span className="text-gray-600">Direct Submission</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Token: {selectedUser.token}</p>
                </div>
              </div>
            </div>

            {/* Imágenes de documentos */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileImage className="h-5 w-5 mr-2" />
                Document Images
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Imagen frontal del documento */}
                {selectedUser.imagenDocumentoFrontal && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">
                      {selectedUser.tipoDocumento === 'passport' ? 'Passport Page' : 'Document Front'}
                    </h5>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedUser.imagenDocumentoFrontal}
                        alt="Document Front"
                        className="w-full h-48 object-contain bg-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden p-4 text-center text-gray-500">
                        <FileImage className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Image not available</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Imagen trasera del documento (solo si no es pasaporte) */}
                {selectedUser.imagenDocumentoTrasera && selectedUser.tipoDocumento !== 'passport' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Document Back</h5>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={selectedUser.imagenDocumentoTrasera}
                        alt="Document Back"
                        className="w-full h-48 object-contain bg-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden p-4 text-center text-gray-500">
                        <FileImage className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>Image not available</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Selfie */}
            {selectedUser.imagenSelfie && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Selfie Photo
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg max-w-md">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedUser.imagenSelfie}
                      alt="User Selfie"
                      className="w-full h-64 object-contain bg-white"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden p-4 text-center text-gray-500">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>Selfie not available</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Motivo de rechazo si existe */}
            {selectedUser.motivoRechazo && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-red-700 mb-2">Rejection Reason</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{selectedUser.motivoRechazo}</p>
                </div>
              </div>
            )}

            {/* Acciones */}
            {selectedUser.estadoRevision === 'Pending Review' && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const confirmApprove = window.confirm('Approve this verification?');
                      if (confirmApprove) {
                        updateVerificationStatus(selectedUser.id, 'Approved');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason or missing information:');
                      if (reason) {
                        updateVerificationStatus(selectedUser.id, 'Rejected', reason);
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      const info = prompt('What additional information is needed?');
                      if (info) {
                        updateVerificationStatus(selectedUser.id, 'Information Required', info);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Info
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                    Phone
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.telefono || 'Not provided'}
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
                      <div className="flex space-x-2">
                        {/* Botón para ver detalles */}
                        <button
                          onClick={() => openUserDetails(verification)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        
                        {verification.estadoRevision === 'Pending Review' && (
                          <>
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
                          </>
                        )}
                        {verification.estadoRevision !== 'Pending Review' && (
                          <span className="text-gray-500 text-xs">
                            Reviewed on {new Date(verification.fechaRevision).toLocaleDateString()}
                          </span>
                        )}
                      </div>
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
        
        {/* Modal de detalles del usuario */}
        <UserDetailsModal />
      </div>
    </div>
  );
};

export default AdminDashboard;