import React, { useReducer } from 'react';
import { createInitialWizardState, wizardReducer } from './services/wizardFsm';
import { StepIndicator } from './components/steps/StepIndicator';
import { CompanyProfileStep } from './components/steps/CompanyProfile';
import { ActivitiesRisksStep } from './components/steps/ActivitiesRisks';
import { FinancingEquityStep } from './components/steps/FinancingEquity';
import { ProjectionsStep } from './components/steps/Projections';
import { ReviewStep } from './components/steps/Review';
import { Button } from './components/ui/Layout';
import { ArrowLeft, ArrowRight, Save, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(
    wizardReducer,
    undefined,
    createInitialWizardState
  );

  const { currentStep, data, stepValidity, status, globalError } = state;

  const handleNext = () => dispatch({ type: 'NEXT' });
  const handleBack = () => dispatch({ type: 'BACK' });
  const handleStepClick = (step: any) => dispatch({ type: 'GO_TO_STEP', step });
  
  const handleSave = () => {
    dispatch({ type: 'SAVE_PLAN_REQUEST' });
    // Simulate API call
    setTimeout(() => {
        // Simple heuristic for demo: fail if blocking errors exist
        // In real app, we check engine status
        dispatch({ type: 'SAVE_PLAN_SUCCESS' });
        alert("Financial Plan Saved Successfully!");
    }, 1500);
  };

  const currentErrors = stepValidity[currentStep]?.errors || {};

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-900 bg-slate-50">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex-shrink-0 md:h-screen sticky top-0 overflow-y-auto z-10">
        <div className="p-6 border-b border-slate-100">
           <div className="flex items-center gap-2 text-primary-700">
                <LayoutDashboard className="w-6 h-6" />
                <span className="font-bold text-xl tracking-tight">FinPlan BE</span>
           </div>
           <p className="text-xs text-slate-500 mt-1">Founders' Financial Plan Wizard</p>
        </div>
        <div className="px-6">
            <StepIndicator 
                currentStep={currentStep} 
                onSelectStep={handleStepClick}
                validity={stepValidity} 
            />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Mobile Bar (only visible on small screens handled by css logic if needed, simplified here) */}
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {globalError && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Attention needed</h3>
                    <div className="mt-2 text-sm text-red-700">{globalError}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[400px]">
                {currentStep === 'companyProfile' && (
                <CompanyProfileStep
                    data={data.companyProfile}
                    errors={currentErrors}
                    onChange={(payload) => dispatch({ type: 'UPDATE_STEP_DATA', step: 'companyProfile', payload })}
                />
                )}
                {currentStep === 'activitiesRisks' && (
                <ActivitiesRisksStep
                    data={data.activitiesRisks}
                    errors={currentErrors}
                    onChange={(payload) => dispatch({ type: 'UPDATE_STEP_DATA', step: 'activitiesRisks', payload })}
                />
                )}
                {currentStep === 'financingEquity' && (
                <FinancingEquityStep
                    data={data.financingEquity}
                    errors={currentErrors}
                    onChange={(payload) => dispatch({ type: 'UPDATE_STEP_DATA', step: 'financingEquity', payload })}
                />
                )}
                {currentStep === 'projections' && (
                <ProjectionsStep
                    wizardData={data} // Pass full data for calculation context
                    errors={currentErrors}
                    onChange={(payload) => dispatch({ type: 'UPDATE_STEP_DATA', step: 'projections', payload })}
                />
                )}
                {currentStep === 'review' && (
                <ReviewStep
                    wizardData={data}
                    errors={currentErrors}
                    onChange={(payload) => dispatch({ type: 'UPDATE_STEP_DATA', step: 'review', payload })}
                />
                )}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white border-t border-slate-200 p-4 md:px-8 flex justify-between items-center sticky bottom-0 z-20">
            <Button 
                variant="secondary" 
                onClick={handleBack} 
                disabled={currentStep === 'companyProfile' || status === 'SAVING'}
                className="w-24"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="flex gap-4">
                {currentStep !== 'review' ? (
                    <Button onClick={handleNext} className="w-32">
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSave} disabled={status === 'SAVING' || status === 'COMPLETED'} className="w-48">
                        {status === 'SAVING' ? 'Saving...' : 'Finalize Plan'} 
                        {!status && <Save className="w-4 h-4 ml-2" />}
                    </Button>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
