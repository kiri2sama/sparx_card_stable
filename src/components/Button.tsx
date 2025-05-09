import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  loadingText?: string;
  rounded?: boolean;
  elevation?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  label,
  leftIcon,
  rightIcon,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  style,
  textStyle,
  iconColor,
  loadingText,
  rounded = false,
  elevation = true,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Get styles based on variant
  const getVariantStyles = (): { 
    container: ViewStyle; 
    text: TextStyle;
    icon: string;
  } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
          text: {
            color: '#FFFFFF',
          },
          icon: '#FFFFFF',
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.secondary,
          },
          text: {
            color: '#FFFFFF',
          },
          icon: '#FFFFFF',
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
            borderWidth: 1.5,
          },
          text: {
            color: theme.colors.primary,
          },
          icon: theme.colors.primary,
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            color: theme.colors.primary,
          },
          icon: theme.colors.primary,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.colors.error,
            borderColor: theme.colors.error,
          },
          text: {
            color: '#FFFFFF',
          },
          icon: '#FFFFFF',
        };
      case 'success':
        return {
          container: {
            backgroundColor: theme.colors.success,
            borderColor: theme.colors.success,
          },
          text: {
            color: '#FFFFFF',
          },
          icon: '#FFFFFF',
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
          text: {
            color: '#FFFFFF',
          },
          icon: '#FFFFFF',
        };
    }
  };
  
  // Get styles based on size
  const getSizeStyles = (): { 
    container: ViewStyle; 
    text: TextStyle;
    iconSize: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: rounded ? 16 : 6,
          },
          text: {
            fontSize: 14,
          },
          iconSize: 16,
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: rounded ? 28 : 10,
          },
          text: {
            fontSize: 18,
          },
          iconSize: 22,
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: rounded ? 22 : 8,
          },
          text: {
            fontSize: 16,
          },
          iconSize: 18,
        };
    }
  };
  
  // Get disabled styles
  const getDisabledStyles = (): { container: ViewStyle; text: TextStyle } => {
    return {
      container: {
        backgroundColor: isDarkMode ? theme.colors.disabled : theme.colors.backgroundDark,
        borderColor: isDarkMode ? theme.colors.disabled : theme.colors.backgroundDark,
        opacity: 0.6,
      },
      text: {
        color: isDarkMode ? theme.colors.textLight : theme.colors.textSecondary,
      },
    };
  };
  
  // Get elevation styles
  const getElevationStyles = (): ViewStyle => {
    if (!elevation) return {};
    
    return Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }) || {};
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const disabledStyles = getDisabledStyles();
  const elevationStyles = getElevationStyles();
  
  // Combine all styles
  const containerStyles = [
    styles.container,
    sizeStyles.container,
    variantStyles.container,
    fullWidth && styles.fullWidth,
    isDisabled && disabledStyles.container,
    elevation && elevationStyles,
    style,
  ];
  
  const textStyles = [
    styles.text,
    sizeStyles.text,
    variantStyles.text,
    isDisabled && disabledStyles.text,
    textStyle,
  ];
  
  // Determine icon color
  const finalIconColor = iconColor || variantStyles.icon;
  
  return (
    <TouchableOpacity
      style={containerStyles}
      disabled={isDisabled || isLoading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled || isLoading }}
      {...props}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} 
            size="small" 
          />
          {loadingText && <Text style={[textStyles, styles.loadingText]}>{loadingText}</Text>}
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <Ionicons 
              name={leftIcon as any} 
              size={sizeStyles.iconSize} 
              color={finalIconColor} 
              style={styles.leftIcon} 
            />
          )}
          
          {label && <Text style={textStyles}>{label}</Text>}
          
          {rightIcon && (
            <Ionicons 
              name={rightIcon as any} 
              size={sizeStyles.iconSize} 
              color={finalIconColor} 
              style={styles.rightIcon} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
});

export default Button;