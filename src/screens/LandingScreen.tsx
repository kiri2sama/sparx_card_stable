import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../styles/ThemeProvider';

const { width } = Dimensions.get('window');

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    // Navigate to the card creation screen or sign up screen
    navigation.navigate('CardManagement' as never);
  };

  const handleLearnMore = () => {
    // Open documentation or more detailed information
    Linking.openURL('https://sparxcard.com/learn-more');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            Unified Physical-Digital Business Cards
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.textSecondary }]}>
            Connect your physical NFC cards with powerful digital profiles
          </Text>
          
          {/* Placeholder for NFC card mockup image */}
          <View style={[styles.heroImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="card-outline" size={80} color={theme.colors.primary} />
            <Text style={{ color: theme.colors.text, marginTop: 10 }}>NFC Card Mockup</Text>
          </View>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleGetStarted}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
              onPress={handleLearnMore}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Why Choose Our NFC Business Cards?
          </Text>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Ionicons name="phone-portrait-outline" size={40} color={theme.colors.primary} />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Digital + Physical</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Seamlessly blend physical NFC cards with digital profiles for a modern networking experience
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Ionicons name="analytics-outline" size={40} color={theme.colors.primary} />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Lead Generation</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Track engagement and gather insights with built-in analytics for your business cards
              </Text>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <View style={[styles.featureCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Ionicons name="share-social-outline" size={40} color={theme.colors.primary} />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Easy Sharing</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Share your digital card via email, text, social media, or with a simple tap of your NFC card
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: theme.colors.cardBackground }]}>
              <Ionicons name="people-outline" size={40} color={theme.colors.primary} />
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Team Management</Text>
              <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                Create and manage cards for your entire team with consistent branding and permissions
              </Text>
            </View>
          </View>
        </View>
        
        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            How It Works
          </Text>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Create Your Digital Card</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                Design your digital business card with our easy-to-use editor. Add your contact info, social links, and customize the look.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Order Your NFC Products</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                Choose from our selection of NFC cards, keychains, or stickers. We'll program them with your digital profile.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Share & Track</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                Share your card with a tap or digitally. Track views, clicks, and engagement through your dashboard.
              </Text>
            </View>
          </View>
        </View>
        
        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Our NFC Products
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsScrollView}
          >
            <View style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="card-outline" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.productTitle, { color: theme.colors.text }]}>NFC Business Cards</Text>
              <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]}>
                Premium cards with embedded NFC technology
              </Text>
              <Text style={[styles.productPrice, { color: theme.colors.primary }]}>From $49.99</Text>
            </View>
            
            <View style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="key-outline" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.productTitle, { color: theme.colors.text }]}>NFC Keychains</Text>
              <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]}>
                Durable keychains with your digital profile
              </Text>
              <Text style={[styles.productPrice, { color: theme.colors.primary }]}>From $29.99</Text>
            </View>
            
            <View style={[styles.productCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={[styles.productImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="pricetag-outline" size={40} color={theme.colors.primary} />
              </View>
              <Text style={[styles.productTitle, { color: theme.colors.text }]}>NFC Stickers</Text>
              <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]}>
                Adhesive NFC stickers for any surface
              </Text>
              <Text style={[styles.productPrice, { color: theme.colors.primary }]}>From $19.99</Text>
            </View>
          </ScrollView>
        </View>
        
        {/* CTA Section */}
        <View style={[styles.ctaSection, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.ctaTitle}>Ready to Modernize Your Networking?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of professionals using our NFC business card solution
          </Text>
          
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: 'white' }]}
            onPress={handleGetStarted}
          >
            <Text style={[styles.ctaButtonText, { color: theme.colors.primary }]}>Get Started Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  heroImage: {
    width: width * 0.8,
    height: 200,
    marginBottom: 24,
  },
  heroButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  howItWorksSection: {
    padding: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
  },
  productsSection: {
    padding: 20,
  },
  productsScrollView: {
    paddingBottom: 16,
  },
  productCard: {
    width: 200,
    padding: 16,
    borderRadius: 8,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaSection: {
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandingScreen;