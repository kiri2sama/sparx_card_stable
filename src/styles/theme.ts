import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Facebook-inspired color palette
// Primary palette - Facebook blue
const primaryHue = 220; // Facebook blue
const primaryPalette = {
  50: `hsl(${primaryHue}, 100%, 97%)`,
  100: `hsl(${primaryHue}, 94%, 94%)`,
  200: `hsl(${primaryHue}, 92%, 85%)`,
  300: `hsl(${primaryHue}, 90%, 76%)`,
  400: `hsl(${primaryHue}, 88%, 67%)`,
  500: '#1877F2', // Facebook primary blue
  600: '#166FE5', // Darker Facebook blue
  700: '#0E5FCC', // Even darker blue
  800: '#0A4DA8', // Very dark blue
  900: '#073D89', // Extremely dark blue
};

// Secondary palette - Facebook accent colors
const secondaryPalette = {
  50: '#F5FBFF',
  100: '#E4F4FF',
  200: '#C4E7FF',
  300: '#A3D9FF',
  400: '#7EC2FF',
  500: '#4599FF', // Facebook messenger blue
  600: '#2D7FE0',
  700: '#1A66C2',
  800: '#0E4D9E',
  900: '#073D89',
};

// Accent colors for visual interest and UI elements
const accentColors = {
  success: {
    light: '#36A420', // Facebook green
    default: '#2D9810',
    dark: '#1F7A08',
  },
  warning: {
    light: '#F7B928', // Facebook yellow/orange
    default: '#F5A623',
    dark: '#E09112',
  },
  error: {
    light: '#FA383E', // Facebook red
    default: '#E41E3F',
    dark: '#C70A28',
  },
  info: {
    light: '#4599FF', // Facebook light blue
    default: '#1877F2', // Facebook blue
    dark: '#166FE5',
  },
};

// Neutral colors for text, backgrounds, and UI elements
const neutralColors = {
  50: '#FFFFFF', // Pure white
  100: '#F9FAFB', // Off-white
  200: '#F2F3F5', // Facebook light gray (light mode background)
  300: '#E4E6EB', // Facebook medium light gray
  400: '#BCC0C4', // Facebook medium gray
  500: '#8A8D91', // Facebook medium dark gray
  600: '#65676B', // Facebook dark gray (light mode text)
  700: '#3E4042', // Facebook darker gray
  800: '#242526', // Facebook dark mode card
  900: '#18191A', // Facebook dark mode background
};

// Gradients for cards and backgrounds
const gradients = {
  primary: [primaryPalette[500], primaryPalette[700]],
  secondary: [secondaryPalette[500], secondaryPalette[700]],
  success: [accentColors.success.light, accentColors.success.dark],
  warning: [accentColors.warning.light, accentColors.warning.dark],
  error: [accentColors.error.light, accentColors.error.dark],
  info: [accentColors.info.light, accentColors.info.dark],
  cool: ['#4599FF', '#1877F2'], // Facebook blues
  warm: ['#F7B928', '#FA383E'], // Yellow to red
  night: ['#242526', '#18191A'], // Facebook dark mode
  dawn: ['#F9FAFB', '#F2F3F5'], // Facebook light mode
};

// Card templates with Facebook-inspired color combinations
const cardTemplates = [
  {
    id: 'facebook-blue',
    name: 'Facebook Blue',
    colors: [primaryPalette[500], primaryPalette[700]],
    textColor: '#FFFFFF',
    layout: 'horizontal',
  },
  {
    id: 'messenger-blue',
    name: 'Messenger Blue',
    colors: [secondaryPalette[500], secondaryPalette[700]],
    textColor: '#FFFFFF',
    layout: 'horizontal',
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    colors: ['#242526', '#18191A'],
    textColor: '#FFFFFF',
    layout: 'horizontal',
  },
  {
    id: 'light-mode',
    name: 'Light Mode',
    colors: ['#F9FAFB', '#F2F3F5'],
    textColor: '#050505',
    layout: 'horizontal',
  },
  {
    id: 'facebook-green',
    name: 'Facebook Green',
    colors: [accentColors.success.light, accentColors.success.dark],
    textColor: '#FFFFFF',
    layout: 'horizontal',
  },
  {
    id: 'facebook-red',
    name: 'Facebook Red',
    colors: [accentColors.error.light, accentColors.error.dark],
    textColor: '#FFFFFF',
    layout: 'horizontal',
  },
  {
    id: 'facebook-yellow',
    name: 'Facebook Yellow',
    colors: [accentColors.warning.light, accentColors.warning.dark],
    textColor: '#050505',
    layout: 'horizontal',
  },
  {
    id: 'vertical-blue',
    name: 'Vertical Blue',
    colors: [primaryPalette[500], primaryPalette[700]],
    textColor: '#FFFFFF',
    layout: 'vertical',
  },
  {
    id: 'vertical-dark',
    name: 'Vertical Dark',
    colors: ['#242526', '#18191A'],
    textColor: '#FFFFFF',
    layout: 'vertical',
  },
  {
    id: 'vertical-light',
    name: 'Vertical Light',
    colors: ['#F9FAFB', '#F2F3F5'],
    textColor: '#050505',
    layout: 'vertical',
  },
];

