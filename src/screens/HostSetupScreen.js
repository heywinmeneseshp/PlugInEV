import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Dimensions, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { registrarEstacion } from '../services/api/anfitrion';
import GradientButton from '../components/GradientButton';
import { colors, weights, radius } from '../styles/theme';

const { width } = Dimensions.get('window');

const STEPS = ['Ubicación', 'Técnico', 'Cobro'];
const POTENCIAS  = ['7kW', '22kW', '50kW', '100kW', '150kW', '200kW'];
const CONECTORES = ['CCS', 'CHAdeMO', 'Type 2', 'GB/T'];
const PAGOS      = [
  { id: 'nequi',    label: 'Nequi',              icon: 'phone-portrait-outline' },
  { id: 'bancol',   label: 'Bancolombia',         icon: 'business-outline' },
  { id: 'card',     label: 'Tarjeta débito/crédito', icon: 'card-outline' },
  { id: 'efectivo', label: 'Efectivo',            icon: 'cash-outline' },
];

export default function HostSetupScreen() {
  const insets     = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, setHostStation } = useAuth();

  const [step, setStep]             = useState(0);
  const [name, setName]             = useState('');
  const [address, setAddress]       = useState('');
  const [price, setPrice]           = useState('');
  const [power, setPower]           = useState('');
  const [connectors, setConnectors] = useState([]);
  const [payment, setPayment]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [geocoding, setGeocoding]   = useState(false);
  const [coords, setCoords]         = useState({ latitude: 10.995, longitude: -74.80 });

  const miniMapRef    = useRef(null);
  const geocodeTimer  = useRef(null);

  const geocodeAddress = useCallback(async (addr) => {
    if (!addr.trim()) return;
    setGeocoding(true);
    try {
      const query = encodeURIComponent(addr + ', Barranquilla, Colombia');
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlugInEV/1.0' } });
      const data = await res.json();
      if (data.length > 0) {
        const newCoords = { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
        setCoords(newCoords);
        const js = `window.handleMsg(${JSON.stringify(JSON.stringify({ type: 'updatePin', lat: newCoords.latitude, lng: newCoords.longitude }))}); true;`;
        miniMapRef.current?.injectJavaScript(js);
      }
    } catch {
      // keep default coords
    } finally {
      setGeocoding(false);
    }
  }, []);

  const handleAddressChange = useCallback((text) => {
    setAddress(text);
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (text.length > 6) {
      geocodeTimer.current = setTimeout(() => geocodeAddress(text), 700);
    }
  }, [geocodeAddress]);

  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': 'PlugInEV/1.0' } });
      const data = await res.json();
      if (data?.display_name) setAddress(data.display_name);
    } catch {
      // si falla, se conservan las coordenadas igual; el usuario puede escribir la dirección a mano
    }
  }, []);

  // El usuario tocó el mini-mapa o arrastró el pin para ubicar el punto manualmente
  const handleMapMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'pinMoved') {
        setCoords({ latitude: msg.lat, longitude: msg.lng });
        reverseGeocode(msg.lat, msg.lng);
      }
    } catch {}
  }, [reverseGeocode]);

  const toggleConnector = (c) =>
    setConnectors((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  const canNext = () => {
    if (step === 0) return name.trim() && address.trim();
    if (step === 1) return price && power && connectors.length > 0;
    if (step === 2) return !!payment;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const payload = {
        host_id: user?.email || null,
        name: name.trim(),
        address: address.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        power: power,
        price_per_kwh: parseInt(price, 10) || 0,
        connectors: connectors,
        access_info: '',
      };
      const station = await registrarEstacion(payload);
      setHostStation({
        ...payload,
        id: station._id || station.id,
        pricePerKWh: payload.price_per_kwh,
        paymentMethod: PAGOS.find((p) => p.id === payment)?.label || payment,
        available: true,
      });
      navigation.navigate('AnfitrionTabs');
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo registrar la estación');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!canNext()) {
      Alert.alert('Campos requeridos', 'Completa todos los campos antes de continuar.');
      return;
    }
    if (step === 0) {
      geocodeAddress(address);
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Registrar estación</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stepper */}
      <View style={s.stepper}>
        {STEPS.map((label, i) => {
          const done   = i < step;
          const active = i === step;
          return (
            <React.Fragment key={label}>
              <View style={s.stepItem}>
                {done ? (
                  <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.stepCircle}>
                    <Ionicons name="checkmark" size={14} color="#050A15" />
                  </LinearGradient>
                ) : active ? (
                  <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.stepCircle}>
                    <Text style={s.stepNum}>{i + 1}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[s.stepCircle, s.stepCircleInactive]}>
                    <Text style={s.stepNumInactive}>{i + 1}</Text>
                  </View>
                )}
                <Text style={[s.stepLabel, active && s.stepLabelActive]}>{label}</Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[s.stepLine, done && s.stepLineActive]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Paso 0: Ubicación ── */}
        {step === 0 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>¿Dónde está tu estación?</Text>
            <Text style={s.stepSub}>Esta información aparecerá en el mapa para los conductores.</Text>

            <Field label="Nombre de la estación" icon="flash-outline">
              <TextInput
                style={s.input}
                placeholder="Ej: TurboCharge Norte"
                placeholderTextColor={colors.textHint}
                value={name} onChangeText={setName}
              />
            </Field>

            <Field label="Dirección" icon="location-outline">
              <TextInput
                style={s.input}
                placeholder="Cra. 65 #80-120, Barranquilla"
                placeholderTextColor={colors.textHint}
                value={address}
                onChangeText={handleAddressChange}
              />
            </Field>

            {/* Mapa con pin de la dirección */}
            <View style={s.mapContainer}>
              <WebView
                ref={miniMapRef}
                style={s.map}
                source={{ html: MINI_LEAFLET_HTML }}
                javaScriptEnabled
                originWhitelist={['*']}
                scrollEnabled={false}
                mixedContentMode="always"
                onMessage={handleMapMessage}
              />

              {/* Indicador de geocodificación */}
              {geocoding && (
                <View style={s.mapOverlay}>
                  <ActivityIndicator color={colors.cyan} size="small" />
                </View>
              )}

              {/* Pista de interacción */}
              <View style={s.mapHint}>
                <Ionicons name="hand-left-outline" size={11} color={colors.textSecondary} />
                <Text style={s.mapHintText}>Toca o arrastra el pin para ajustar la ubicación</Text>
              </View>

              {/* Etiqueta de dirección */}
              <View style={s.mapLabel}>
                <Ionicons name="location" size={11} color={colors.green} />
                <Text style={s.mapLabelText} numberOfLines={1}>
                  {address.trim() || 'Barranquilla, Colombia'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Paso 1: Técnico ── */}
        {step === 1 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>Detalles técnicos</Text>
            <Text style={s.stepSub}>Configura la potencia y conectores disponibles.</Text>

            <Field label="Precio por kWh (COP)" icon="cash-outline">
              <TextInput
                style={s.input}
                placeholder="Ej: 825"
                placeholderTextColor={colors.textHint}
                value={price} onChangeText={setPrice}
                keyboardType="number-pad"
              />
            </Field>

            <Text style={s.chipGroupLabel}>Potencia máxima</Text>
            <View style={s.chipRow}>
              {POTENCIAS.map((p) => (
                <ChipBtn key={p} label={p} active={power === p} onPress={() => setPower(p)} />
              ))}
            </View>

            <Text style={s.chipGroupLabel}>Tipos de conector</Text>
            <View style={s.chipRow}>
              {CONECTORES.map((c) => (
                <ChipBtn key={c} label={c} active={connectors.includes(c)} onPress={() => toggleConnector(c)} />
              ))}
            </View>
          </View>
        )}

        {/* ── Paso 2: Cobro ── */}
        {step === 2 && (
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>Método de cobro</Text>
            <Text style={s.stepSub}>Los pagos se liquidarán semanalmente a tu cuenta registrada.</Text>

            {PAGOS.map((m) => {
              const active = payment === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[s.payCard, active && s.payCardActive]}
                  onPress={() => setPayment(m.id)}
                  activeOpacity={0.8}
                >
                  <View style={[s.payIcon, active && s.payIconActive]}>
                    <Ionicons name={m.icon} size={20} color={active ? '#050A15' : colors.textSecondary} />
                  </View>
                  <Text style={[s.payLabel, active && s.payLabelActive]}>{m.label}</Text>
                  {active && (
                    <LinearGradient colors={['#00BAFF','#00FF8C']} style={s.checkCircle}>
                      <Ionicons name="checkmark" size={12} color="#050A15" />
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}

            <View style={s.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={colors.cyan} />
              <Text style={s.infoText}>
                El pago queda retenido en garantía hasta confirmar la sesión completa.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <GradientButton
          label={step < STEPS.length - 1 ? 'Siguiente' : 'Registrar estación'}
          onPress={handleNext}
          disabled={!canNext() || loading}
          icon={
            <Ionicons
              name={step < STEPS.length - 1 ? 'arrow-forward' : 'flash'}
              size={18} color="#050A15"
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/* ── Sub-componentes ── */
function Field({ label, icon, children }) {
  return (
    <View style={s.fieldGroup}>
      <View style={s.fieldLabel}>
        <Ionicons name={icon} size={13} color={colors.textMuted} />
        <Text style={s.labelText}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

function ChipBtn({ label, active, onPress }) {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient colors={['#00BAFF','#00FF8C']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.chip}>
          <Text style={s.chipTextActive}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={s.chipInactive} onPress={onPress} activeOpacity={0.75}>
      <Text style={s.chipText}>{label}</Text>
    </TouchableOpacity>
  );
}

const MINI_MAP_STYLE = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: { ofm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } },
  layers: [
    { id:'bg',       type:'background', paint:{ 'background-color':'#0F1522' } },
    { id:'water',    type:'fill', source:'ofm', 'source-layer':'water',    paint:{ 'fill-color':'#1B3D6F' } },
    { id:'park',     type:'fill', source:'ofm', 'source-layer':'landuse',  filter:['in','class','park','grass','cemetery','nature_reserve'], paint:{ 'fill-color':'#1E4D3A' } },
    { id:'urban',    type:'fill', source:'ofm', 'source-layer':'landuse',  filter:['in','class','residential','commercial','industrial','retail'], paint:{ 'fill-color':'#181E2A' } },
    { id:'building', type:'fill', source:'ofm', 'source-layer':'building', paint:{ 'fill-color':'#222836' } },
    { id:'road-sec', type:'line', source:'ofm', 'source-layer':'transportation', filter:['in','class','secondary','tertiary'], paint:{ 'line-color':'#5A6670', 'line-width':1.5 } },
    { id:'road-pri', type:'line', source:'ofm', 'source-layer':'transportation', filter:['in','class','primary','trunk','motorway'], paint:{ 'line-color':'#9AA5B1', 'line-width':3 } },
  ],
};

const MINI_LEAFLET_HTML = `<!DOCTYPE html>
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
  </style>
</head>
<body>
<div id="map"></div>
<script>
(function(){
  var map = new maplibregl.Map({
    container:'map',
    style:${JSON.stringify(MINI_MAP_STYLE)},
    center:[-74.80,10.995],
    zoom:15,
    attributionControl:false
  });
  var pin = new maplibregl.Marker({ color:'#19D4FF', draggable:true }).setLngLat([-74.80,10.995]).addTo(map);

  function reportPin(lng,lat){
    window.ReactNativeWebView.postMessage(JSON.stringify({ type:'pinMoved', lat:lat, lng:lng }));
  }

  pin.on('dragend', function(){
    var p = pin.getLngLat();
    reportPin(p.lng, p.lat);
  });

  map.on('click', function(e){
    pin.setLngLat(e.lngLat);
    reportPin(e.lngLat.lng, e.lngLat.lat);
  });

  window.handleMsg = function(raw){
    try{
      var m=JSON.parse(raw);
      if(m.type==='updatePin'){
        pin.setLngLat([m.lng,m.lat]);
        map.flyTo({center:[m.lng,m.lat],zoom:16,duration:500});
      }
    }catch(e){}
  };
  document.addEventListener('message',function(e){window.handleMsg(e.data);});
  window.addEventListener('message',function(e){window.handleMsg(e.data);});
})();
<\/script>
</body>
</html>`;

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: weights.bold, color: colors.textPrimary },

  /* Stepper */
  stepper: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 24,
  },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleInactive: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stepNum: { fontSize: 13, fontWeight: weights.bold, color: '#050A15' },
  stepNumInactive: { fontSize: 13, fontWeight: weights.bold, color: colors.textMuted },
  stepLabel: { fontSize: 10, color: colors.textMuted, fontWeight: weights.medium },
  stepLabelActive: { color: colors.cyan },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 6, marginBottom: 18 },
  stepLineActive: { backgroundColor: colors.green },

  scroll: { paddingHorizontal: 20 },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 22, fontWeight: weights.bold, color: colors.textPrimary },
  stepSub: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginTop: -8 },

  /* Fields */
  fieldGroup: { gap: 8 },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  labelText: { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: colors.textPrimary,
  },

  /* Mapa real */
  mapContainer: {
    height: 180,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,186,255,0.3)',
  },
  map: { ...StyleSheet.absoluteFillObject },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,10,21,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHint: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(5,10,21,0.72)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mapHintText: { flex: 1, fontSize: 10, color: colors.textSecondary },
  mapLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(5,10,21,0.82)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mapLabelText: { flex: 1, fontSize: 11, color: colors.textSecondary },
  miniPin: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.cyan,
    borderWidth: 2.5, borderColor: '#fff',
  },

  /* Chips */
  chipGroupLabel: {
    fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium, marginBottom: -8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    height: 36, borderRadius: 18, paddingHorizontal: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  chipInactive: {
    height: 36, borderRadius: 18, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  chipText:       { fontSize: 13, color: colors.textSecondary, fontWeight: weights.medium },
  chipTextActive: { fontSize: 13, color: '#050A15', fontWeight: weights.bold },

  /* Payment cards */
  payCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: radius.xl, paddingHorizontal: 16, paddingVertical: 14,
  },
  payCardActive: { borderColor: 'rgba(0,186,255,0.4)', backgroundColor: 'rgba(0,186,255,0.07)' },
  payIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  payIconActive: { backgroundColor: colors.cyan },
  payLabel:       { flex: 1, fontSize: 15, color: colors.textSecondary, fontWeight: weights.medium },
  payLabelActive: { color: colors.textPrimary },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Info box */
  infoBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,186,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(0,186,255,0.2)',
    borderRadius: radius.lg, padding: 14,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  footer: { paddingHorizontal: 20, paddingTop: 12 },
});
