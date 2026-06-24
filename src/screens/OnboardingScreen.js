import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import PluginLogo from '../components/PluginLogo';
import { colors, weights } from '../styles/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'map-outline',
    title: 'Encuentra cargadores\ncerca de ti',
    subtitle: 'Miles de estaciones disponibles\nen tiempo real.',
    gradientColors: ['rgba(0,186,255,0.18)', 'rgba(0,186,255,0.04)'],
    iconColor: colors.cyan,
  },
  {
    id: '2',
    icon: 'flash-outline',
    title: 'Carga inteligente\nsin filas',
    subtitle: 'Reserva con anticipación y llega\ncuando tu turno esté listo.',
    gradientColors: ['rgba(0,186,255,0.12)', 'rgba(0,255,140,0.12)'],
    iconColor: '#00D4A0',
  },
  {
    id: '3',
    icon: 'wallet-outline',
    title: 'Paga fácil,\ncarga más',
    subtitle: 'Wallet integrado con escrow\ny recibo digital al instante.',
    gradientColors: ['rgba(0,255,140,0.18)', 'rgba(0,255,140,0.04)'],
    iconColor: colors.green,
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

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header: logo + skip */}
      <View style={styles.header}>
        <PluginLogo variant="wordmark" size={0.45} />
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.skipText}>Omitir</Text>
        </TouchableOpacity>
      </View>

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
            {/* Orb glassmorphism con gradiente de la slide */}
            <View style={styles.orbOuter}>
              <LinearGradient
                colors={item.gradientColors}
                style={styles.orbGradient}
              >
                <View style={[styles.orbInner, { borderColor: item.iconColor + '55' }]}>
                  <LinearGradient
                    colors={['#00BAFF', '#00FF8C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconCircle}
                  >
                    <Ionicons name={item.icon} size={40} color="#050A15" />
                  </LinearGradient>
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots animados con gradiente */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 22, 6],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View key={i} style={{ width: dotWidth, opacity }}>
              <LinearGradient
                colors={['#00BAFF', '#00FF8C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dot}
              />
            </Animated.View>
          );
        })}
      </View>

      {/* CTA */}
      <GradientButton
        label={currentIndex < SLIDES.length - 1 ? 'Siguiente' : 'Comenzar'}
        onPress={handleNext}
        style={{ width: width - 48, marginBottom: insets.bottom + 24 }}
        icon={
          <Ionicons
            name={currentIndex < SLIDES.length - 1 ? 'arrow-forward' : 'flash'}
            size={18}
            color="#050A15"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 8,
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
    paddingTop: 32,
  },
  orbOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  orbGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },
  slideSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 36,
    marginBottom: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
