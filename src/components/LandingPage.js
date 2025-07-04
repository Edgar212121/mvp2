// src/components/LandingPage.js
import React from 'react';
import { Shield, Globe, Lock, AlertCircle, Building, TrendingUp, Loader } from 'lucide-react';
import Footer from './Footer';

const LandingPage = ({ 
  setCurrentView, 
  systemReady, 
  loadingProgress 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-300" />
              <span className="text-2xl font-bold text-white">VERINEX IDENTITY</span>
            </div>
            <button 
              onClick={() => setCurrentView('upload')}
              disabled={!systemReady}
              className={`px-6 py-2 rounded-lg transition-colors ${
                systemReady 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {systemReady ? 'Verify Identity' : 'Loading System...'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-bold text-white mb-6">
            Your identity, your rules.
          </h1>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            We verify who you are without sharing it with anyone.
          </p>
          
          {/* CTA Text */}
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto font-medium">
            <strong className="text-white">Verinex is designed for individuals who value privacy.</strong><br/>
            This is compliance — without compromise.
          </p>
          
          {!systemReady ? (
            <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-blue-300 mb-4">
                <Loader className="animate-spin" size={20} />
                <span className="font-semibold">Initializing Verification System</span>
              </div>
              <div className="w-full bg-blue-900/50 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('upload')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center space-x-2 mx-auto shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <Shield size={20} />
                <span>Start Verification</span>
              </button>
              
              {/* About Verinex Text */}
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">Who is Verinex Identity?</h3>
                  <p className="text-blue-100 leading-relaxed">
It is a privacy-first identity verification company built on the principle that compliance must not require surveillance or data sharing.
Founded by privacy and security subject matter experts, we deliver a unique solution that is 100% compliant, ensuring the data remains safe and unshared.
Our business is to keep your data safe without exception.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Privacy Features Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Minimal Data</h3>
              <p className="text-base text-blue-100 leading-relaxed">
                We only ask for what's essential: your ID and a selfie. Nothing more, ever.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Zero Knowledge</h3>
              <p className="text-base text-blue-100 leading-relaxed">
                We don’t need to share your data to comply with the current regulation.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Independent</h3>
              <p className="text-base text-blue-100 leading-relaxed">
                We’re not a bank or an institution forced to share your data under any regulation.
              </p>
            </div>
          </div>
          
          {/* No CRS/FATCA Banner */}
          <div className="mt-8 bg-amber-500/20 backdrop-blur-lg rounded-xl p-6 border border-amber-400/30">
            <div className="flex items-center justify-center space-x-4">
              <AlertCircle className="h-8 w-8 text-amber-300" />
              <div className="text-center">
                <p className="text-xl font-bold text-white mb-1">No third-party communication</p>
                <p className="text-amber-100">
                  Verinex Identity does not participate in automatic information exchange agreements. 
                  Your verification data is never shared with tax authorities or foreign governments.
                </p>
                 <p className="text-xl font-bold text-white mb-1">Fully compliant and ethical</p>
                <p className="text-amber-100">
                  Verinex identity checks users against AML, CFT, and others to avoid situations such as terrorism, weapon trade, and white slavery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Do you share my data with anyone?</h3>
              <p className="text-lg text-blue-100">
                No. No one will have access to your data
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">Why do I need to verify?</h3>
              <p className="text-lg text-blue-100">
                Because it grants access to exclusive financial tools, but we do it the Verinex way: fast, private, and irreversible once deleted.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3">How long do you keep my documents?</h3>
              <p className="text-lg text-blue-100">
                As long as your card is active, they’re still here. Once it’s gone, they’re gone forever.
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Enterprise Solutions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <Shield className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Complete KYC Verification</h3>
              <ul className="text-blue-100 space-y-2">
                <li>• Identity document verification</li>
                <li>• Facial biometric validation</li>
                <li>• International list checking</li>
                <li>• Address verification</li>
                <li>• Automated risk analysis</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <TrendingUp className="h-10 w-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">API Integration</h3>
              <ul className="text-blue-100 space-y-2">
                <li>• Enterprise integration API</li>
                <li>• Management and reporting dashboard</li>
                <li>• Automatic regulatory compliance</li>
                <li>• 24/7 specialized support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Industries We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'Fintech & Banking',
              'Cryptocurrencies & Blockchain', 
              'Insurance & Insurtech',
              'Real Estate & PropTech',
              'E-commerce & Marketplace',
              'Gaming & Entertainment',
              'Health & Telemedicine',
              'Education & EdTech'
            ].map((industry, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <Building className="h-6 w-6 text-blue-300 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LandingPage;