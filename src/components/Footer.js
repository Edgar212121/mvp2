// src/components/Footer.js
import React, { useState } from 'react';
import { Shield, Building, Globe } from 'lucide-react';
import AboutModal from './modals/AboutModal';
import LegalModal from './modals/LegalModal';
import PrivacyModal from './modals/PrivacyModal';
import TermsModal from './modals/TermsModal';
import DataRetentionModal from './modals/DataRetentionModal';

const Footer = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showDataRetentionModal, setShowDataRetentionModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">VERINEX IDENTITY</span>
              </div>
              <p className="text-gray-300 mb-4">
                Privacy-first identity verification platform. We verify who you are without compromising your privacy. 
                Based in Singapore, operating globally with the highest security standards.
              </p>
              <p className="text-sm text-gray-400">
                © 2025 Verinex Identity Pte. Ltd. All rights reserved.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Verinex Identity Pte. Ltd. • Singapore
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => setShowAboutModal(true)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    About Us
                  </button>
                </li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal & Compliance</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    onClick={() => setShowLegalModal(true)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Legal Notice
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Privacy Policy & PDPA
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowDataRetentionModal(true)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Data Retention Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowTermsModal(true)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>🔒 Your privacy is our priority • Based in Singapore • PDPA Compliant</p>
              <p className="mt-2">
                No CRS/FATCA participation • Data Protection Officer: <a href="mailto:dpo@verinex.sg" className="text-blue-400 hover:underline">dpo@verinex.sg</a>
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <span className="sr-only">LinkedIn</span>
                <Building className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <span className="sr-only">Twitter</span>
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
      {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
      {showDataRetentionModal && <DataRetentionModal onClose={() => setShowDataRetentionModal(false)} />}
    </>
  );
};

export default Footer;
