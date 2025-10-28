import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { AddressInfo, IRAQI_GOVERNORATES } from '../../types/application';

interface AddressFormProps {
  data?: AddressInfo;
  onChange: (data: AddressInfo) => void;
}

export function AddressForm({ data, onChange }: AddressFormProps) {
  const formData = data || {} as AddressInfo;

  const updateField = (field: keyof AddressInfo, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="governorate">Governorate</Label>
        <Select value={formData.governorate} onValueChange={(value) => updateField('governorate', value)}>
          <SelectTrigger className="h-12 rounded-xl bg-input-background">
            <SelectValue placeholder="Select governorate" />
          </SelectTrigger>
          <SelectContent>
            {IRAQI_GOVERNORATES.map((gov) => (
              <SelectItem key={gov} value={gov}>
                {gov}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullAddress">Full Address</Label>
        <Textarea
          id="fullAddress"
          value={formData.fullAddress || ''}
          onChange={(e) => updateField('fullAddress', e.target.value)}
          placeholder="Enter complete business address including street, district, and nearest landmark"
          className="min-h-[100px] rounded-xl bg-input-background"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="business@example.com"
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://www.example.com"
            className="h-12 rounded-xl bg-input-background"
          />
        </div>
      </div>
    </div>
  );
}
