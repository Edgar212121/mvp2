import React from 'react';
import { XCircle } from 'lucide-react';

const TermsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Terms of Service</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Verinex Identity provides document verification services to third-party platforms on request.</li>
            <li>Users voluntarily upload their documents to be verified according to the platform's requirements.</li>
            <li>Verinex does not share data with any other entity nor use it for any purpose other than the verification process.</li>
            <li>Verinex may reject a verification if fraud or document tampering is suspected.</li>
            <li>Verification results are shared only with the contracting platform. Users can contact 
                <a href="mailto:datos@verinex.sg" className="text-blue-600 hover:underline mx-1">datos@verinex.sg</a> 
                to exercise their rights.</li>
            <li>We reserve the right to update these terms without prior notice. The current version will always be available on the website.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;