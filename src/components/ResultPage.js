// src/components/ResultPage.js
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Mail, Bell } from 'lucide-react';

const ResultPage = ({
  verificationResult,
  csvData,
  xkardData,
  setCurrentView,
  setFormData
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Clock className="h-20 w-20 text-blue-500 mx-auto mb-4" />
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Pre-verification Complete!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Your documents have been received and are being reviewed by our verification team.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-blue-900 font-semibold text-lg">
              You will receive a response within 24 hours
            </p>
          </div>
        </div>

        {/* Pre-verification Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pre-verification Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference Number:</span>
              <span className="font-mono text-sm">{verificationResult?.token}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <Clock className="h-3 w-3 mr-1" />
                Pre-verified
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Response:</span>
              <span className="font-medium">Within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Notification Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Bell className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 mb-2">How you'll be notified:</p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email notification to your registered email
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verification approved with your unique token
                </li>
                <li className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Additional information request if needed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-2">What happens next?</h4>
          <ol className="list-decimal list-inside text-sm text-green-800 space-y-1">
            <li>Our verification team will review your documents</li>
            <li>We'll verify your identity against our security protocols</li>
            <li>You'll receive an email with the final verification result</li>
            <li>If approved, you can proceed with your intended service</li>
          </ol>
        </div>

        {/* Keep your reference number notice */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-700 text-sm">
            <strong>Important:</strong> Please save your reference number <br/>
            <code className="bg-white px-2 py-1 rounded text-blue-600 font-mono text-xs">
              {verificationResult?.token}
            </code>
          </p>
        </div>

        {/* CSV Data Display for Xkard */}
        {csvData && xkardData.isFromXkard && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="font-semibold text-purple-900 mb-2">Xkard Integration</p>
            <p className="text-sm text-purple-700">
              Your pre-verification data has been saved. Xkard will be notified once the review is complete.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {xkardData.isFromXkard ? (
            <button
              onClick={() => {
                // Return to Xkard with pre-verification token
                const returnUrl = `https://xkard.com/verification-pending?token=${verificationResult?.token}&status=preverified`;
                alert(`You will be redirected to Xkard. Your verification is pending review.`);
                // In production: window.location.href = returnUrl;
              }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Return to Xkard
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;