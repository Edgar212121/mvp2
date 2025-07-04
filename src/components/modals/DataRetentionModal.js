import React from 'react';
import { XCircle } from 'lucide-react';

const DataRetentionModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Data Retention Policy</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Documents and selfies uploaded by users are stored only as long as the user maintains an active 
                relationship with the requesting platform.</li>
            <li>Once the user is no longer active or requests deletion, documents are deleted within 30 days.</li>
            <li>Verification records (without documents) are encrypted and stored for 5 years for audit purposes.</li>
          </ul>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
            <p className="text-gray-700 font-semibold">
              Your privacy is our commitment. All data deletion is irreversible and permanent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetentionModal;
