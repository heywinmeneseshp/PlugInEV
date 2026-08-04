import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import * as Location from 'expo-location';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import WebView from 'react-native-webview';
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
import DemoBadge from '../components/DemoBadge';
import styles from '../styles/MapScreenStyles';

const { width, height } = Dimensions.get('window');
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// ── Paleta "Midnight Teal" — amigable, armoniza con cyan/verde de la app ───
const C = {
  bg:     '#1E2B3C',   // slate azul — tierra sin clasificar (no negro, no verde)
  water:  '#1E6FA8',   // teal claro — familia del cyan de la app
  river:  '#1A5A8C',
  park:   '#0A1C14',   // verde muy oscuro casi negro
  urban:  '#141E2B',   // urbano: levemente más oscuro que bg
  bldg:   '#192436',   // edificios: sutil diferencia
  moto:   '#5BBDD6',   // autopistas: cyan de la app atenuado
  trunk:  '#4AA0BC',
  prime:  '#3C8299',
  second: '#2E6070',
  minor:  '#345E78',   // calles menores más claras para verlas al hacer zoom
  label:  'rgba(255,255,255,0.94)',
  labsub: 'rgba(200,225,240,0.65)',
  halo:   '#111C28',
};

// ── MapLibre GL style (OpenFreeMap vector tiles) ────────────────────────────
const MAP_STYLE = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: { ofm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } },
  layers: [
    // Tierra sin clasificar = slate azul (ciudad que "cae" aquí se ve bien)
    { id:'bg',        type:'background', paint:{ 'background-color': C.bg } },

    // Agua
    { id:'water',     type:'fill', source:'ofm', 'source-layer':'water',
      paint:{ 'fill-color': C.water } },
    { id:'waterway',  type:'line', source:'ofm', 'source-layer':'waterway',
      paint:{ 'line-color': C.river, 'line-width':['interpolate',['linear'],['zoom'],8,1,15,4] } },

    // Naturaleza explícita (sólo lo que OpenStreetMap tiene taggeado como verde)
    { id:'landcover', type:'fill', source:'ofm', 'source-layer':'landcover',
      filter:['in','class','grass','wood','farmland','wetland'],
      paint:{ 'fill-color': C.park } },
    { id:'park',      type:'fill', source:'ofm', 'source-layer':'landuse',
      filter:['in','class','park','grass','cemetery','nature_reserve','recreation_ground','allotments'],
      paint:{ 'fill-color': C.park } },

    // Urbano explícito — sólo lo taggeado como residencial/comercial/etc.
    // El resto del suelo urbano sin tag queda en slate azul (bg) — que está bien
    { id:'urban',     type:'fill', source:'ofm', 'source-layer':'landuse',
      filter:['in','class','residential','commercial','industrial','retail','suburb','school','hospital','university','military','parking'],
      paint:{ 'fill-color': C.urban } },

    // Edificios — dan textura a zoom alto
    { id:'building',  type:'fill', source:'ofm', 'source-layer':'building',
      paint:{ 'fill-color': C.bldg, 'fill-outline-color': C.bg } },

    // Calles — casings primero, relleno encima
    { id:'casing-moto', type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['in','class','motorway','trunk'],
      layout:{ 'line-cap':'round', 'line-join':'round' },
      paint:{ 'line-color':'#0C1624', 'line-width':['interpolate',['linear'],['zoom'],6,5,18,22] } },
    { id:'casing-pri',  type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','primary'],
      layout:{ 'line-cap':'round', 'line-join':'round' },
      paint:{ 'line-color':'#0E1A26', 'line-width':['interpolate',['linear'],['zoom'],8,4,18,15] } },
    { id:'road-minor',  type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['in','class','minor','service','track'],
      paint:{ 'line-color': C.minor, 'line-width':['interpolate',['linear'],['zoom'],13,0.5,18,3] } },
    { id:'road-tert',   type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','tertiary'],
      paint:{ 'line-color': C.second, 'line-width':['interpolate',['linear'],['zoom'],10,0.8,18,5] } },
    { id:'road-sec',    type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','secondary'],
      paint:{ 'line-color': C.second, 'line-width':['interpolate',['linear'],['zoom'],9,1,18,7] } },
    { id:'road-pri',    type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','primary'],
      layout:{ 'line-cap':'round', 'line-join':'round' },
      paint:{ 'line-color': C.prime, 'line-width':['interpolate',['linear'],['zoom'],8,1.5,18,11] } },
    { id:'road-trunk',  type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','trunk'],
      layout:{ 'line-cap':'round', 'line-join':'round' },
      paint:{ 'line-color': C.trunk, 'line-width':['interpolate',['linear'],['zoom'],7,1.5,18,13] } },
    { id:'road-moto',   type:'line', source:'ofm', 'source-layer':'transportation',
      filter:['==','class','motorway'],
      layout:{ 'line-cap':'round', 'line-join':'round' },
      paint:{ 'line-color': C.moto,  'line-width':['interpolate',['linear'],['zoom'],6,2,18,15] } },

    // Etiquetas
    { id:'lbl-road',   type:'symbol', source:'ofm', 'source-layer':'transportation_name',
      layout:{ 'text-field':['get','name'], 'text-size':10, 'symbol-placement':'line', 'text-font':['Noto Sans Regular'], 'text-max-angle':30 },
      paint: { 'text-color': C.labsub, 'text-halo-color': C.halo, 'text-halo-width':1.5 } },
    { id:'lbl-suburb', type:'symbol', source:'ofm', 'source-layer':'place',
      filter:['in','class','suburb','neighbourhood','quarter','hamlet'],
      layout:{ 'text-field':['get','name'], 'text-size':11, 'text-font':['Noto Sans Regular'] },
      paint: { 'text-color': C.labsub, 'text-halo-color': C.halo, 'text-halo-width':1.5 } },
    { id:'lbl-town',   type:'symbol', source:'ofm', 'source-layer':'place',
      filter:['in','class','town','village'],
      layout:{ 'text-field':['get','name'], 'text-size':13, 'text-font':['Noto Sans Bold'] },
      paint: { 'text-color': C.label, 'text-halo-color': C.halo, 'text-halo-width':2 } },
    { id:'lbl-city',   type:'symbol', source:'ofm', 'source-layer':'place',
      filter:['==','class','city'],
      layout:{ 'text-field':['get','name'], 'text-size':['interpolate',['linear'],['zoom'],8,14,14,20], 'text-font':['Noto Sans Bold'] },
      paint: { 'text-color': C.label, 'text-halo-color': C.halo, 'text-halo-width':2 } },
  ],
};

