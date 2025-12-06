import React, { useMemo } from 'react';
import { ProjectionsData, WizardData } from '../../types';
import { Card, Input, Label, Select } from '../ui/Layout';
import { generateProjections } from '../../services/calculationService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface Props {
  wizardData: WizardData; // Needs full data for calculations
  errors: Record<string, string>;
  onChange: (data: Partial<ProjectionsData>) => void;
}

export const ProjectionsStep: React.FC<Props> = ({ wizardData, errors, onChange }) => {
  const data = wizardData.projections;

  // Real-time chart data generation
  const chartData = useMemo(() => {
    return generateProjections(wizardData).map(p => ({
        name: `Year ${p.yearIndex}`,
        Turnover: p.turnover,
        EBIT: p.ebit,
        Cash: p.balanceSheet.assets * 0.1 // Simulated cash
    }));
  }, [wizardData]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Financial Projections</h2>
        <p className="mt-1 text-sm text-slate-500">Forecast your turnover and growth for the first few years.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
             <Card className="space-y-4">
                <div>
                    <Label htmlFor="years">Projection Period (Years)</Label>
                    <Select 
                        id="years"
                        value={data.numberOfYears}
                        onChange={(e) => onChange({ numberOfYears: parseInt(e.target.value) })}
                        error={errors.numberOfYears}
                    >
                        <option value={2}>2 Years</option>
                        <option value={3}>3 Years</option>
                        <option value={4}>4 Years</option>
                        <option value={5}>5 Years</option>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="turnover">Year 1 Expected Turnover (EUR)</Label>
                    <Input 
                        id="turnover"
                        type="number"
                        value={data.expectedTurnoverYear1}
                        onChange={(e) => onChange({ expectedTurnoverYear1: parseFloat(e.target.value) || 0 })}
                        error={errors.expectedTurnoverYear1}
                    />
                </div>

                <div>
                    <Label htmlFor="growth">Annual Growth Rate (%)</Label>
                    <Input 
                        id="growth"
                        type="number"
                        value={data.expectedTurnoverGrowthRate}
                        onChange={(e) => onChange({ expectedTurnoverGrowthRate: parseFloat(e.target.value) || 0 })}
                        error={errors.expectedTurnoverGrowthRate}
                    />
                </div>

                <div>
                    <Label htmlFor="vat">VAT Regime</Label>
                    <Select
                        id="vat"
                        value={data.vatRegime}
                        onChange={(e) => onChange({ vatRegime: e.target.value as any })}
                    >
                        <option value="normal">Normal Regime</option>
                        <option value="exemption_25k">Small Ent. Exemption (&lt; 25k)</option>
                    </Select>
                </div>
             </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full min-h-[400px]">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Projected Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Turnover" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="EBIT" fill="#0c4a6e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
          </div>
      </div>
    </div>
  );
};
