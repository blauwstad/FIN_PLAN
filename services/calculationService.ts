import { WizardData, ProjectionYear, PlanContext } from '../types';

/**
 * Pure function to project financials based on wizard inputs.
 * In a real app, this might reside on the backend or be a shared library.
 */
export function generateProjections(data: WizardData): ProjectionYear[] {
  const years: ProjectionYear[] = [];
  
  const startCapital = data.financingEquity.startingCapital;
  const initialEquity = startCapital + data.financingEquity.equityContributions;
  const growthRate = data.projections.expectedTurnoverGrowthRate / 100;
  
  let currentEquity = initialEquity;

  for (let i = 1; i <= data.projections.numberOfYears; i++) {
    // Turnover Logic
    const turnover = i === 1 
      ? data.projections.expectedTurnoverYear1
      : years[i - 2].turnover * (1 + growthRate);

    // Simplified OPEX Logic (assume 75% costs for demo purposes)
    const opex = turnover * 0.75;
    const ebit = turnover - opex;

    // Simplified Tax (25%) on positive EBIT
    const tax = ebit > 0 ? ebit * 0.25 : 0;
    const netResult = ebit - tax;

    currentEquity += netResult;

    // Balance Sheet Logic (Simplified: Assets = Equity + Liabs)
    // Liabs assumed constant loans for demo
    const liabilities = data.financingEquity.loanAmount;
    const assets = currentEquity + liabilities;

    years.push({
      yearIndex: i,
      turnover: Math.round(turnover),
      opex: Math.round(opex),
      ebit: Math.round(ebit),
      balanceSheet: {
        assets: Math.round(assets),
        equity: Math.round(currentEquity),
        liabilities: Math.round(liabilities)
      }
    });
  }

  return years;
}

export function createPlanContext(data: WizardData): PlanContext {
    return {
        companyType: data.companyProfile.companyType,
        assumptions: {
            expectedTurnover: data.projections.expectedTurnoverYear1,
            startingCapital: data.financingEquity.startingCapital + data.financingEquity.equityContributions,
            vatRegime: data.projections.vatRegime
        },
        projections: generateProjections(data)
    };
}
