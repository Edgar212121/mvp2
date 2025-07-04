import React from 'react';
import { XCircle } from 'lucide-react';

const LegalModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Legal Notice</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-700"><strong>Website owner:</strong> Verinex Identity Pte. Ltd.</p>
            <p className="text-gray-700"><strong>Jurisdiction:</strong> Singapore</p>
            <p className="text-gray-700"><strong>Activity:</strong> Document and digital identity verification services for third parties.</p>
          </div>
          
          <p className="text-gray-700">
            Use of this website implies acceptance of the terms and conditions stated herein. Verinex Identity acts 
            as an independent external provider, without involvement in the operations of the platforms that 
            contract us.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-gray-700 font-semibold">
              We do not store or process funds. We do not provide financial services and therefore, we are not 
              subject to financial supervision nor obligated to share financial information with third parties or 
              foreign governments.
            </p>
          </div>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-gray-700 font-semibold">
              Verinex Identity does not participate in CRS (Common Reporting Standard) or FATCA (Foreign 
              Account Tax Compliance Act), as our corporate purpose does not require it and our jurisdiction is 
              not mandated to enforce such regimes.
            </p>
          </div>
          
          <p className="text-gray-700">
            Any information provided is strictly limited to technical identity verification tasks upon request.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;