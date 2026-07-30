import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { listarEstaciones } from '../services/api/estaciones';
import { formatCOP } from '../utils/format';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, weights, radius } from '../styles/theme';
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
  // PROVIDER_GOOGLE se importa para forzar Google Maps en iOS también
  // En Android es el único provider disponible

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

  const [stations, setStations] = useState([]);

  useEffect(() => {
    listarEstaciones()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(s => ({
            id: s._id || s.id,
            name: s.name,
            address: s.address,
            latitude: s.latitude,
            longitude: s.longitude,
            available: s.online !== false,
            pricePerKWh: s.price_per_kwh || 0,
            power: s.power || '—',
            connectors: s.connectors || [],
            rating: s.rating || 0,
            numRatings: s.num_ratings || 0,
            hostName: s.host_name || '',
            hostVerified: false,
            hostSessions: s.sessions_count || 0,
            accessInfo: s.access_info || '',
            hours: s.hours || { open: '00:00', close: '23:59', days: 'Todos los días' },
            reviews: [],
          }));
          setStations(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredStations = useCallback(() => {
    return stations.filter((s) => {
      if (activeFilter === 'free') return s.pricePerKWh === 0;
      if (activeFilter === 'paid') return s.pricePerKWh > 0;
      if (activeFilter === 'available') return s.available;
      return true;
    });
  }, [activeFilter, stations]);

  const handleReserve = useCallback((station) => {
    setSheetVisible(false);
    navigation.navigate('Reservation', { station });
  }, [navigation]);

  const goToMyLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    mapRef.current?.animateToRegion({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 600);
  }, []);

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
      {/* Map or web fallback */}
      {isNative ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          customMapStyle={darkMapStyle}
          mapType="standard"
          onPress={handleMapPress}
          mapPadding={{ top: 180, right: 0, bottom: sheetVisible ? 140 : 16, left: 0 }}
          showsUserLocation
          showsMyLocationButton={false}
          rotateEnabled={false}
          toolbarEnabled={false}
        >
          {filteredStations().map((station) => (
            <Marker
              key={station.id}
              coordinate={{ latitude: station.latitude, longitude: station.longitude }}
              tracksViewChanges={true}
              onPress={() => { setSelectedStation(station); setSheetVisible(true); }}
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

      {/* ── Top overlay ── */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>

        {/* Row 1: hamburger ←→ wallet */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setSidebarOpen(true)}>
            <Ionicons name="menu-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.walletWidget}>
            <Ionicons name="wallet-outline" size={13} color={colors.textSecondary} style={{ marginRight: 5 }} />
            <View>
              <Text style={styles.walletBalance}>{formatCOP(walletBalance)}</Text>
              <Text style={styles.walletLabel}>Saldo disponible</Text>
            </View>
          </View>
        </View>

        {/* Row 2: search bar */}
        <View style={styles.searchRow}>
          <SearchBar
            onFocus={() => setShowSearch(true)}
            onLocationPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 800)}
          />
        </View>

        {/* Row 3: filter chips */}
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      {/* Modals / overlays */}
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

      {/* Location FAB — siempre visible */}
      <View style={[styles.locationWrapper, { bottom: sheetVisible ? 220 : 20 }]}>
        <LocationButton onPress={goToMyLocation} />
      </View>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}

const MARKER_FREE     = '#37F26B';
const MARKER_PAID     = '#19D4FF';
const MARKER_OCCUPIED = '#FF5A5F';

function CustomMarker({ station }) {
  let accent;
  if (!station.available)             accent = MARKER_OCCUPIED;
  else if (station.pricePerKWh === 0) accent = MARKER_FREE;
  else                                accent = MARKER_PAID;

  return (
    <View style={styles.markerWrapper}>
      <View style={[styles.markerCard, { borderColor: accent, shadowColor: accent }]}>
        <Text style={[styles.markerCardText, { color: accent }]}>
          {station.pricePerKWh === 0 ? 'Gratis' : formatCOP(station.pricePerKWh)}
        </Text>
      </View>
      {Platform.OS === 'ios' ? (
        <View style={[styles.markerDotIOS, { backgroundColor: accent, shadowColor: accent }]} />
      ) : (
        <View style={styles.markerDotWrap}>
          <View style={[styles.markerGlowOuter, { backgroundColor: accent }]} />
          <View style={[styles.markerGlowMid,  { backgroundColor: accent }]} />
          <View style={[styles.markerDotCore,  { backgroundColor: accent }]} />
        </View>
      )}
    </View>
  );
}

const darkMapStyle = [
  // ── 1. BASE ──────────────────────────────────────────
  // geometry #0A1322 solo para bordes/fondo fuera del mapa
  { elementType: 'geometry',           stylers: [{ color: '#0A1322' }] },
  { elementType: 'labels',      stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A1322' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#C8D0DC' }] },

  // ── 2. AGUA ──────────────────────────────────────────
  { featureType: 'water', elementType: 'geometry',         stylers: [{ color: '#234A8A' }] },
  { featureType: 'water', elementType: 'labels.text',      stylers: [{ visibility: 'on' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9BA6B7' }] },

  // ── 3. LANDSCAPE — ciudad como color base ───────────
  // landscape general = color urbano #4A5568 (cubre toda la tierra)
  { featureType: 'landscape',          elementType: 'geometry', stylers: [{ color: '#4A5568' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#4A5568' }] },

  // Vegetación va DESPUÉS — sobreescribe el #4A5568 general
  { featureType: 'landscape.natural',           elementType: 'geometry', stylers: [{ color: '#2D7466' }] },
  { featureType: 'landscape.natural.terrain',   elementType: 'geometry', stylers: [{ color: '#2D7466' }] },
  { featureType: 'landscape.natural.landcover', elementType: 'geometry', stylers: [{ color: '#2D7466' }] },

  // ── 4. POI ────────────────────────────────────────────
  { featureType: 'poi',      elementType: 'geometry',         stylers: [{ color: '#4A5568' }] },
  { featureType: 'poi.park', elementType: 'geometry',         stylers: [{ color: '#245C50' }] },
  { featureType: 'poi',      elementType: 'labels.text',      stylers: [{ visibility: 'on' }] },
  { featureType: 'poi',      elementType: 'labels.text.fill', stylers: [{ color: '#9BA6B7' }] },
  { featureType: 'poi',      elementType: 'labels.icon',      stylers: [{ visibility: 'on' }] },

  // ── 5. TRANSIT ────────────────────────────────────────
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#0A1322' }] },

  // ── 6. CALLES SECUNDARIAS ─────────────────────────────
  { featureType: 'road',       elementType: 'geometry.fill',   stylers: [{ color: '#5B6678' }] }, // Calles secundarias
  { featureType: 'road',       elementType: 'geometry.stroke', stylers: [{ color: '#3A4558' }] },
  { featureType: 'road.local', elementType: 'geometry.fill',   stylers: [{ color: '#5B6678' }] },
  { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#3A4558' }] },
  { featureType: 'road.local', elementType: 'labels.text',     stylers: [{ visibility: 'off' }] },

  // ── 7. CALLES PRINCIPALES ─────────────────────────────
  { featureType: 'road.arterial', elementType: 'geometry.fill',      stylers: [{ color: '#8B96A7' }] }, // Calles principales
  { featureType: 'road.arterial', elementType: 'geometry.stroke',    stylers: [{ color: '#4A5568' }] },
  { featureType: 'road.arterial', elementType: 'labels.text',        stylers: [{ visibility: 'on' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill',   stylers: [{ color: '#9BA6B7' }] }, // Texto secundario
  { featureType: 'road.arterial', elementType: 'labels.text.stroke', stylers: [{ color: '#0A1322' }] },

  // ── 8. AUTOPISTAS ─────────────────────────────────────
  { featureType: 'road.highway',                   elementType: 'geometry.fill',        stylers: [{ color: '#A4AEBE' }] }, // Autopistas
  { featureType: 'road.highway',                   elementType: 'geometry.stroke',      stylers: [{ color: '#5B6678' }] },
  { featureType: 'road.highway',                   elementType: 'labels.text',          stylers: [{ visibility: 'on' }] },
  { featureType: 'road.highway',                   elementType: 'labels.text.fill',     stylers: [{ color: '#C8D0DC' }] }, // Texto primario
  { featureType: 'road.highway',                   elementType: 'labels.text.stroke',   stylers: [{ color: '#0A1322' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry.fill',        stylers: [{ color: '#A4AEBE' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke',      stylers: [{ color: '#5B6678' }] },

  // ── 9. ADMINISTRATIVO ─────────────────────────────────
  { featureType: 'administrative',              elementType: 'geometry.stroke',     stylers: [{ color: '#2A3A50' }, { weight: 0.5 }] },
  { featureType: 'administrative.locality',     elementType: 'labels.text',         stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.locality',     elementType: 'labels.text.fill',    stylers: [{ color: '#C8D0DC' }] }, // Texto primario
  { featureType: 'administrative.locality',     elementType: 'labels.text.stroke',  stylers: [{ color: '#0A1322' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text',         stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill',    stylers: [{ color: '#9BA6B7' }] }, // Texto secundario
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.stroke',  stylers: [{ color: '#0A1322' }] },
];
