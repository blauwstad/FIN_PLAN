import {
  ComplianceResult,
  ComplianceRule,
  ComplianceFinding,
  ComplianceStatus,
  PlanContext
} from '../types';

// --- Rules Implementation ---

export const MinProjectionYearsRule: ComplianceRule = {
  code: 'MIN_PROJECTION_YEARS',
  description: 'Financial plan must contain at least 2 full years of projections.',
  evaluate(context: PlanContext): ComplianceFinding | null {
    if (!context.projections || context.projections.length < 2) {
      return {
        code: 'MIN_PROJECTION_YEARS',
        severity: 'error',
        message: 'At least 2 years of financial projections are required.',
        legalReference: 'BCCA – financial plan requirements',
        path: 'projections'
      };
    }
    return null;
  }
};

export const SufficientEquityHeuristicRule: ComplianceRule = {
  code: 'INSUFFICIENT_EQUITY_RISK',
  description: 'Flag if equity becomes negative during BV projections.',
  evaluate(context: PlanContext): ComplianceFinding | null {
    if (context.companyType !== 'BV') return null;

    const negativeEquityYear = context.projections.find(p => p.balanceSheet.equity < 0);

    if (negativeEquityYear) {
      return {
        code: 'INSUFFICIENT_EQUITY_RISK',
        severity: 'warning',
        message: `Equity becomes negative in year ${negativeEquityYear.yearIndex}. This indicates high risk and potential insufficient initial capital.`,
        legalReference: 'BCCA – founders’ liability',
        path: 'projections'
      };
    }
    return null;
  }
};

export const MinCapitalNvRule: ComplianceRule = {
  code: 'MIN_CAPITAL_NV',
  description: 'Check minimum capital for NV (61,500 EUR).',
  evaluate(context: PlanContext): ComplianceFinding | null {
    if (context.companyType !== 'NV') return null;

    const MIN_CAPITAL_NV = 61500;
    const startingCapital = context.assumptions.startingCapital ?? 0;

    if (startingCapital < MIN_CAPITAL_NV) {
      return {
        code: 'MIN_CAPITAL_NV',
        severity: 'error',
        message: `NV minimum capital is EUR ${MIN_CAPITAL_NV}. Provided: ${startingCapital}.`,
        legalReference: 'BCCA – NV minimum capital',
        path: 'financingEquity'
      };
    }
    return null;
  }
};

export const VatExemptionConsistencyRule: ComplianceRule = {
  code: 'VAT_EXEMPTION_TURNOVER_CHECK',
  description: 'If VAT exemption (<= 25k) is chosen, check expected turnover.',
  evaluate(context: PlanContext): ComplianceFinding | null {
    if (context.assumptions.vatRegime !== 'exemption_25k') return null;

    const expected = context.assumptions.expectedTurnover;
    const THRESHOLD = 25000;

    if (expected > THRESHOLD) {
      return {
        code: 'VAT_EXEMPTION_TURNOVER_CHECK',
        severity: 'warning',
        message: `VAT exemption selected but turnover (${expected} EUR) exceeds 25k EUR threshold.`,
        legalReference: 'Belgian VAT small enterprise exemption',
        path: 'projections'
      };
    }
    return null;
  }
};

// --- Engine ---

export class ComplianceEngine {
  private rules: ComplianceRule[] = [];

  constructor() {
    this.rules = [
        MinProjectionYearsRule,
        SufficientEquityHeuristicRule,
        MinCapitalNvRule,
        VatExemptionConsistencyRule
    ];
  }

  evaluatePlan(context: PlanContext): ComplianceResult {
    const findings: ComplianceFinding[] = [];

    for (const rule of this.rules) {
      const finding = rule.evaluate(context);
      if (finding) findings.push(finding);
    }

    const hasError = findings.some(f => f.severity === 'error');
    const hasWarning = findings.some(f => f.severity === 'warning');

    const status: ComplianceStatus = hasError
      ? 'BLOCKING'
      : hasWarning
      ? 'WARNINGS'
      : 'OK';

    return { status, findings };
  }
}

export const complianceEngine = new ComplianceEngine();