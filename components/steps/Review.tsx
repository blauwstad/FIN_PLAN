import React, { useMemo } from 'react';
import { ReviewData, WizardData } from '../../types';
import { complianceEngine } from '../../services/complianceEngine';
import { createPlanContext } from '../../services/calculationService';
import { Card, Label } from '../ui/Layout';
import { AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  wizardData: WizardData;
  errors: Record<string, string>;
  onChange: (data: Partial<ReviewData>) => void;
}

export const ReviewStep: React.FC<Props> = ({ wizardData, errors, onChange }) => {
  
  const compliance = useMemo(() => {
    const context = createPlanContext(wizardData);
    return complianceEngine.evaluatePlan(context);
  }, [wizardData]);

  const statusColor = 
    compliance.status === 'OK' ? 'text-green-600 bg-green-50 border-green-200' :
    compliance.status === 'WARNINGS' ? 'text-amber-600 bg-amber-50 border-amber-200' :
    'text-red-600 bg-red-50 border-red-200';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review & Finalize</h2>
        <p className="mt-1 text-sm text-slate-500">Review the compliance report and accept the terms.</p>
      </div>

      <Card className={clsx("border", statusColor)}>
        <div className="flex items-start gap-4">
            <div className="mt-0.5">
                {compliance.status === 'OK' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {compliance.status === 'WARNINGS' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                {compliance.status === 'BLOCKING' && <Ban className="w-6 h-6 text-red-600" />}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold">Compliance Status: {compliance.status}</h3>
                <div className="mt-4 space-y-3">
                    {compliance.findings.length === 0 && (
                        <p className="text-sm">No compliance issues detected. The financial plan meets standard criteria.</p>
                    )}
                    {compliance.findings.map((finding, idx) => (
                        <div key={idx} className="flex gap-2 text-sm p-3 bg-white/50 rounded border border-current/20">
                             <span className={clsx("font-bold uppercase text-xs px-2 py-0.5 rounded self-start", 
                                finding.severity === 'error' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                             )}>
                                {finding.severity}
                             </span>
                             <div className="text-slate-900">
                                <p className="font-medium">{finding.message}</p>
                                {finding.legalReference && <p className="text-xs opacity-75 mt-1">Ref: {finding.legalReference}</p>}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
            <input 
                id="disclaimer"
                type="checkbox"
                checked={wizardData.review.acceptedDisclaimer}
                onChange={(e) => onChange({ acceptedDisclaimer: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
            />
            <Label htmlFor="disclaimer">
                I confirm that the data provided is accurate and acknowledges the legal responsibilities associated with the founders' liability.
            </Label>
        </div>
        {errors.acceptedDisclaimer && <p className="mt-2 text-sm text-red-600 ml-7">{errors.acceptedDisclaimer}</p>}
      </Card>
    </div>
  );
};
