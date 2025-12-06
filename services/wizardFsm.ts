import { 
    WizardData, 
    WizardStepId, 
    StepValidationResult, 
    WizardStatus, 
    WIZARD_STEPS_IN_ORDER,
    CompanyProfileData,
    ActivitiesRisksData,
    FinancingEquityData,
    ProjectionsData,
    ReviewData
} from '../types';

// --- Validation Logic ---

function validateCompanyProfile(profile: CompanyProfileData): StepValidationResult {
  const errors: Record<string, string> = {};
  if (!profile.companyName?.trim()) errors.companyName = 'Company name is required.';
  if (!profile.companyType) errors.companyType = 'Company type is required.';
  if (!profile.foundingDate) errors.foundingDate = 'Founding date is required.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateActivitiesRisks(activities: ActivitiesRisksData): StepValidationResult {
  const errors: Record<string, string> = {};
  if (!activities.mainActivityDescription?.trim()) {
    errors.mainActivityDescription = 'Description is required.';
  }
  if (!activities.keyRisks?.trim()) {
      errors.keyRisks = 'Please identify at least one key risk.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateFinancingEquity(finance: FinancingEquityData): StepValidationResult {
  const errors: Record<string, string> = {};
  if (finance.startingCapital < 0) errors.startingCapital = 'Cannot be negative.';
  if (finance.equityContributions < 0) errors.equityContributions = 'Cannot be negative.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateProjections(proj: ProjectionsData): StepValidationResult {
  const errors: Record<string, string> = {};
  if (proj.numberOfYears < 2) errors.numberOfYears = 'Minimum 2 years required.';
  if (proj.numberOfYears > 5) errors.numberOfYears = 'Maximum 5 years allowed.';
  if (proj.expectedTurnoverYear1 <= 0) errors.expectedTurnoverYear1 = 'Must be positive.';
  return { isValid: Object.keys(errors).length === 0, errors };
}

function validateReview(review: ReviewData): StepValidationResult {
  const errors: Record<string, string> = {};
  if (!review.acceptedDisclaimer) {
    errors.acceptedDisclaimer = 'Confirmation is required to finalize.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep(step: WizardStepId, data: WizardData): StepValidationResult {
  switch (step) {
    case 'companyProfile': return validateCompanyProfile(data.companyProfile);
    case 'activitiesRisks': return validateActivitiesRisks(data.activitiesRisks);
    case 'financingEquity': return validateFinancingEquity(data.financingEquity);
    case 'projections': return validateProjections(data.projections);
    case 'review': return validateReview(data.review);
  }
}

// --- FSM Types ---

export interface WizardState {
  currentStep: WizardStepId;
  data: WizardData;
  stepValidity: Partial<Record<WizardStepId, StepValidationResult>>;
  status: WizardStatus;
  globalError?: string;
}

export type WizardEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GO_TO_STEP'; step: WizardStepId }
  | { type: 'UPDATE_STEP_DATA'; step: WizardStepId; payload: any }
  | { type: 'SAVE_PLAN_REQUEST' }
  | { type: 'SAVE_PLAN_SUCCESS' }
  | { type: 'SAVE_PLAN_FAILURE'; error: string };

// --- Helpers ---

function getNextStep(current: WizardStepId): WizardStepId | null {
  const index = WIZARD_STEPS_IN_ORDER.indexOf(current);
  if (index === -1 || index === WIZARD_STEPS_IN_ORDER.length - 1) return null;
  return WIZARD_STEPS_IN_ORDER[index + 1];
}

function getPreviousStep(current: WizardStepId): WizardStepId | null {
  const index = WIZARD_STEPS_IN_ORDER.indexOf(current);
  if (index <= 0) return null;
  return WIZARD_STEPS_IN_ORDER[index - 1];
}

// --- Initial State ---

export function createInitialWizardState(): WizardState {
  return {
    currentStep: 'companyProfile',
    data: {
      companyProfile: { companyName: '', companyType: 'BV', country: 'BE', foundingDate: new Date().toISOString().split('T')[0] },
      activitiesRisks: { naceCodes: [], mainActivityDescription: '', keyRisks: '' },
      financingEquity: { startingCapital: 0, equityContributions: 0, loanAmount: 0, loanDescription: '' },
      projections: { expectedTurnoverYear1: 100000, expectedTurnoverGrowthRate: 5, numberOfYears: 3, vatRegime: 'normal' },
      review: { acceptedDisclaimer: false }
    },
    stepValidity: {},
    status: 'IDLE'
  };
}

// --- Reducer ---

export function wizardReducer(state: WizardState, event: WizardEvent): WizardState {
  switch (event.type) {
    case 'UPDATE_STEP_DATA': {
      const { step, payload } = event;
      const newData = { ...state.data, [step]: { ...state.data[step], ...payload } };
      // Live validation (optional, can be removed for submit-only validation)
      const validation = validateStep(step, newData);
      return {
        ...state,
        data: newData,
        stepValidity: { ...state.stepValidity, [step]: validation },
        globalError: undefined
      };
    }
    case 'NEXT': {
      const validation = validateStep(state.currentStep, state.data);
      if (!validation.isValid) {
        return {
          ...state,
          stepValidity: { ...state.stepValidity, [state.currentStep]: validation },
          globalError: 'Please fix the errors before continuing.'
        };
      }
      const next = getNextStep(state.currentStep);
      return next ? { ...state, currentStep: next, globalError: undefined } : state;
    }
    case 'BACK': {
      const prev = getPreviousStep(state.currentStep);
      return prev ? { ...state, currentStep: prev, globalError: undefined } : state;
    }
    case 'GO_TO_STEP': {
        // Allow jumping back, prevent jumping forward over invalid steps
        const targetIdx = WIZARD_STEPS_IN_ORDER.indexOf(event.step);
        const currentIdx = WIZARD_STEPS_IN_ORDER.indexOf(state.currentStep);
        
        if (targetIdx < currentIdx) {
            return { ...state, currentStep: event.step, globalError: undefined };
        }
        
        // Check validity of all steps up to target
        for(let i=0; i<targetIdx; i++) {
            const stepId = WIZARD_STEPS_IN_ORDER[i];
            const v = validateStep(stepId, state.data);
            if(!v.isValid) {
                return {
                    ...state,
                    stepValidity: { ...state.stepValidity, [stepId]: v },
                    currentStep: stepId,
                    globalError: `Complete the ${stepId} step first.`
                }
            }
        }

        return { ...state, currentStep: event.step, globalError: undefined };
    }
    case 'SAVE_PLAN_REQUEST':
      return { ...state, status: 'SAVING' };
    case 'SAVE_PLAN_SUCCESS':
      return { ...state, status: 'COMPLETED' };
    case 'SAVE_PLAN_FAILURE':
      return { ...state, status: 'ERROR', globalError: event.error };
    default:
      return state;
  }
}
