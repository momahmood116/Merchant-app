import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BankingInfo } from '../../types/application';

interface BankingFormProps {
  data?: BankingInfo;
  onChange: (data: BankingInfo) => void;
}

export function BankingForm({ data, onChange }: BankingFormProps) {
  const formData = data || {} as BankingInfo;

  const updateField = (field: keyof BankingInfo, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        <p>Banking information is optional but recommended for faster settlement processing.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          value={formData.bankName || ''}
          onChange={(e) => updateField('bankName', e.target.value)}
          placeholder="Enter bank name"
          className="h-12 rounded-xl bg-input-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          value={formData.accountNumber || ''}
          onChange={(e) => updateField('accountNumber', e.target.value)}
          placeholder="Enter account number"
          className="h-12 rounded-xl bg-input-background"
        />
      </div>
    </div>
  );
}
