// src/utils/verification.js
import { 
  performDocumentVerification, 
  performBiometricVerification, 
  makeVerificationDecision 
} from './imageAnalysis';

// Save verification result in CSV format
export const saveVerificationResult = (result, formData, verificationsList) => {
  console.log('💾 saveVerificationResult called');
  console.log('Current list length:', verificationsList.length);
  
  // Create complete verification object
  const verification = {
    id: Date.now(),
    fecha: new Date().toISOString(),
    token: result.token,
    usuarioXkard: result.xkardUserId || 'N/A',
    email: result.xkardEmail || 'N/A',
    sessionId: result.xkardSessionId || 'N/A',
    nombre: formData.userName || 'No name',
    telefono: formData.phoneNumber,
    tipoDoc: formData.documentType,
    estado: result.status,
    estadoInterno: result.internalStatus || result.status,
    confianza: result.confidence + '%',
    nombreExtraido: result.details.document.extractedName || 'N/A',
    numDocumento: result.details.document.extractedDocumentNumber || 'N/A',
    coincidenciaBiometrica: result.details.biometric.matchPercentage + '%',
    observaciones: result.issues ? result.issues.join('; ') : 'No observations',
    estadoRevision: 'Pending Review',
    tiempoEstimadoRespuesta: '24 hours',
    fechaEstimadaRespuesta: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    esDeXkard: result.xkardUserId ? true : false
  };
  
  console.log('📋 New verification created:', verification);
  
  // Save to verifications list
  const updatedList = [...verificationsList, verification];
  
  console.log('📊 Updated list length:', updatedList.length);
  
  // Create CSV line
  const csvLine = [
    verification.fecha,
    verification.token,
    verification.usuarioXkard,
    verification.email,
    verification.sessionId,
    verification.nombre,
    verification.tipoDoc,
    verification.estado,
    verification.confianza,
    verification.nombreExtraido,
    verification.numDocumento,
    verification.coincidenciaBiometrica,
    verification.observaciones,
    verification.estadoRevision
  ].join(',');
  
  const csvData = {
    line: csvLine,
    displayData: {
      fecha: new Date().toLocaleString('en-US'),
      token: result.token,
      usuarioXkard: result.xkardUserId,
      email: result.xkardEmail,
      estado: result.status
    }
  };
  
  return { updatedList, csvData };
};

// Main verification function
export const handleVerification = async ({
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
}) => {
  console.log('🔵 Starting verification process...');
  console.log('Current verifications count:', verificationsList.length);
  console.log('XkardData:', xkardData);
  
  // Validate inputs
  if (!formData.userName.trim()) {
    alert('Please enter your full name');
    return;
  }
  
  if (!formData.phoneNumber.trim()) {
    alert('Please enter your phone number');
    return;
  }
  
  // Validate images according to document type
  if (formData.documentType === 'passport') {
    if (!formData.documentImageFront || !formData.selfieImage) {
      alert('Please upload passport image and your selfie');
      return;
    }
  } else {
    if (!formData.documentImageFront || !formData.documentImageBack || !formData.selfieImage) {
      alert('Please upload both sides of the document (front and back) and your selfie');
      return;
    }
  }

  if (!systemReady) {
    alert('The verification system is initializing. Please wait a moment...');
    return;
  }

  setIsProcessing(true);
  setProcessingStep('Starting verification process...');
  
  try {
    // Document analysis
    setProcessingStep('Verifying identity document...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const documentResult = await performDocumentVerification(formData.documentImageFront, formData, setProcessingStep);
    setProcessingDetails(prev => ({ ...prev, document: documentResult }));
    console.log('📄 Document verification complete');

    // Biometric verification
    const biometricResult = await performBiometricVerification(
      formData.documentImageFront, 
      formData.selfieImage, 
      formData,
      setProcessingStep
    );
    setProcessingDetails(prev => ({ ...prev, biometric: biometricResult }));
    console.log('🤳 Biometric verification complete');

    // Final decision
    setProcessingStep('Completing verification...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const decision = makeVerificationDecision(documentResult, biometricResult);
    
    const result = {
      token: `VER-${xkardData.isFromXkard ? 'XK' : 'DI'}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-PRE`,
      status: 'preverified',
      confidence: Math.round(decision.confidence * 100),
      processingTime: '6.3s',
      estimatedResponseTime: '24 hours',
      details: { document: documentResult, biometric: biometricResult },
      issues: decision.issues,
      internalStatus: decision.status,
      xkardUserId: xkardData.userId,
      xkardEmail: xkardData.email,
      xkardSessionId: xkardData.sessionId
    };
    
    console.log('🟢 Verification result created:', result);
    
    // Save result
    const { updatedList, csvData } = saveVerificationResult(result, formData, verificationsList);
    
    console.log('🟡 Updating verifications list...');
    console.log('Before update - State length:', verificationsList.length);
    console.log('After update - New length:', updatedList.length);
    
    // IMPORTANTE: Actualizar el estado con la nueva lista
    setVerificationsList(updatedList);
    
    // También guardar directamente en localStorage como respaldo
    try {
      localStorage.setItem('verinex_verifications', JSON.stringify(updatedList));
      console.log('✅ Saved directly to localStorage');
      
      // Verificar que se guardó
      const saved = localStorage.getItem('verinex_verifications');
      const parsed = JSON.parse(saved);
      console.log('✅ Verified save - localStorage now has:', parsed.length, 'verifications');
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
    
    setCsvData(csvData);
    setVerificationResult(result);
    
    console.log('✅ Verification process complete!');
    console.log('Token:', result.token);
    
    // Pequeño delay antes de cambiar de vista para asegurar que el estado se actualizó
    setTimeout(() => {
      setCurrentView('result');
    }, 100);
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    setVerificationResult({
      token: 'VER-ERR-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      status: 'rejected',
      confidence: 0,
      error: error.message,
      processingTime: '2.1s'
    });
    setCurrentView('result');
  } finally {
    setIsProcessing(false);
    setProcessingStep('');
  }
};