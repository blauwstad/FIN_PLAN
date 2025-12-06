// --- Wizard Core Types ---

export type WizardStepId =
  | 'companyProfile'
  | 'activitiesRisks'
  | 'financingEquity'
  | 'projections'
  | 'review';

export const WIZARD_STEPS_IN_ORDER: WizardStepId[] = [
  'companyProfile',
  'activitiesRisks',
  'financingEquity',
  'projections',
  'review'
];

export type WizardStatus = 'IDLE' | 'SAVING' | 'COMPLETED' | 'ERROR';

// --- Data Models ---

export type CompanyType = 'BV' | 'NV';
export type VatRegime = 'normal' | 'exemption_25k';

export interface CompanyProfileData {
  companyName: string;
  companyType: CompanyType;
  foundingDate: string;
  country: 'BE';
}

export interface ActivitiesRisksData {
  naceCodes: string[];
  mainActivityDescription: string;
  keyRisks: string;
}

export interface FinancingEquityData {
  startingCapital: number;
  equityContributions: number;
  loanAmount: number;
  loanDescription: string;
}

export interface ProjectionsData {
  expectedTurnoverYear1: number;
  expectedTurnoverGrowthRate: number; // e.g. 5 for 5%
  numberOfYears: number;
  vatRegime: VatRegime;
}

export interface ReviewData {
  acceptedDisclaimer: boolean;
}

export interface WizardData {
  companyProfile: CompanyProfileData;
  activitiesRisks: ActivitiesRisksData;
  financingEquity: FinancingEquityData;
  projections: ProjectionsData;
  review: ReviewData;
}

// --- Validation Types ---

export interface StepValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// --- Compliance Engine Types ---

export interface ProjectionYear {
  yearIndex: number;
  turnover: number;
  opex: number;
  ebit: number;
  balanceSheet: {
    assets: number;
    equity: number;
    liabilities: number;
  };
}

export interface PlanAssumptions {
  expectedTurnover: number;
  vatRegime: VatRegime;
  startingCapital: number;
}

export interface PlanContext {
  companyType: CompanyType;
  projections: ProjectionYear[];
  assumptions: PlanAssumptions;
}

export type Severity = 'error' | 'warning' | 'info';

export interface ComplianceFinding {
  code: string;
  severity: Severity;
  message: string;
  legalReference?: string;
  path?: string;
}

export type ComplianceStatus = 'OK' | 'WARNINGS' | 'BLOCKING';

export interface ComplianceResult {
  status: ComplianceStatus;
  findings: ComplianceFinding[];
}

export interface ComplianceRule {
  code: string;
  description: string;
  evaluate(context: PlanContext): ComplianceFinding | null;
}
