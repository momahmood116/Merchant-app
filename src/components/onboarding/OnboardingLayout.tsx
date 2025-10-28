import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '../ui/button';

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  hideNext?: boolean;
}

const stepNames = [
  'Product',
  'Nationality',
  'Documents',
  'Personal Info',
  'Address',
  'Banking',
  'Business Docs',
  'Sector',
  'POS Info',
  'Verification',
  'Terms',
  'Submit',
];

export function OnboardingLayout({
  currentStep,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  isNextDisabled = false,
  hideNext = false,
}: OnboardingLayoutProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-accent/30">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">YBS</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">
            {stepNames.slice(0, totalSteps).map((stepName, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[60px] gap-1"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                    backgroundColor:
                      index < currentStep
                        ? '#5B2C83'
                        : index === currentStep
                        ? '#C4A3E3'
                        : '#E8DFF5',
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    index <= currentStep ? 'text-white' : 'text-primary'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={`text-xs text-center ${
                    index === currentStep
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stepName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          <div className="mb-8">
            <h1 className="text-primary mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {children}

          {!hideNext && onNext && (
            <div className="mt-8 flex justify-end">
              <Button
                onClick={onNext}
                disabled={isNextDisabled}
                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {nextLabel}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