// Typography system with perfect vertical rhythm
const typography = {
  fontFamily: {
    // System fonts for native feel and performance
    sans: Platform.OS === 'ios' 
      ? 'SF Pro Display' 
      : 'Roboto',
    serif: Platform.OS === 'ios' 
      ? 'New York' 
      : 'Noto Serif',
    mono: Platform.OS === 'ios' 
      ? 'SF Mono' 
      : 'Roboto Mono',
    // Legacy support
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
    bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
    // Legacy support
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    // Legacy support
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

// Spacing system based on 4px grid for perfect alignment
const spacingScale = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
};

// Legacy spacing support
const spacing = {
  ...spacingScale,
  // Legacy support
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius system for consistent UI elements
const borderRadiusScale = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Legacy border radius support
const borderRadius = {
  ...borderRadiusScale,
  // Legacy support
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

// Shadows for depth and elevation
const shadowsScale = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Legacy shadows support
const shadows = Platform.OS === 'ios' 
  ? {
      ...shadowsScale,
      // Legacy support
      sm: shadowsScale.sm,
      md: shadowsScale.md,
      lg: shadowsScale.lg,
    }
  : {
      ...shadowsScale,
      // Legacy support
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 8 },
    };

// Screen dimensions
const screen = {
  width,
  height,
  isSmall: width < 375,
  isMedium: width >= 375 && width < 768,
  isLarge: width >= 768,
};

// Animation presets for consistent motion design
const animationScale = {
  durations: {
    fastest: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slowest: 800,
  },
  easings: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Legacy animation support
const animation = {
  ...animationScale.durations,
  easings: animationScale.easings,
};

// Z-index
const zIndex = {
  base: 1,
  card: 10,
  modal: 100,
  toast: 1000,
  tooltip: 1500,
  popover: 2000,
};

// Light theme colors (Facebook light mode)
const lightColors = {
  primary: primaryPalette[500], // Facebook blue
  primaryDark: primaryPalette[600],
  primaryLight: primaryPalette[400],
  
  secondary: secondaryPalette[500], // Messenger blue
  secondaryDark: secondaryPalette[600],
  secondaryLight: secondaryPalette[400],
  
  background: neutralColors[200], // Facebook light gray background
  backgroundDark: neutralColors[300],
  backgroundElevated: neutralColors[50], // White
  
  card: neutralColors[50], // White
  cardAlt: neutralColors[100],
  
  text: neutralColors[600], // Facebook dark gray text
  textSecondary: neutralColors[500],
  textLight: neutralColors[400],
  textInverted: neutralColors[50], // White
  
  border: neutralColors[300],
  borderLight: neutralColors[200],
  borderDark: neutralColors[400],
  
  divider: neutralColors[300],
  
  // Status colors
  success: accentColors.success.default,
  warning: accentColors.warning.default,
  error: accentColors.error.default,
  info: accentColors.info.default,
  
  // Semantic colors
  link: primaryPalette[500], // Facebook blue
  focus: primaryPalette[500],
  disabled: neutralColors[300],
  placeholder: neutralColors[400],
};

// Dark theme colors (Facebook dark mode)
const darkColors = {
  primary: primaryPalette[500], // Keep Facebook blue
  primaryDark: primaryPalette[600],
  primaryLight: primaryPalette[400],
  
  secondary: secondaryPalette[500], // Messenger blue
  secondaryDark: secondaryPalette[600],
  secondaryLight: secondaryPalette[400],
  
  background: neutralColors[900], // Facebook dark mode background
  backgroundDark: '#000000',
  backgroundElevated: neutralColors[800], // Facebook dark mode card
  
  card: neutralColors[800], // Facebook dark mode card
  cardAlt: neutralColors[700],
  
  text: neutralColors[200], // Facebook light gray text in dark mode
  textSecondary: neutralColors[300],
  textLight: neutralColors[400],
  textInverted: neutralColors[600], // Dark text on light backgrounds
  
  border: neutralColors[700],
  borderLight: neutralColors[600],
  borderDark: neutralColors[600],
  
  divider: neutralColors[700],
  
  // Status colors
  success: accentColors.success.light,
  warning: accentColors.warning.light,
  error: accentColors.error.light,
  info: accentColors.info.light,
  
  // Semantic colors
  link: primaryPalette[400], // Lighter blue for dark mode
  focus: primaryPalette[400],
  disabled: neutralColors[600],
  placeholder: neutralColors[500],
};

// Light theme
const lightTheme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  screen,
  animation,
  zIndex,
  gradients,
  cardTemplates,
};

// Dark theme
const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  screen,
  animation,
  zIndex,
  gradients,
  cardTemplates,
};

// Export theme (legacy support)
export const theme = lightTheme;

// Export themes
export { lightTheme, darkTheme };

// Type definitions
export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';