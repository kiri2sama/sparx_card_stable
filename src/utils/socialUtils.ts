import { Linking } from 'react-native';
import { BusinessCard } from '../types/businessCard';

/**
 * Get the appropriate icon name for a social media platform
 * @param platform The social media platform identifier
 * @returns The Ionicons icon name for the platform
 */
export const getSocialIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    linkedin: 'logo-linkedin',
    twitter: 'logo-twitter',
    instagram: 'logo-instagram',
    facebook: 'logo-facebook',
    github: 'logo-github',
    youtube: 'logo-youtube',
    tiktok: 'logo-tiktok',
    snapchat: 'logo-snapchat',
    pinterest: 'logo-pinterest',
    medium: 'logo-medium',
    // Default icon for unknown platforms
    default: 'globe-outline'
  };
  
  return icons[platform] || icons.default;
};

/**
 * Format a display name for a social media platform
 * @param platform The social media platform identifier
 * @returns A formatted display name
 */
export const formatSocialPlatformName = (platform: string): string => {
  const names: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    instagram: 'Instagram',
    facebook: 'Facebook',
    github: 'GitHub',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    snapchat: 'Snapchat',
    pinterest: 'Pinterest',
    medium: 'Medium'
  };
  
  return names[platform] || capitalizeFirstLetter(platform);
};

/**
 * Capitalize the first letter of a string
 * @param text The input string
 * @returns The string with first letter capitalized
 */
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Open a social media profile URL
 * @param url The URL to open
 */
export const openSocialProfile = (url: string): void => {
  // Add https:// if not already present
  let formattedUrl = url;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  Linking.openURL(formattedUrl).catch(err => {
    console.error('Error opening social profile URL:', err);
  });
};

/**
 * Extract username from a social media URL
 * @param platform The social media platform
 * @param url The full URL
 * @returns The username portion of the URL
 */
export const extractSocialUsername = (platform: string, url: string): string => {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    switch (platform) {
      case 'twitter':
        return urlObj.pathname.split('/').filter(Boolean)[0] || '';
      case 'instagram':
        return urlObj.pathname.split('/').filter(Boolean)[0] || '';
      case 'linkedin':
        if (urlObj.pathname.includes('/in/')) {
          return urlObj.pathname.split('/in/')[1]?.split('/')[0] || '';
        }
        return urlObj.pathname.split('/').filter(Boolean)[1] || '';
      case 'github':
        return urlObj.pathname.split('/').filter(Boolean)[0] || '';
      case 'facebook':
        return urlObj.pathname.split('/').filter(Boolean)[0] || '';
      default:
        return urlObj.pathname.split('/').filter(Boolean)[0] || '';
    }
  } catch (error) {
    console.error('Error extracting social username:', error);
    return url;
  }
};

/**
 * Update the vCard format to include social media profiles
 * @param vcard The existing vCard string
 * @param socialProfiles The social profiles object
 * @returns Updated vCard string with social profiles
 */
export const addSocialProfilesToVCard = (vcard: string, socialProfiles?: BusinessCard['socialProfiles']): string => {
  if (!socialProfiles || Object.keys(socialProfiles).length === 0) {
    return vcard;
  }
  
  // Find the position to insert social profiles (before END:VCARD)
  const endPosition = vcard.lastIndexOf('END:VCARD');
  if (endPosition === -1) return vcard;
  
  const vcardStart = vcard.substring(0, endPosition);
  const vcardEnd = vcard.substring(endPosition);
  
  // Create social profile entries
  const socialEntries = Object.entries(socialProfiles).map(([platform, url]) => {
    // Format according to vCard 3.0 spec for URLs with types
    return `URL;TYPE=${platform.toUpperCase()}:${url}`;
  }).join('\n');
  
  // Combine everything
  return `${vcardStart}${socialEntries}\n${vcardEnd}`;
};