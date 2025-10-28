export type ProductType = 'POS' | 'SoftPOS';

export type Nationality = 'Iraqi' | 'Non-Iraqi';

export type MaritalStatus = 'Married' | 'Single' | 'Divorced' | 'Widow';

export type Gender = 'Male' | 'Female';

export interface DocumentData {
  type: 'national_id' | 'passport' | 'residential_id';
  frontImage?: string;
  backImage?: string;
  extractedData?: {
    fullName?: string;
    motherName?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    nationalId?: string;
    passportNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    gender?: Gender;
  };
}

export interface PersonalInfo {
  gender: Gender;
  firstName: string;
  middleName: string;
  lastName: string;
  motherName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  phoneNumber: string;
  companyName: string;
  tradingName: string;
  nationalIdOrPassport: string;
  issueDate: string;
  expiryDate: string;
  maritalStatus: MaritalStatus;
}

export interface AddressInfo {
  governorate: string;
  fullAddress: string;
  email: string;
  website?: string;
}

export interface BankingInfo {
  bankName: string;
  accountNumber: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  url?: string;
  data?: string;
}

export interface MerchantApplication {
  // Product selection
  productType: ProductType;
  
  // Nationality and documents
  nationality: Nationality;
  documents: DocumentData[];
  
  // Personal information
  personalInfo: PersonalInfo;
  
  // Address
  addressInfo: AddressInfo;
  
  // Banking (optional)
  bankingInfo?: BankingInfo;
  
  // Business documents
  businessDocuments: UploadedDocument[];
  
  // Sector
  merchantSector: string;
  
  // POS information
  numberOfBranches: number;
  numberOfPOS: number;
  
  // Verification
  faceVerified: boolean;
  signatureData?: string;
  termsAccepted: boolean;
  
  // Metadata
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
}

export const IRAQI_GOVERNORATES = [
  'Baghdad',
  'Basra',
  'Nineveh',
  'Erbil',
  'Sulaymaniyah',
  'Duhok',
  'Anbar',
  'Diyala',
  'Karbala',
  'Najaf',
  'Wasit',
  'Saladin',
  'Kirkuk',
  'Babil',
  'Maysan',
  'Dhi Qar',
  'Al-Qadisiyyah',
  'Muthanna',
];

export const MERCHANT_SECTORS = [
  { value: 'oil_gas', label: 'Oil & Gas', icon: '⛽' },
  { value: 'energy', label: 'Energy', icon: '⚡' },
  { value: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { value: 'banking', label: 'Banking & Finance', icon: '🏦' },
  { value: 'it', label: 'Information Technology', icon: '💻' },
  { value: 'transport', label: 'Transportation', icon: '🚚' },
  { value: 'tourism', label: 'Tourism & Hospitality', icon: '🏨' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'real_estate', label: 'Real Estate', icon: '🏢' },
  { value: 'retail', label: 'Retail & Commerce', icon: '🛍️' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'media', label: 'Media & Entertainment', icon: '📺' },
  { value: 'environment', label: 'Environment', icon: '🌍' },
  { value: 'security', label: 'Security Services', icon: '🛡️' },
  { value: 'mining', label: 'Mining & Minerals', icon: '⛏️' },
  { value: 'automotive', label: 'Automotive', icon: '🚗' },
  { value: 'others', label: 'Others', icon: '📋' },
];
