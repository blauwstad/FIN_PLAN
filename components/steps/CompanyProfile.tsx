import React from 'react';
import { CompanyProfileData } from '../../types';
import { Card, Input, Label, Select } from '../ui/Layout';

interface Props {
  data: CompanyProfileData;
  errors: Record<string, string>;
  onChange: (data: Partial<CompanyProfileData>) => void;
}

export const CompanyProfileStep: React.FC<Props> = ({ data, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Company Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Legal details of the entity being formed.</p>
      </div>

      <Card className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            error={errors.companyName}
            placeholder="e.g. Acme Innovations"
          />
        </div>

        <div>
          <Label htmlFor="companyType">Legal Form</Label>
          <Select 
            id="companyType"
            value={data.companyType}
            onChange={(e) => onChange({ companyType: e.target.value as any })}
            error={errors.companyType}
          >
            <option value="BV">BV (Besloten Vennootschap)</option>
            <option value="NV">NV (Naamloze Vennootschap)</option>
          </Select>
        </div>

        <div>
            <Label htmlFor="foundingDate">Founding Date</Label>
            <Input 
                id="foundingDate"
                type="date"
                value={data.foundingDate}
                onChange={(e) => onChange({ foundingDate: e.target.value })}
                error={errors.foundingDate}
            />
        </div>

        <div>
            <Label htmlFor="country">Country</Label>
            <Select id="country" disabled value="BE">
                <option value="BE">Belgium</option>
            </Select>
        </div>
      </Card>
    </div>
  );
};
