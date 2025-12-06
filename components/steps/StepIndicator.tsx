import React from 'react';
import { WizardStepId, WIZARD_STEPS_IN_ORDER } from '../../types';
import { CheckCircle2, Circle, Disc } from 'lucide-react';
import { clsx } from 'clsx';

interface StepIndicatorProps {
  currentStep: WizardStepId;
  onSelectStep: (step: WizardStepId) => void;
  validity: Record<string, any>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onSelectStep, validity }) => {
  const steps: { id: WizardStepId; label: string }[] = [
    { id: 'companyProfile', label: 'Company Profile' },
    { id: 'activitiesRisks', label: 'Activities & Risks' },
    { id: 'financingEquity', label: 'Financing & Equity' },
    { id: 'projections', label: 'Financial Projections' },
    { id: 'review', label: 'Compliance Review' }
  ];

  const currentIndex = WIZARD_STEPS_IN_ORDER.indexOf(currentStep);

  return (
    <nav aria-label="Progress" className="py-8 xl:py-12">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => {
          const isComplete = WIZARD_STEPS_IN_ORDER.indexOf(step.id) < currentIndex;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className={clsx(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
              {stepIdx !== steps.length - 1 ? (
                <div 
                    className={clsx(
                        "absolute top-4 left-4 -ml-px h-full w-0.5", 
                        isComplete ? "bg-primary-600" : "bg-slate-200"
                    )} 
                    aria-hidden="true" 
                />
              ) : null}
              <div 
                className="group relative flex items-start cursor-pointer" 
                onClick={() => onSelectStep(step.id)}
              >
                <span className="flex h-9 items-center">
                  <span className={clsx(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors bg-white",
                    isComplete ? "bg-primary-600 border-primary-600" : 
                    isCurrent ? "border-primary-600" : "border-slate-300"
                  )}>
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : isCurrent ? (
                      <Disc className="h-5 w-5 text-primary-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className={clsx("text-sm font-semibold tracking-wide", isCurrent ? "text-primary-600" : "text-slate-500")}>
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-400">Step {stepIdx + 1}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
