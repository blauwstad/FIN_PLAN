import React from 'react';
import { FinancingEquityData } from '../../types';
import { Card, Input, Label, Textarea } from '../ui/Layout';

interface Props {
  data: FinancingEquityData;
  errors: Record<string, string>;
  onChange: (data: Partial<FinancingEquityData>) => void;
}

export const FinancingEquityStep: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Financing & Equity</h2>
        <p className="mt-1 text-sm text-slate-500">Define the initial capital structure of the company.</p>
      </div>

      <Card className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <Label htmlFor="startingCapital">Initial Capital (EUR)</Label>
          <Input 
            id="startingCapital"
            type="number"
            value={data.startingCapital}
            onChange={(e) => onChange({ startingCapital: parseFloat(e.target.value) || 0 })}
            error={errors.startingCapital}
            placeholder="0.00"
          />
        </div>

        <div className="col-span-1">
            <Label htmlFor="equityContributions">Additional Equity Contributions (EUR)</Label>
            <Input 
                id="equityContributions"
                type="number"
                value={data.equityContributions}
                onChange={(e) => onChange({ equityContributions: parseFloat(e.target.value) || 0 })}
                error={errors.equityContributions}
                placeholder="0.00"
            />
        </div>

        <div className="md:col-span-2 border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Debt Financing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="loanAmount">Total External Loans (EUR)</Label>
                    <Input 
                        id="loanAmount"
                        type="number"
                        value={data.loanAmount}
                        onChange={(e) => onChange({ loanAmount: parseFloat(e.target.value) || 0 })}
                        error={errors.loanAmount}
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <Label htmlFor="loanDescription">Source of Funds</Label>
                    <Input 
                        id="loanDescription"
                        value={data.loanDescription}
                        onChange={(e) => onChange({ loanDescription: e.target.value })}
                        placeholder="e.g. Bank loan BNPP, Friends & Family"
                    />
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};
