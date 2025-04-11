"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface WizardStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  stepNumber: number;
  totalSteps: number;
  continueCTA: ReactNode;
}

export function WizardStep({
  title,
  description,
  children,
  stepNumber,
  totalSteps,
  continueCTA,
}: WizardStepProps) {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md relative">
      {/* Step counter */}
      <div className="absolute top-4 right-4 text-sm text-gray-500">
        Step {stepNumber} of {totalSteps}
      </div>

      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">{title}</h2>

      {/* Description */}
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {/* Body */}
      <div className="mb-6">{children}</div>

      {/* Continue button */}
      <div className="flex justify-beginning">{continueCTA}</div>
    </div>
  );
}

interface WizardProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    component: ReactNode;
    continueCTA: ReactNode;
  }>;
}

export function Wizard({ steps }: WizardProps) {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].id;

  return (
    <div className="w-full mx-auto relative">
      {steps.map((stepData, index) => (
        <div
          key={stepData.id}
          className={`absolute w-full transition-opacity duration-300 ${
            currentStep === stepData.id
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <WizardStep
            title={stepData.title}
            description={stepData.description}
            stepNumber={index + 1}
            totalSteps={steps.length}
            continueCTA={stepData.continueCTA}
          >
            {stepData.component}
          </WizardStep>
        </div>
      ))}
    </div>
  );
}
