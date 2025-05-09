import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../styles/ThemeProvider';

export type CardVariant = 'filled' | 'outlined' | 'elevated';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  borderColor?: string;
  fullWidth?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'filled',
  style,
  contentStyle,
  onPress,
  disabled = false,
  testID,
  elevation = 'md',
  borderRadius = 'md',
  backgroundColor,
  borderColor,
  fullWidth = false,
  padding = 'md',
}) => {
  const { theme } = useTheme();
  
  // Get variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: borderColor || theme.colors.border,
        };
      case 'elevated':
        return {
          backgroundColor: backgroundColor || theme.colors.card,
          ...getElevationStyle(elevation),
        };
      case 'filled':
      default:
        return {
          backgroundColor: backgroundColor || theme.colors.card,
        };
    }
  };
  
  // Get elevation style
  const getElevationStyle = (elevationLevel: CardProps['elevation']): ViewStyle => {
    if (elevationLevel === 'none') return {};
    
    const shadowMap = {
      sm: theme.shadows.sm,
      md: theme.shadows.md,
      lg: theme.shadows.lg,
      xl: theme.shadows.xl,
    };
    
    return shadowMap[elevationLevel || 'md'] || theme.shadows.md;
  };
  
  // Get border radius style
  const getBorderRadiusStyle = (radiusLevel: CardProps['borderRadius']): ViewStyle => {
    if (radiusLevel === 'none') return { borderRadius: 0 };
    
    const radiusMap = {
      sm: theme.borderRadius.sm,
      md: theme.borderRadius.md,
      lg: theme.borderRadius.lg,
      xl: theme.borderRadius.xl,
    };
    
    return { borderRadius: radiusMap[radiusLevel || 'md'] || theme.borderRadius.md };
  };
  
  // Get padding style
  const getPaddingStyle = (paddingLevel: CardProps['padding']): ViewStyle => {
    if (paddingLevel === 'none') return { padding: 0 };
    
    const paddingMap = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    
    return { padding: paddingMap[paddingLevel || 'md'] || theme.spacing.md };
  };
  
  const variantStyle = getVariantStyles();
  const borderRadiusStyle = getBorderRadiusStyle(borderRadius);
  const paddingStyle = getPaddingStyle(padding);
  
  const cardStyles = [
    styles.card,
    variantStyle,
    borderRadiusStyle,
    paddingStyle,
    fullWidth && styles.fullWidth,
    style,
  ];
  
  const CardComponent = onPress ? TouchableOpacity : View;
  const touchableProps = onPress
    ? {
        onPress,
        disabled,
        activeOpacity: 0.7,
        accessibilityRole: 'button',
      }
    : {};
  
  return (
    <CardComponent
      style={cardStyles}
      testID={testID}
      {...touchableProps}
    >
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flex: 1,
  },
});

export default Card;