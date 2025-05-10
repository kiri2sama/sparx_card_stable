export interface BusinessCard {
  id?: string;
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
  additionalPhones?: string[];
  additionalEmails?: string[];
  additionalWebsites?: string[];
  socialProfiles?: Record<string, string>;
  template?: {
    id: string;
    colors: {
      primary: string;
      secondary?: string;
      background: string;
      text: string;
      accent: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    layout: 'horizontal' | 'vertical';
  };
  createdAt?: number;
  updatedAt?: number;
  analytics?: {
    views: number;
    shares: number;
    scans: number;
    lastViewed?: number;
  };
}