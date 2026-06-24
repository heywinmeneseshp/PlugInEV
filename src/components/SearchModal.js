import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import mockStations from '../data/mockData';
import { formatCOP } from '../utils/format';
import styles from '../styles/SearchModalStyles';

export default function SearchModal({ visible, onClose, onSelectStation }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockStations.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q),
    );
  }, [query]);

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
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

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
                          ? '#22C55E'
                          : '#00E5FF'
                        : '#EF4444',
                    },
                  ]}
                />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultAddress}>{item.address}</Text>
                </View>
              </View>
              <Text style={styles.resultPrice}>
                {formatCOP(item.pricePerKWh)}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}


