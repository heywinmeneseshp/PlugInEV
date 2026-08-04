import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listarEstaciones } from '../services/api/estaciones';
import { formatCOP } from '../utils/format';
import { colors } from '../styles/theme';
import styles from '../styles/SearchModalStyles';

export default function SearchModal({ visible, onClose, onSelectStation }) {
  const [query, setQuery] = useState('');
  const [allStations, setAllStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (allStations.length > 0) return; // already loaded
    setLoading(true);
    listarEstaciones()
      .then(data => {
        if (Array.isArray(data)) {
          setAllStations(data.map(s => ({
            id: s._id || s.id,
            name: s.name,
            address: s.address,
            available: s.online !== false,
            pricePerKWh: s.price_per_kwh || 0,
            latitude: s.latitude,
            longitude: s.longitude,
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
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [visible]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allStations.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q),
    );
  }, [query, allStations]);

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.handleBar} />

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Buscar estación, barrio o dirección..."
            placeholderTextColor="#475569"
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.cyan} style={{ marginTop: 32 }} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              query.trim() ? (
                <Text style={styles.empty}>Sin resultados para "{query}"</Text>
              ) : (
                <View style={styles.suggestions}>
                  <Text style={styles.suggestionsTitle}>Barrios cercanos</Text>
                  {['Norte', 'Riomar', 'El Prado', 'Buenavista', 'Centro', 'Sur', 'Villa Campestre'].map(
                    (b) => (
                      <TouchableOpacity
                        key={b}
                        style={styles.suggestionItem}
                        onPress={() => setQuery(b)}
                      >
                        <Text style={styles.suggestionText}>{b}</Text>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() => {
                  onSelectStation(item);
                  onClose();
                }}
              >
                <View style={styles.resultLeft}>
                  <View
                    style={[
                      styles.resultDot,
                      {
                        backgroundColor: item.available
                          ? item.pricePerKWh === 0
                            ? colors.green
                            : colors.cyan
                          : colors.red,
                      },
                    ]}
                  />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultAddress}>{item.address}</Text>
                  </View>
                </View>
                <Text style={styles.resultPrice}>
                  {item.pricePerKWh === 0 ? 'Gratis' : formatCOP(item.pricePerKWh)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
