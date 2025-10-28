import React, { createContext, useContext, useState } from 'react';
import { MerchantApplication, ProductType, Nationality } from '../types/application';

interface ApplicationContextType {
  application: Partial<MerchantApplication>;
  updateApplication: (data: Partial<MerchantApplication>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  resetApplication: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const initialApplication: Partial<MerchantApplication> = {
  documents: [],
  businessDocuments: [],
  numberOfBranches: 1,
  numberOfPOS: 1,
  faceVerified: false,
  termsAccepted: false,
};

export function ApplicationProvider({ children }: { children: React.ReactNode }) {
  const [application, setApplication] = useState<Partial<MerchantApplication>>(initialApplication);
  const [currentStep, setCurrentStep] = useState(0);

  const updateApplication = (data: Partial<MerchantApplication>) => {
    setApplication(prev => ({ ...prev, ...data }));
  };

  const resetApplication = () => {
    setApplication(initialApplication);
    setCurrentStep(0);
  };

  return (
    <ApplicationContext.Provider 
      value={{ 
        application, 
        updateApplication, 
        currentStep, 
        setCurrentStep,
        resetApplication 
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}
