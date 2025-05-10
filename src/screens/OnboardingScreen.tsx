import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/ThemeProvider';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const onboardingSteps = [
    {
      id: '1',
      title: 'Welcome to SparX Card',
      description: 'Your digital business card solution for modern networking',
      icon: 'card-outline',
    },
    {
      id: '2',
      title: 'Create Your Digital Card',
      description: 'Design a professional business card that represents you',
      icon: 'create-outline',
    },
    {
      id: '3',
      title: 'Share Instantly',
      description: 'Share your contact info via NFC, QR code, or social media',
      icon: 'share-social-outline',
    },
    {
      id: '4',
      title: 'Track Engagement',
      description: 'See who viewed your card and track your networking success',
      icon: 'analytics-outline',
    },
    {
      id: '5',
      title: 'Manage Your Contacts',
      description: 'Organize leads and follow up with potential connections',
      icon: 'people-outline',
    },
  ];
  
  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };
  
  const handleSkip = () => {
    completeOnboarding();
  };
  
  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };
  
  const renderItem = ({ item, index }: { item: typeof onboardingSteps[0], index: number }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: 'clamp',
    });
    
    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
            <Ionicons name={item.icon as any} size={80} color={theme.colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
        </Animated.View>
      </View>
    );
  };
  
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {onboardingSteps.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  { 
                    width: dotWidth, 
                    opacity, 
                    backgroundColor: theme.colors.primary 
                  },
                ]}
              />
            );
          })}
        </View>
        
        <View style={styles.buttonsContainer}>
          {currentIndex < onboardingSteps.length - 1 ? (
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
              accessibilityLabel="Skip onboarding"
              accessibilityRole="button"
            >
              <Text style={[styles.skipButtonText, { color: theme.colors.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButton} />
          )}
          
          <TouchableOpacity 
            style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleNext}
            accessibilityLabel={currentIndex === onboardingSteps.length - 1 ? "Get Started" : "Next"}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingSteps.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.nextButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.primaryLight + '10']}
        style={styles.gradient}
      >
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />
        
        {renderPagination()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  nextButtonIcon: {
    marginLeft: 4,
  },
});

export default OnboardingScreen;