import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/HostSetupScreenStyles';

const CONECTORES = ['CCS', 'CHAdeMO', 'Type 2'];
const POTENCIAS = ['22kW', '50kW', '100kW', '150kW', '200kW'];

export default function HostSetupScreen() {
  const navigation = useNavigation();
  const { setHostStation } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [power, setPower] = useState('');
  const [connectors, setConnectors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');

  const toggleConnector = (c) => {
    setConnectors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleFinish = () => {
    if (!name || !address || !price || !power || connectors.length === 0 || !paymentMethod) {
      Alert.alert('Campos requeridos', 'Completa todos los campos');
      return;
    }
    const station = {
      id: 'host-1',
      name,
      address,
      pricePerKWh: parseInt(price, 10),
      power,
      connectors,
      paymentMethod,
      available: true,
      latitude: 10.995,
      longitude: -74.80,
      rating: 0,
    };
    setHostStation(station);
    navigation.navigate('HostDashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.stepIndicator}>
          {['Ubicación', 'Precio', 'Cobro'].map((label, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.stepDot, step >= i && styles.stepDotActive]}
              onPress={() => setStep(i)}
            >
              <Text style={[styles.stepDotText, step >= i && styles.stepDotTextActive]}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.headerTitle}>Configurar estación</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la estación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: TurboCharge Norte"
                placeholderTextColor="#475569"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                placeholder="Cra. 65 #80-120, Barranquilla"
                placeholderTextColor="#475569"
                value={address}
                onChangeText={setAddress}
              />
            </View>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderIcon}>⌕</Text>
              <Text style={styles.mapPlaceholderText}>Barranquilla, Colombia</Text>
              <Text style={styles.mapPlaceholderSub}>La ubicación se ajustará en el mapa</Text>
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Precio y conectores</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Precio por kWh ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 825"
                placeholderTextColor="#475569"
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Potencia</Text>
              <View style={styles.chipRow}>
                {POTENCIAS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.chip, power === p && styles.chipActive]}
                    onPress={() => setPower(p)}
                  >
                    <Text style={[styles.chipText, power === p && styles.chipTextActive]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Conectores</Text>
              <View style={styles.chipRow}>
                {CONECTORES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, connectors.includes(c) && styles.chipActive]}
                    onPress={() => toggleConnector(c)}
                  >
                    <Text
                      style={[styles.chipText, connectors.includes(c) && styles.chipTextActive]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Método de cobro</Text>
            {['Nequi', 'Bancolombia', 'Tarjeta débito/crédito', 'Efectivo'].map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.paymentCard, paymentMethod === m && styles.paymentCardActive]}
                onPress={() => setPaymentMethod(m)}
              >
                <Text style={[styles.paymentText, paymentMethod === m && styles.paymentTextActive]}>
                  {m}
                </Text>
                {paymentMethod === m && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <Text style={styles.paymentHint}>
              Los pagos se liquidarán semanalmente a tu cuenta registrada.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}>
            <Text style={styles.backBtnText}>Atrás</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, step === 2 && styles.finishBtn]}
          onPress={() => (step < 2 ? setStep(step + 1) : handleFinish())}
        >
          <Text style={styles.nextBtnText}>
            {step === 2 ? 'Finalizar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


