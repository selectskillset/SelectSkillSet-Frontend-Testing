export interface CountryCode {
  id: string;
  country: string;
  code: string;
}

export const countryCodes: CountryCode[] = [
  { id: 'us', country: 'United States', code: '+1' },
  { id: 'ca', country: 'Canada', code: '+1-CA' },
  { id: 'uk', country: 'United Kingdom', code: '+44' },
  { id: 'in', country: 'India', code: '+91' },
  { id: 'au', country: 'Australia', code: '+61' },
  { id: 'de', country: 'Germany', code: '+49' },
  { id: 'fr', country: 'France', code: '+33' },
  { id: 'jp', country: 'Japan', code: '+81' },
  { id: 'cn', country: 'China', code: '+86' },
  { id: 'br', country: 'Brazil', code: '+55' },
];