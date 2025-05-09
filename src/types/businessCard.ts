export type BusinessCard = {
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
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    github?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
    pinterest?: string;
    medium?: string;
    // Add more as needed
  };
  // Unique identifier for the card
  id?: string;
  // When the card was created/updated
  createdAt?: number;
  updatedAt?: number;
  // For analytics
  views?: number;
  shares?: number;
  // For template customization
  template?: {
    id: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    layout: string;
  };
};