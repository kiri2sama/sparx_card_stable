import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

export type BadgeVariant = 'solid' | 'outline' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  status?: BadgeStatus;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  rounded?: boolean;
  testID?: string;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'solid',
  size = 'md',
  status = 'default',
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  iconStyle,
  backgroundColor,
  textColor,
  borderColor,
  rounded = true,
  testID,
}) => {
  const { theme } = useTheme();
  
  // Get status color
  const getStatusColor = (): string => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      case 'default':
      default:
        return theme.colors.primary;
    }
  };
  
  // Get variant styles
  const getVariantStyles = (): { 
    backgroundColor: string; 
    textColor: string;
    borderColor: string;
    borderWidth: number;
  } => {
    const statusColor = getStatusColor();
    
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          textColor: statusColor,
          borderColor: statusColor,
          borderWidth: 1,
        };
      case 'subtle':
        return {
          backgroundColor: `${statusColor}20`, // 20% opacity
          textColor: statusColor,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'solid':
      default:
        return {
          backgroundColor: statusColor,
          textColor: '#FFFFFF',
          borderColor: 'transparent',
          borderWidth: 0,
        };
    }
  };
  
  // Get size styles
  const getSizeStyles = (): { 
    paddingVertical: number; 
    paddingHorizontal: number;
    fontSize: number;
    iconSize: number;
    borderRadius: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          fontSize: 10,
          iconSize: 10,
          borderRadius: rounded ? 12 : 4,
        };
      case 'lg':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          iconSize: 16,
          borderRadius: rounded ? 20 : 8,
        };
      case 'md':
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
          iconSize: 14,
          borderRadius: rounded ? 16 : 6,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  
  // Override colors if provided
  const finalBackgroundColor = backgroundColor || variantStyles.backgroundColor;
  const finalTextColor = textColor || variantStyles.textColor;
  const finalBorderColor = borderColor || variantStyles.borderColor;
  
  // Container styles
  const containerStyles = [
    styles.container,
    {
      backgroundColor: finalBackgroundColor,
      borderColor: finalBorderColor,
      borderWidth: variantStyles.borderWidth,
      borderRadius: sizeStyles.borderRadius,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
    },
    style,
  ];
  
  // Text styles
  const textStyles = [
    styles.text,
    {
      color: finalTextColor,
      fontSize: sizeStyles.fontSize,
    },
    textStyle,
  ];
  
  // Icon styles
  const iconStyles = [
    {
      color: finalTextColor,
      marginRight: iconPosition === 'left' && label ? 4 : 0,
      marginLeft: iconPosition === 'right' && label ? 4 : 0,
    },
    iconStyle,
  ];
  
  return (
    <View style={containerStyles} testID={testID}>
      {icon && iconPosition === 'left' && (
        <Ionicons
          name={icon as any}
          size={sizeStyles.iconSize}
          style={iconStyles}
        />
      )}
      
      {label && (
        <Text style={textStyles} numberOfLines={1}>
          {label}
        </Text>
      )}
      
      {icon && iconPosition === 'right' && (
        <Ionicons
          name={icon as any}
          size={sizeStyles.iconSize}
          style={iconStyles}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});

export default Badge;