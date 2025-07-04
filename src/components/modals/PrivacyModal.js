import React from 'react';
import { XCircle } from 'lucide-react';

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">Privacy Policy & PDPA Compliance</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Privacy Policy</h4>
            <p className="text-gray-700 mb-4">
              At Verinex Identity, we take your privacy seriously. This policy explains how we handle data during the 
              verification process:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>We only collect necessary data: document, selfie, and timestamp.</li>
              <li>We do not sell or share your data with third parties.</li>
              <li className="font-semibold">Verinex Identity does not transmit personal data to authorities or foreign governments. 
                  We operate from a jurisdiction that does not participate in CRS or FATCA information exchange agreements.</li>
              <li>Documents are retained only while you remain active on the platform that requested the verification.</li>
              <li>After your relationship ends or upon request, your files are deleted within 30 days.</li>
              <li>Verification results (without documents) are stored for up to 5 years.</li>
              <li>Contact <a href="mailto:datos@verinex.sg" className="text-blue-600 hover:underline">datos@verinex.sg</a> to access, correct, or delete your data.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">PDPA Compliance (Singapore)</h4>
            <p className="text-gray-700 mb-4">
              Verinex Identity Pte. Ltd. complies with the Personal Data Protection Act (PDPA) of Singapore, ensuring 
              that personal data is managed responsibly, securely, and transparently.
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Personal data is collected only with the user's consent.</li>
              <li>Users are clearly informed about usage, storage, and retention periods.</li>
              <li>Consent may be revoked at any time by emailing <a href="mailto:datos@verinex.sg" className="text-blue-600 hover:underline">datos@verinex.sg</a></li>
              <li>Technical safeguards are in place, such as encryption, access restriction, and auto-deletion systems.</li>
            </ul>
            
            <div className="bg-gray-100 rounded-lg p-4 mt-4">
              <p className="font-semibold text-gray-900">Data Protection Officer (DPO)</p>
              <p className="text-gray-700">Role: Data Protection Officer (DPO)</p>
              <p className="text-gray-700">Contact: <a href="mailto:dpo@verinex.sg" className="text-blue-600 hover:underline">dpo@verinex.sg</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;