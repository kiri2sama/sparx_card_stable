import React, { useState, useRef, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  hintStyle?: StyleProp<TextStyle>;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  floatingLabel?: boolean;
  rounded?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  hintStyle,
  variant = 'outlined',
  size = 'md',
  fullWidth = false,
  isDisabled = false,
  isRequired = false,
  floatingLabel = false,
  rounded = false,
  value,
  onFocus,
  onBlur,
  placeholder,
  ...props
}, ref) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Animation values for floating label
  const labelPositionAnim = useRef(new Animated.Value(
    value || isFocused ? 1 : 0
  )).current;
  
  // Handle focus
  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (floatingLabel) {
      Animated.timing(labelPositionAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onFocus && onFocus(e);
  };
  
  // Handle blur
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (floatingLabel && !value) {
      Animated.timing(labelPositionAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur && onBlur(e);
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Get variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: isFocused 
            ? theme.colors.backgroundElevated 
            : theme.colors.backgroundDark,
          borderWidth: 1,
          borderColor: isFocused 
            ? theme.colors.primary 
            : 'transparent',
        };
      case 'underlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: isFocused 
            ? theme.colors.primary 
            : theme.colors.border,
          borderRadius: 0,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isFocused 
            ? theme.colors.primary 
            : theme.colors.border,
        };
    }
  };
  
  // Get size styles
  const getSizeStyles = (): { 
    container: ViewStyle; 
    input: TextStyle;
    label: TextStyle;
    iconSize: number;
  } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            minHeight: 40,
            borderRadius: rounded ? 20 : 6,
          },
          input: {
            fontSize: 14,
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
          label: {
            fontSize: 12,
          },
          iconSize: 16,
        };
      case 'lg':
        return {
          container: {
            minHeight: 56,
            borderRadius: rounded ? 28 : 10,
          },
          input: {
            fontSize: 18,
            paddingVertical: 16,
            paddingHorizontal: 20,
          },
          label: {
            fontSize: 16,
          },
          iconSize: 22,
        };
      case 'md':
      default:
        return {
          container: {
            minHeight: 48,
            borderRadius: rounded ? 24 : 8,
          },
          input: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
          label: {
            fontSize: 14,
          },
          iconSize: 18,
        };
    }
  };
  
  // Get disabled styles
  const getDisabledStyles = (): { container: ViewStyle; input: TextStyle } => {
    return {
      container: {
        backgroundColor: theme.colors.backgroundDark,
        borderColor: theme.colors.border,
        opacity: 0.6,
      },
      input: {
        color: theme.colors.textSecondary,
      },
    };
  };
  
  // Get error styles
  const getErrorStyles = (): { container: ViewStyle } => {
    return {
      container: {
        borderColor: theme.colors.error,
      },
    };
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const disabledStyles = isDisabled ? getDisabledStyles() : null;
  const errorStyles = error ? getErrorStyles() : null;
  
  // Combine all styles
  const containerStyles = [
    styles.container,
    sizeStyles.container,
    variantStyles,
    fullWidth && styles.fullWidth,
    disabledStyles?.container,
    errorStyles?.container,
    containerStyle,
  ];
  
  const inputStyles = [
    styles.input,
    sizeStyles.input,
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    disabledStyles?.input,
    inputStyle,
  ];
  
  // Floating label animation interpolation
  const labelTop = labelPositionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      variant === 'underlined' ? 12 : sizeStyles.input.paddingVertical || 12,
      variant === 'underlined' ? -10 : -10,
    ],
  });
  
  const labelFontSize = labelPositionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeStyles.label.fontSize || 14, (sizeStyles.label.fontSize || 14) - 2],
  });
  
  const labelColor = labelPositionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.textSecondary, theme.colors.primary],
  });
  
  // Determine if we should show the password toggle icon
  const isPassword = props.secureTextEntry && !rightIcon;
  const effectiveRightIcon = isPassword 
    ? (isPasswordVisible ? 'eye-off-outline' : 'eye-outline')
    : rightIcon;
  
  const effectiveSecureTextEntry = isPassword ? !isPasswordVisible : props.secureTextEntry;
  
  // Determine effective placeholder
  const effectivePlaceholder = floatingLabel ? '' : placeholder;
  
  return (
    <View style={[styles.wrapper, fullWidth && styles.fullWidth]}>
      {/* Label (non-floating) */}
      {label && !floatingLabel && (
        <Text 
          style={[
            styles.label, 
            sizeStyles.label, 
            { color: theme.colors.textSecondary },
            labelStyle,
          ]}
        >
          {label}
          {isRequired && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}
      
      <View style={containerStyles}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon as any} 
              size={sizeStyles.iconSize} 
              color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </View>
        )}
        
        {/* Floating Label */}
        {label && floatingLabel && (
          <Animated.Text
            style={[
              styles.floatingLabel,
              {
                top: labelTop,
                fontSize: labelFontSize,
                color: error ? theme.colors.error : labelColor,
                left: leftIcon ? 40 : sizeStyles.input.paddingHorizontal || 16,
              },
              labelStyle,
            ]}
          >
            {label}
            {isRequired && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Animated.Text>
        )}
        
        {/* Input */}
        <TextInput
          ref={ref}
          style={inputStyles}
          placeholderTextColor={theme.colors.textSecondary}
          placeholder={effectivePlaceholder}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!isDisabled}
          secureTextEntry={effectiveSecureTextEntry}
          {...props}
        />
        
        {/* Right Icon */}
        {effectiveRightIcon && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={isPassword ? togglePasswordVisibility : onRightIconPress}
            disabled={isDisabled}
          >
            <Ionicons 
              name={effectiveRightIcon as any} 
              size={sizeStyles.iconSize} 
              color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Error Message */}
      {error && (
        <Text 
          style={[
            styles.error, 
            { color: theme.colors.error },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
      
      {/* Hint Text */}
      {hint && !error && (
        <Text 
          style={[
            styles.hint, 
            { color: theme.colors.textSecondary },
            hintStyle,
          ]}
        >
          {hint}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    flex: 1,
    color: '#000',
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  label: {
    marginBottom: 6,
  },
  floatingLabel: {
    position: 'absolute',
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    left: 16,
    zIndex: 1,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;