const MAP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link href="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js"><\/script>
  <style>
    * { margin:0; padding:0; box-sizing:border-box }
    html,body,#map { width:100%; height:100%; background:#0B0F1A }
    .maplibregl-ctrl-logo,.maplibregl-ctrl-attrib { display:none!important }
    .mk-wrap { display:flex; flex-direction:column; align-items:center; cursor:pointer; }
    .pm { background:#0D1117; border-radius:8px; padding:3px 8px;
          font:700 11px/1 -apple-system,sans-serif; white-space:nowrap; border:1.5px solid }
    .pm.free { color:#37F26B; border-color:#37F26B; box-shadow:0 2px 10px #37F26B55 }
    .pm.paid { color:#19D4FF; border-color:#19D4FF; box-shadow:0 2px 10px #19D4FF55 }
    .pm.busy { color:#FF5A5F; border-color:#FF5A5F; box-shadow:0 2px 10px #FF5A5F55 }
    .mk-stem { width:2px; height:7px; opacity:0.6; }
    .mk-dot  { width:9px; height:9px; border-radius:50%; border:1px solid rgba(255,255,255,0.5); }
    .free .mk-stem,.mk-dot.free { background:#37F26B; box-shadow:0 0 7px #37F26B }
    .paid .mk-stem,.mk-dot.paid { background:#19D4FF; box-shadow:0 0 7px #19D4FF }
    .busy .mk-stem,.mk-dot.busy { background:#FF5A5F; box-shadow:0 0 7px #FF5A5F }
    @keyframes pulse { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.8);opacity:0} }
    .ud-wrap { position:relative; width:36px; height:36px; display:flex;
               align-items:center; justify-content:center; }
    .ud-ring { position:absolute; width:36px; height:36px; border-radius:50%;
               background:rgba(0,122,255,0.2); border:1.5px solid rgba(0,122,255,0.5);
               animation:pulse 2s ease-out infinite; }
    .ud { width:14px; height:14px; border-radius:50%; position:relative;
          background:#3B9EFF; border:2.5px solid #fff; box-shadow:0 0 12px #3B9EFF }
  </style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var map = new maplibregl.Map({
    container:'map',
    style:${JSON.stringify(MAP_STYLE)},
    center:[-74.80,10.995],
    zoom:13,
    attributionControl:false
  });

  var uMark=null, sMark={};

  function fmt(p){ return '$'+Math.round(p).toLocaleString('es-CO'); }

  function addMarkers(stations){
    Object.values(sMark).forEach(function(m){m.remove();}); sMark={};
    stations.forEach(function(s){
      if(!s.latitude||!s.longitude)return;
      var cls=!s.available?'busy':s.pricePerKWh===0?'free':'paid';
      var lbl=!s.available?'Ocupado':s.pricePerKWh===0?'Gratis':fmt(s.pricePerKWh);
      var wrap=document.createElement('div'); wrap.className='mk-wrap';
      var card=document.createElement('div'); card.className='pm '+cls; card.textContent=lbl;
      var stem=document.createElement('div'); stem.className='mk-stem '+cls;
      var dot =document.createElement('div'); dot.className ='mk-dot '+cls;
      wrap.appendChild(card); wrap.appendChild(stem); wrap.appendChild(dot);
      wrap.addEventListener('click',function(e){
        e.stopPropagation();
        window.ReactNativeWebView.postMessage(JSON.stringify({type:'markerPress',stationId:s.id}));
      });
      sMark[s.id]=new maplibregl.Marker({element:wrap,anchor:'bottom'})
        .setLngLat([s.longitude,s.latitude]).addTo(map);
    });
  }

  function setUser(lat,lng){
    if(!uMark){
      var wrap=document.createElement('div'); wrap.className='ud-wrap';
      var ring=document.createElement('div'); ring.className='ud-ring';
      var dot=document.createElement('div');  dot.className='ud';
      wrap.appendChild(ring); wrap.appendChild(dot);
      uMark=new maplibregl.Marker({element:wrap,anchor:'center'}).setLngLat([lng,lat]).addTo(map);
    }else{ uMark.setLngLat([lng,lat]); }
  }

  map.on('click',function(){
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'mapPress'}));
  });

  window.handleMsg=function(raw){
    try{
      var m=JSON.parse(raw);
      if(m.type==='addMarkers')   addMarkers(m.stations);
      else if(m.type==='flyTo')   map.flyTo({center:[m.lng,m.lat],zoom:m.zoom||15,duration:600});
      else if(m.type==='userLocation') setUser(m.lat,m.lng);
      else if(m.type==='reset')   map.flyTo({center:[-74.80,10.995],zoom:13,duration:600});
    }catch(e){}
  };

  document.addEventListener('message',function(e){window.handleMsg(e.data);});
  window.addEventListener('message',function(e){window.handleMsg(e.data);});

  map.on('load',function(){
    window.ReactNativeWebView.postMessage(JSON.stringify({type:'ready'}));
  });
})();
<\/script>
</body>
</html>`;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuth();
  const userRole = user?.role || 'conductor';

  const webViewRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const walletBalance = user?.walletBalance || 0;

  const [stations, setStations] = useState([]);
  const [stationsError, setStationsError] = useState(false);

  const fetchStations = useCallback(() => {
    setStationsError(false);
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
      .catch(() => setStationsError(true));
  }, []);

  useEffect(() => { fetchStations(); }, [fetchStations]);

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      if (activeFilter === 'free') return s.pricePerKWh === 0;
      if (activeFilter === 'paid') return s.pricePerKWh > 0;
      if (activeFilter === 'available') return s.available;
      return true;
    });
  }, [activeFilter, stations]);

  const injectToMap = useCallback((msg) => {
    const js = `window.handleMsg(${JSON.stringify(JSON.stringify(msg))}); true;`;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const mapData = filteredStations.map(s => ({
      id: s.id, latitude: s.latitude, longitude: s.longitude,
      available: s.available, pricePerKWh: s.pricePerKWh,
    }));
    injectToMap({ type: 'addMarkers', stations: mapData });
  }, [mapReady, filteredStations, injectToMap]);

  const handleWebViewMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'ready') {
        setMapReady(true);
      } else if (msg.type === 'markerPress') {
        const station = stations.find(s => s.id === msg.stationId);
        if (station) { setSelectedStation(station); setSheetVisible(true); }
      } else if (msg.type === 'mapPress') {
        setSheetVisible(false);
      }
    } catch (e) {}
  }, [stations]);

  const handleReserve = useCallback((station) => {
    setSheetVisible(false);
    navigation.navigate('Booking', { station });
  }, [navigation]);

  const goToMyLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const { latitude, longitude } = pos.coords;
    injectToMap({ type: 'userLocation', lat: latitude, lng: longitude });
    injectToMap({ type: 'flyTo', lat: latitude, lng: longitude, zoom: 15 });
  }, [injectToMap]);

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
        <WebView
          ref={webViewRef}
          style={styles.map}
          source={{ html: MAP_HTML }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          originWhitelist={['*']}
          scrollEnabled={false}
          mixedContentMode="always"
        />
      ) : (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackTitle}>plügin</Text>
          <Text style={styles.webFallbackSub}>Estaciones de carga cercanas</Text>
          <FlatList
            data={filteredStations}
            keyExtractor={(item) => item.id}
            renderItem={renderStationCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* ── Top overlay ── */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 10 }]}>
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

        <View style={styles.searchRow}>
          <SearchBar
            onFocus={() => setShowSearch(true)}
            onLocationPress={() => injectToMap({ type: 'reset' })}
          />
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <DemoBadge />
        </View>

        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </View>

      <SearchModal
        visible={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectStation={(station) => { setSelectedStation(station); setSheetVisible(true); }}
      />

      {stationsError && (
        <TouchableOpacity
          style={styles.errorBanner}
          onPress={fetchStations}
          activeOpacity={0.8}
        >
          <Ionicons name="warning-outline" size={16} color={colors.yellow} />
          <Text style={styles.errorBannerText}>No se pudieron cargar las estaciones — Reintentar</Text>
        </TouchableOpacity>
      )}

      <StationBottomSheet
        station={selectedStation}
        visible={sheetVisible}
        onReserve={handleReserve}
        userRole={userRole}
      />

      <View style={[styles.locationWrapper, { bottom: sheetVisible ? 220 : 20 }]}>
        <LocationButton onPress={goToMyLocation} />
      </View>

      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  );
}
