import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, weights } from '../styles/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'map-outline',
    title: 'Encuentra cargadores\ncerca de ti',
    subtitle: 'Miles de estaciones disponibles\nen tiempo real.',
  },
  {
    id: '2',
    icon: 'flash-outline',
    title: 'Carga inteligente\nsin filas',
    subtitle: 'Reserva con anticipación y llega\ncuando tu turno esté listo.',
  },
  {
    id: '3',
    icon: 'wallet-outline',
    title: 'Paga fácil,\ncarga más',
    subtitle: 'Wallet integrado con escrow\ny recibo digital al instante.',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Logo */}
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Ionicons name="flash" size={20} color={colors.green} />
        </View>
        <Text style={styles.logoText}>plügin</Text>
      </View>

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Glow orb */}
            <View style={styles.orbContainer}>
              <View style={styles.orbOuter}>
                <View style={styles.orbMiddle}>
                  <View style={styles.orbInner}>
                    <Ionicons name={item.icon} size={44} color={colors.green} />
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={[styles.ctaButton, { marginBottom: insets.bottom + 24 }]}
        onPress={handleNext}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>
          {currentIndex < SLIDES.length - 1 ? 'Siguiente' : 'Comenzar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.greenDim,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 18 },
  logoText: {
    fontSize: 22,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 24,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: weights.medium,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 48,
  },
  orbContainer: {
    marginBottom: 40,
  },
  orbOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,255,140,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbMiddle: {
    width: 152,
    height: 152,
    borderRadius: 76,
    backgroundColor: 'rgba(0,186,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,255,140,0.12)',
    borderWidth: 1.5,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideIcon: { fontSize: 40 },
  slideTitle: {
    fontSize: 26,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  ctaButton: {
    width: width - 48,
    height: 54,
    borderRadius: radius['2xl'],
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: weights.bold,
    color: '#050A15',
    letterSpacing: 0.3,
  },
});
