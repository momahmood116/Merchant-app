import { useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Calendar, MapPin, Phone, Building, Heart } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PersonalInfo, Gender, MaritalStatus } from '../../types/application';

interface PersonalInfoFormProps {
  data?: PersonalInfo;
  extractedData?: any;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, extractedData, onChange }: PersonalInfoFormProps) {
  const formData = data || {} as PersonalInfo;

  // Auto-fill from extracted data
  useEffect(() => {
    if (extractedData && !data) {
      onChange({
        ...formData,
        firstName: extractedData.fullName?.split(' ')[0] || '',
        middleName: extractedData.fullName?.split(' ')[1] || '',
        lastName: extractedData.fullName?.split(' ')[2] || '',
        motherName: extractedData.motherName || '',
        dateOfBirth: extractedData.dateOfBirth || '',
        placeOfBirth: extractedData.placeOfBirth || '',
        gender: extractedData.gender || 'Male',
        nationalIdOrPassport: extractedData.nationalId || extractedData.passportNumber || '',
        issueDate: extractedData.issueDate || '',
        expiryDate: extractedData.expiryDate || '',
      } as PersonalInfo);
    }
  }, [extractedData]);

  const updateField = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const maritalStatuses: { value: MaritalStatus; icon: string }[] = [
    { value: 'Single', icon: '👤' },
    { value: 'Married', icon: '💑' },
    { value: 'Divorced', icon: '💔' },
    { value: 'Widow', icon: '🖤' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => updateField('gender', value as Gender)}>
            <SelectTrigger className="h-12 rounded-xl bg-input-background">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <div className="grid grid-cols-4 gap-2">
            {maritalStatuses.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => updateField('maritalStatus', status.value)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  formData.maritalStatus === status.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{status.icon}</div>
                <div className="text-xs">{status.value}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName || ''}
            onChange={(e) => updateField('middleName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="motherName">Mother's Name</Label>
          <Input
            id="motherName"
            value={formData.motherName || ''}
            onChange={(e) => updateField('motherName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={(e) => updateField('dateOfBirth', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Place of Birth</Label>
          <Input
            id="placeOfBirth"
            value={formData.placeOfBirth || ''}
            onChange={(e) => updateField('placeOfBirth', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName || ''}
            onChange={(e) => updateField('companyName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tradingName">Trading Name</Label>
          <Input
            id="tradingName"
            value={formData.tradingName || ''}
            onChange={(e) => updateField('tradingName', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationalIdOrPassport">National ID / Passport Number</Label>
        <Input
          id="nationalIdOrPassport"
          value={formData.nationalIdOrPassport || ''}
          onChange={(e) => updateField('nationalIdOrPassport', e.target.value)}
          className="h-12 rounded-xl bg-input-background"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate || ''}
            onChange={(e) => updateField('issueDate', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            type="date"
            value={formData.expiryDate || ''}
            onChange={(e) => updateField('expiryDate', e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>
    </div>
  );
}
