// src/components/modals/AboutModal.js
import React from 'react';
import { XCircle } from 'lucide-react';

const AboutModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">About Us — VERINEX IDENTITY</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Verinex Identity was born out of a growing need for identity verification solutions that respect privacy 
            and data sovereignty. Founded by a team with experience in digital security and decentralized services, 
            Verinex was established with the mission to offer reliable document verification from jurisdictions that 
            do not participate in automatic information exchange agreements.
          </p>
          
          <p className="text-gray-700">
            Headquartered in Singapore with global reach, we are the silent partner working in the background to 
            validate identities discreetly, securely, and with technical excellence. Although our brand is recent, our 
            team has years of experience building the technology that now allows us to be one of the few providers 
            with full control of the process and no third-party dependencies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;