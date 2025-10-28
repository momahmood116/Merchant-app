import { useState, useEffect } from 'react';
import { useApplication } from '../../contexts/ApplicationContext';
import { useAuth } from '../../contexts/AuthContext';
import { ProductSelection } from './ProductSelection';
import { OnboardingLayout } from './OnboardingLayout';
import { NationalitySelection } from './NationalitySelection';
import { DocumentCapture } from './DocumentCapture';
import { PersonalInfoForm } from './PersonalInfoForm';
import { AddressForm } from './AddressForm';
import { BankingForm } from './BankingForm';
import { BusinessDocuments } from './BusinessDocuments';
import { SectorSelection } from './SectorSelection';
import { POSInformation } from './POSInformation';
import { FaceVerification } from './FaceVerification';
import { TermsAndConditions } from './TermsAndConditions';
import { SubmitApplication } from './SubmitApplication';
import { ProductType, Nationality } from '../../types/application';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { application, updateApplication, currentStep, setCurrentStep } = useApplication();
  const [showProductSelection, setShowProductSelection] = useState(!application.productType);

  useEffect(() => {
    if (application.productType && showProductSelection) {
      setShowProductSelection(false);
    }
  }, [application.productType, showProductSelection]);

  const handleProductSelect = (productType: ProductType) => {
    updateApplication({ productType });
    setShowProductSelection(false);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      setShowProductSelection(true);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showProductSelection) {
    return <ProductSelection onSelect={handleProductSelect} />;
  }

  const totalSteps = 11;

  const steps = [
    {
      title: 'Select Nationality',
      description: 'Choose your nationality to determine required documents',
      component: (
        <NationalitySelection
          selected={application.nationality}
          onSelect={(nationality: Nationality) => updateApplication({ nationality })}
        />
      ),
      canProceed: !!application.nationality,
    },
    {
      title: 'Upload Documents',
      description: 'Capture or upload your identification documents',
      component: (
        <DocumentCapture
          nationality={application.nationality!}
          documents={application.documents || []}
          onDocumentsUpdate={(documents) => updateApplication({ documents })}
        />
      ),
      canProceed: (application.documents?.length || 0) >= 2,
    },
    {
      title: 'Personal Information',
      description: 'Verify and complete your personal details',
      component: (
        <PersonalInfoForm
          data={application.personalInfo}
          extractedData={application.documents?.[0]?.extractedData}
          onChange={(personalInfo) => updateApplication({ personalInfo })}
        />
      ),
      canProceed: !!application.personalInfo?.firstName && !!application.personalInfo?.lastName,
    },
    {
      title: 'Address Details',
      description: 'Provide your business location information',
      component: (
        <AddressForm
          data={application.addressInfo}
          onChange={(addressInfo) => updateApplication({ addressInfo })}
        />
      ),
      canProceed: !!application.addressInfo?.governorate && !!application.addressInfo?.email,
    },
    {
      title: 'Banking Information',
      description: 'Add your bank account details (optional)',
      component: (
        <BankingForm
          data={application.bankingInfo}
          onChange={(bankingInfo) => updateApplication({ bankingInfo })}
        />
      ),
      canProceed: true,
    },
    {
      title: 'Business Documents',
      description: 'Upload required business certificates and documents',
      component: (
        <BusinessDocuments
          documents={application.businessDocuments || []}
          onChange={(businessDocuments) => updateApplication({ businessDocuments })}
        />
      ),
      canProceed: (application.businessDocuments?.length || 0) > 0,
    },
    {
      title: 'Merchant Sector',
      description: 'Select your business industry sector',
      component: (
        <SectorSelection
          selected={application.merchantSector}
          onSelect={(merchantSector) => updateApplication({ merchantSector })}
        />
      ),
      canProceed: !!application.merchantSector,
    },
    {
      title: 'POS Information',
      description: 'Specify your POS terminal requirements',
      component: (
        <POSInformation
          numberOfBranches={application.numberOfBranches || 1}
          numberOfPOS={application.numberOfPOS || 1}
          onChange={(data) => updateApplication(data)}
        />
      ),
      canProceed: true,
    },
    {
      title: 'Identity Verification',
      description: 'Complete face verification and digital signature',
      component: (
        <FaceVerification
          faceVerified={application.faceVerified || false}
          signatureData={application.signatureData}
          onChange={(data) => updateApplication(data)}
        />
      ),
      canProceed: application.faceVerified && !!application.signatureData,
    },
    {
      title: 'Terms & Conditions',
      description: 'Review and accept the merchant agreement',
      component: (
        <TermsAndConditions
          accepted={application.termsAccepted || false}
          onAccept={(termsAccepted) => updateApplication({ termsAccepted })}
        />
      ),
      canProceed: application.termsAccepted,
    },
    {
      title: 'Submit Application',
      description: 'Review your application and submit for approval',
      component: <SubmitApplication application={application} onComplete={onComplete} />,
      canProceed: false,
      hideNext: true,
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={currentStepData.title}
      description={currentStepData.description}
      onNext={currentStepData.canProceed ? handleNext : undefined}
      onBack={handleBack}
      isNextDisabled={!currentStepData.canProceed}
      hideNext={currentStepData.hideNext}
    >
      {currentStepData.component}
    </OnboardingLayout>
  );
}
