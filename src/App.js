  // src/App.js
  import React, { useState, useEffect } from 'react';
  import './App.css';
  import LandingPage from './components/LandingPage';
  import UploadPage from './components/UploadPage';
  import ResultPage from './components/ResultPage';
  import AdminLogin from './components/AdminLogin';
  import AdminDashboard from './components/AdminDashboard';

  function App() {
    // Capture URL parameters when coming from Xkard
    const urlParams = new URLSearchParams(window.location.search);
    const xkardUserId = urlParams.get('userId');
    const xkardEmail = urlParams.get('email');
    const xkardSessionId = urlParams.get('sessionId');
    const isRetry = urlParams.get('retry') === 'true';
    const previousToken = urlParams.get('previousToken');
    
    // Save these data in state
    const [xkardData] = useState({
      userId: xkardUserId,
      email: xkardEmail ? decodeURIComponent(xkardEmail) : null,
      sessionId: xkardSessionId,
      isFromXkard: !!(xkardUserId && xkardSessionId),
      isRetry: isRetry,
      previousToken: previousToken
    });

    // Check for admin route
    const pathname = window.location.pathname;
    const isAdminRoute = pathname === '/xk9-secure-2025' || pathname === '/dash-7j2m';

    // If coming from Xkard, go directly to form
    const [currentView, setCurrentView] = useState(
      isAdminRoute ? 'admin' : (xkardData.isFromXkard ? 'upload' : 'landing')
    );
    
    const [formData, setFormData] = useState({
      documentType: 'dni',
      userName: '',
      phoneNumber: '',
      documentImageFront: null,
      documentImageBack: null,
      selfieImage: null
    });
    
    const [verificationResult, setVerificationResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [processingDetails, setProcessingDetails] = useState({});
    const [systemReady, setSystemReady] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [csvData, setCsvData] = useState(null);
    const [adminView, setAdminView] = useState(isAdminRoute);
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [verificationsList, setVerificationsList] = useState([]);

    // Initialize verification system and load saved verifications
    useEffect(() => {
      initializeSystem();
      loadSavedVerifications();
    }, []);

    // Load saved verifications from localStorage
    const loadSavedVerifications = () => {
      try {
        const saved = localStorage.getItem('verinex_verifications');
        if (saved) {
          const parsedVerifications = JSON.parse(saved);
          setVerificationsList(parsedVerifications);
          console.log('Loaded verifications:', parsedVerifications.length);
        }
      } catch (error) {
        console.error('Error loading saved verifications:', error);
        setVerificationsList([]);
      }
    };

    // Save verifications to localStorage whenever they change
    useEffect(() => {
      if (verificationsList.length > 0) {
        try {
          localStorage.setItem('verinex_verifications', JSON.stringify(verificationsList));
          console.log('Saved verifications:', verificationsList.length);
        } catch (error) {
          console.error('Error saving verifications:', error);
        }
      }
    }, [verificationsList]);

    const initializeSystem = async () => {
      try {
        setLoadingProgress(10);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingProgress(50);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoadingProgress(100);
        setSystemReady(true);
      } catch (error) {
        console.error('Error initializing system:', error);
      }
    };

    // Props object to pass to components
    const sharedProps = {
      // State
      currentView,
      setCurrentView,
      formData,
      setFormData,
      verificationResult,
      setVerificationResult,
      isProcessing,
      setIsProcessing,
      processingStep,
      setProcessingStep,
      processingDetails,
      setProcessingDetails,
      systemReady,
      loadingProgress,
      csvData,
      setCsvData,
      adminView,
      setAdminView,
      adminPassword,
      setAdminPassword,
      isAdminAuthenticated,
      setIsAdminAuthenticated,
      verificationsList,
      setVerificationsList,
      xkardData
    };

    // Main render logic
    if (adminView && !isAdminAuthenticated) {
      return <AdminLogin {...sharedProps} />;
    }

    if (adminView && isAdminAuthenticated && currentView === 'admin') {
      return <AdminDashboard {...sharedProps} />;
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage {...sharedProps} />;
      case 'upload':
        return <UploadPage {...sharedProps} />;
      case 'result':
        return <ResultPage {...sharedProps} />;
      default:
        return <LandingPage {...sharedProps} />;
    }
  }

  export default App;