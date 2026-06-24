import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import mockStations from '../data/mockData';
import { formatCOP } from '../utils/format';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, weights, radius } from '../styles/theme';
import FloatingHeader from '../components/FloatingHeader';
import SearchBar from '../components/SearchBar';
import LocationButton from '../components/LocationButton';
import StationBottomSheet from '../components/StationBottomSheet';
import FilterBar from '../components/FilterBar';
import SearchModal from '../components/SearchModal';
import Sidebar from '../components/Sidebar';
import styles from '../styles/MapScreenStyles';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const INITIAL_REGION = {
  latitude: 10.995,
  longitude: -74.80,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

let MapView = null;
let Marker = null;
if (isNative) {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();
  const userRole = user?.role || 'conductor';
  const mapRef = useRef(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const walletBalance = user?.walletBalance || 0;

  const filteredStations = useCallback(() => {
    return mockStations.filter((s) => {
      if (activeFilter === 'free') return s.pricePerKWh === 0;
      if (activeFilter === 'paid') return s.pricePerKWh > 0;
      if (activeFilter === 'available') return s.available;
      return true;
    });
  }, [activeFilter]);

  const handleReserve = useCallback((station) => {
    setSheetVisible(false);
    navigation.navigate('Reservation', { station });
  }, [navigation]);

  const handleMapPress = useCallback((event) => {
    if (sheetVisible) { setSheetVisible(false); return; }
    const { coordinate } = event.nativeEvent;
    const threshold = 0.008;
    let nearest = null;
    let minDist = Infinity;
    for (const s of filteredStations()) {
      const d = Math.hypot(s.latitude - coordinate.latitude, s.longitude - coordinate.longitude);
      if (d < minDist) { minDist = d; nearest = s; }
    }
    if (nearest && minDist < threshold) {
      setSelectedStation(nearest);
      setSheetVisible(true);
    }
  }, [sheetVisible, filteredStations]);

  const renderStationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => { setSelectedStation(item); setSheetVisible(true); }}
      activeOpacity={0.7}
    >
      <View style={styles.stationCardLeft}>
        <View style={[styles.statusDot, { backgroundColor: item.available ? colors.green : colors.red }]} />
        <View style={styles.stationCardInfo}>
          <Text style={styles.stationCardName}>{item.name}</Text>
          <Text style={styles.stationCardAddress}>{item.address}</Text>
        </View>
      </View>
      <View style={styles.stationCardRight}>
        <Text style={styles.stationCardPrice}>
          {item.pricePerKWh === 0 ? 'Gratis' : formatCOP(item.pricePerKWh)}
        </Text>
        <Text style={styles.stationCardUnit}>/kWh</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isNative ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          customMapStyle={darkMapStyle}
          onPress={handleMapPress}
          mapPadding={{ top: 200, right: 0, bottom: sheetVisible ? 140 : 16, left: 0 }}
          showsUserLocation
          showsMyLocationButton={false}
          rotateEnabled={false}
          toolbarEnabled={false}
        >
          {filteredStations().map((station) => (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              tracksViewChanges={Platform.OS === 'android'}
            >
              <CustomMarker station={station} />
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackTitle}>plügin</Text>
          <Text style={styles.webFallbackSub}>Estaciones de carga cercanas</Text>
          <FlatList
            data={filteredStations()}
            keyExtractor={(item) => item.id}
            renderItem={renderStationCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Top UI */}
      <View style={[styles.topSection, { paddingTop: insets.top + 8 }]}>
        {/* Row: hamburger + wallet widget */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setSidebarOpen(true)}>
            <Text style={styles.menuButtonText}>☰</Text>
          </TouchableOpacity>

          {/* Wallet widget glassmorphism */}
          <View style={styles.walletWidget}>
            <Text style={styles.walletBalance}>{formatCOP(walletBalance)}</Text>
            <Text style={styles.walletLabel}>Saldo disponible</Text>
          </View>
        </View>

        <View style={styles.searchPadding}>
          <SearchBar
            onFocus={() => setShowSearch(true)}
            onLocationPress={() => {
              mapRef.current?.animateToRegion(INITIAL_REGION, 800);
            }}
          />
        </View>
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      <SearchModal
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectStation={(station) => { setSelectedStation(station); setSheetVisible(true); }}
      />

      <StationBottomSheet
        station={selectedStation}
        visible={sheetVisible}
        onReserve={handleReserve}
        userRole={userRole}
      />

      {!sheetVisible && (
        <View style={styles.locationWrapper}>
          <LocationButton onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 800)} />
        </View>
      )}

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}

function CustomMarker({ station }) {
  const isFree = station.pricePerKWh === 0;
  let bgColor;
  if (!station.available) bgColor = colors.red;
  else if (isFree) bgColor = colors.green;
  else bgColor = colors.cyan;

  return (
    <View style={styles.markerWrapper}>
      <View style={[styles.markerCard, { borderColor: bgColor }]}>
        <Text style={[styles.markerCardText, { color: bgColor }]}>
          {station.pricePerKWh === 0 ? 'Gratis' : formatCOP(station.pricePerKWh)}
        </Text>
      </View>
      <View style={styles.markerDotContainer}>
        <View style={[styles.markerPulse, { backgroundColor: bgColor }]} />
        <View style={[styles.markerBubble, { backgroundColor: bgColor }]} />
      </View>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#050A15' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A1525' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#A0AEC0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#0D1626' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#A0AEC0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#030810' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0D1626' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0D1626' }] },
  { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#050A15' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
];
