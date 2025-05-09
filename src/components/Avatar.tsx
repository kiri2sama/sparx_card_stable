import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circle' | 'rounded' | 'square';

export interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  icon?: string;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  gradientColors?: string[];
  showBadge?: boolean;
  badgeColor?: string;
  badgeSize?: number;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  badgeContent?: React.ReactNode;
  testID?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  variant = 'circle',
  style,
  imageStyle,
  textStyle,
  onPress,
  icon,
  iconColor,
  backgroundColor,
  borderColor,
  borderWidth,
  gradientColors,
  showBadge = false,
  badgeColor,
  badgeSize,
  badgePosition = 'bottom-right',
  badgeContent,
  testID,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Get size dimensions
  const getSizeDimensions = (): { 
    size: number; 
    fontSize: number;
    iconSize: number;
  } => {
    switch (size) {
      case 'xs':
        return { size: 24, fontSize: 10, iconSize: 12 };
      case 'sm':
        return { size: 32, fontSize: 12, iconSize: 16 };
      case 'lg':
        return { size: 64, fontSize: 24, iconSize: 32 };
      case 'xl':
        return { size: 96, fontSize: 36, iconSize: 48 };
      case '2xl':
        return { size: 128, fontSize: 48, iconSize: 64 };
      case 'md':
      default:
        return { size: 48, fontSize: 18, iconSize: 24 };
    }
  };
  
  // Get border radius based on variant
  const getBorderRadius = (sizeValue: number): number => {
    switch (variant) {
      case 'square':
        return 0;
      case 'rounded':
        return sizeValue * 0.16; // ~16% of size
      case 'circle':
      default:
        return sizeValue / 2; // 50% of size
    }
  };
  
  // Get badge size
  const getBadgeSize = (defaultSize: number): number => {
    if (badgeSize) return badgeSize;
    return defaultSize * 0.33; // ~33% of avatar size
  };
  
  // Get badge position
  const getBadgePosition = (sizeValue: number, badgeSizeValue: number): { top?: number; right?: number; bottom?: number; left?: number } => {
    const offset = borderWidth || 0;
    
    switch (badgePosition) {
      case 'top-left':
        return { top: -badgeSizeValue / 3 + offset, left: -badgeSizeValue / 3 + offset };
      case 'bottom-left':
        return { bottom: -badgeSizeValue / 3 + offset, left: -badgeSizeValue / 3 + offset };
      case 'bottom-right':
        return { bottom: -badgeSizeValue / 3 + offset, right: -badgeSizeValue / 3 + offset };
      case 'top-right':
      default:
        return { top: -badgeSizeValue / 3 + offset, right: -badgeSizeValue / 3 + offset };
    }
  };
  
  // Get initials from name
  const getInitials = (): string => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  const dimensions = getSizeDimensions();
  const borderRadiusValue = getBorderRadius(dimensions.size);
  const badgeSizeValue = getBadgeSize(dimensions.size);
  const badgePositionStyle = getBadgePosition(dimensions.size, badgeSizeValue);
  
  // Determine background color
  const bgColor = backgroundColor || theme.colors.primary;
  
  // Determine if we should show the image, initials, or icon
  const showImage = source && !hasError;
  const showInitials = !showImage && name;
  const showIcon = !showImage && !showInitials && icon;
  
  // Container styles
  const containerStyle: ViewStyle = {
    width: dimensions.size,
    height: dimensions.size,
    borderRadius: borderRadiusValue,
    backgroundColor: showImage ? 'transparent' : bgColor,
    borderWidth: borderWidth,
    borderColor: borderColor || theme.colors.border,
    overflow: 'hidden',
  };
  
  // Badge styles
  const badgeStyle: ViewStyle = {
    position: 'absolute',
    width: badgeSizeValue,
    height: badgeSizeValue,
    borderRadius: badgeSizeValue / 2,
    backgroundColor: badgeColor || theme.colors.success,
    ...badgePositionStyle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  };
  
  // Render content
  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator 
          color={theme.colors.background} 
          size={dimensions.size < 48 ? 'small' : 'large'} 
        />
      );
    }
    
    if (showImage) {
      return (
        <Image
          source={{ uri: source as string }}
          style={[
            styles.image,
            { width: dimensions.size, height: dimensions.size },
            imageStyle,
          ]}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      );
    }
    
    if (showInitials) {
      return (
        <Text
          style={[
            styles.text,
            { fontSize: dimensions.fontSize, color: '#FFFFFF' },
            textStyle,
          ]}
        >
          {getInitials()}
        </Text>
      );
    }
    
    if (showIcon) {
      return (
        <Ionicons
          name={icon as any}
          size={dimensions.iconSize}
          color={iconColor || '#FFFFFF'}
        />
      );
    }
    
    // Default fallback
    return (
      <Ionicons
        name="person"
        size={dimensions.iconSize}
        color={iconColor || '#FFFFFF'}
      />
    );
  };
  
  // Wrap content with gradient if needed
  const wrappedContent = gradientColors && gradientColors.length >= 2 ? (
    <LinearGradient
      colors={gradientColors as readonly [string, string, ...string[]]}
      style={styles.gradient}
    >
      {renderContent()}
    </LinearGradient>
  ) : (
    renderContent()
  );
  
  // Wrap with TouchableOpacity if onPress is provided
  const AvatarComponent = onPress ? TouchableOpacity : View;
  const touchableProps = onPress ? {
    onPress,
    activeOpacity: 0.7,
    accessibilityRole: 'button',
  } : {};
  
  return (
    <AvatarComponent
      style={[containerStyle, style]}
      testID={testID}
      {...touchableProps}
    >
      {wrappedContent}
      
      {showBadge && (
        <View style={badgeStyle}>
          {badgeContent}
        </View>
      )}
    </AvatarComponent>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  text: {
    fontWeight: '600',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Avatar;