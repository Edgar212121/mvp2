// src/components/UploadPage.js
import React, { useRef } from 'react';
import { Shield, FileText, Upload, Camera, CheckCircle, Loader, Building } from 'lucide-react';
import { handleVerification } from '../utils/verification';

const UploadPage = ({ 
  setCurrentView,
  xkardData,
  formData,
  setFormData,
  isProcessing,
  setIsProcessing,
  processingStep,
  setProcessingStep,
  setProcessingDetails,
  systemReady,
  setVerificationResult,
  verificationsList,
  setVerificationsList,
  setCsvData
}) => {
  const documentInputRef = useRef(null);
  const documentBackInputRef = useRef(null);
  const selfieInputRef = useRef(null);

  const handleFileSelect = (type, file) => {
    if (!file) return;

    const maxSize = type === 'documentImageFront' || type === 'documentImageBack' ? 15 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File too large. Maximum size: ${type.includes('document') ? '15MB' : '10MB'}`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid format. Allowed formats: JPG, PNG, WEBP');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < 300 || img.height < 300) {
        alert('Image too small. Minimum resolution: 300x300 pixels');
        return;
      }
      
      setFormData(prev => ({ ...prev, [type]: file }));
      console.log(`✅ File selected for ${type}:`, file.name);
    };
    img.src = URL.createObjectURL(file);
  };

  const onVerificationClick = () => {
    console.log('🚀 Verification button clicked');
    console.log('Props being passed to handleVerification:', {
      hasVerificationsList: !!verificationsList,
      verificationsListLength: verificationsList?.length,
      hasSetVerificationsList: !!setVerificationsList,
      typeOfSetVerificationsList: typeof setVerificationsList,
      formData: {
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        documentType: formData.documentType,
        hasDocumentFront: !!formData.documentImageFront,
        hasDocumentBack: !!formData.documentImageBack,
        hasSelfie: !!formData.selfieImage
      }
    });
    
    handleVerification({
      formData,
      systemReady,
      setIsProcessing,
      setProcessingStep,
      setProcessingDetails,
      setVerificationResult,
      setCurrentView,
      xkardData,
      verificationsList,
      setVerificationsList,
      setCsvData
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VERINEX IDENTITY</span>
            </div>
            <button 
              onClick={() => {
                if (xkardData.isFromXkard) return;
                window.location.href = '/';
              }} 
              className={`text-gray-600 hover:text-gray-900 ${xkardData.isFromXkard ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={xkardData.isFromXkard}
            >
              {xkardData.isFromXkard ? 'Verification for Xkard' : '← Back to Home'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Show Xkard info if coming from Xkard */}
        {xkardData.isFromXkard && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Building className="h-5 w-5 text-purple-600 mt-0.5 mr-2" />
              <div className="text-sm">
                <p className="font-semibold text-purple-900">Xkard Integration</p>
                <p className="text-purple-700 mt-1">
                  Session: {xkardData.sessionId} 
                  {xkardData.email && ` • ${xkardData.email}`}
                </p>
                {xkardData.isRetry && (
                  <p className="text-orange-600 mt-1">
                    ⚠️ This is a retry attempt. Previous token: {xkardData.previousToken}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Identity Verification</h2>

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
              <p>Verifications in state: {verificationsList?.length || 0}</p>
              <p>System ready: {systemReady ? 'Yes' : 'No'}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name as it appears on your document"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Include country code (e.g., +34 612345678)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please include your country code at the beginning
              </p>
            </div>
          </div>

          {/* Document Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Type</h3>
            <div className="grid grid-cols-3 gap-4">
              {['dni', 'passport', 'residency'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, documentType: type }));
                    console.log('📄 Document type selected:', type);
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.documentType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm font-medium">
                    {type === 'dni' ? 'DNI' : type === 'passport' ? 'Passport' : 'Residency Card'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Document Upload */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            {/* Front Side */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.documentType === 'passport' ? 'Passport Page' : 'Front Side'} <span className="text-red-500">*</span>
              </label>
              <div
                onClick={() => documentInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  formData.documentImageFront
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {formData.documentImageFront ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                    <span className="text-green-700">
                      {formData.documentImageFront.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Click to upload {formData.documentType === 'passport' ? 'passport page' : 'front side'}
                    </p>
                  </>
                )}
              </div>
              <input
                ref={documentInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect('documentImageFront', e.target.files?.[0])}
                className="hidden"
              />
            </div>

            {/* Back Side (not for passport) */}
            {formData.documentType !== 'passport' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back Side <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => documentBackInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    formData.documentImageBack
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {formData.documentImageBack ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                      <span className="text-green-700">
                        {formData.documentImageBack.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload back side</p>
                    </>
                  )}
                </div>
                <input
                  ref={documentBackInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('documentImageBack', e.target.files?.[0])}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Selfie Upload */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Take a Selfie</h3>
            <div
              onClick={() => selfieInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                formData.selfieImage
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {formData.selfieImage ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                  <span className="text-green-700">{formData.selfieImage.name}</span>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload a selfie</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Make sure your face is clearly visible
                  </p>
                </>
              )}
            </div>
            <input
              ref={selfieInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect('selfieImage', e.target.files?.[0])}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={onVerificationClick}
            disabled={isProcessing || !systemReady}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              isProcessing || !systemReady
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin mr-2" size={20} />
                {processingStep}
              </div>
            ) : (
              'Verify Identity'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;