import React from 'react';
import { ActivitiesRisksData } from '../../types';
import { Card, Label, Textarea } from '../ui/Layout';

interface Props {
  data: ActivitiesRisksData;
  errors: Record<string, string>;
  onChange: (data: Partial<ActivitiesRisksData>) => void;
}

export const ActivitiesRisksStep: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Activities & Risks</h2>
        <p className="mt-1 text-sm text-slate-500">Describe what the company does and the key risks involved.</p>
      </div>

      <Card className="space-y-6">
        <div>
          <Label htmlFor="description">Main Activity Description</Label>
          <Textarea 
            id="description"
            rows={4}
            value={data.mainActivityDescription}
            onChange={(e) => onChange({ mainActivityDescription: e.target.value })}
            error={errors.mainActivityDescription}
            placeholder="Describe the core business activities..."
          />
        </div>

        <div>
          <Label htmlFor="risks">Key Risks</Label>
          <p className="text-xs text-slate-400 mb-2">Identify internal/external factors that could affect profitability.</p>
          <Textarea 
            id="risks"
            rows={4}
            value={data.keyRisks}
            onChange={(e) => onChange({ keyRisks: e.target.value })}
            error={errors.keyRisks}
            placeholder="e.g. Market competition, regulatory changes, supply chain dependencies..."
          />
        </div>
      </Card>
    </div>
  );
};
