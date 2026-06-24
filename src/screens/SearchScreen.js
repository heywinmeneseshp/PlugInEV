import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Linking,
  Platform,
} from 'react-native';
import styles from '../styles/SearchScreenStyles';
import mockStations from '../data/mockData';
import { formatCOP } from '../utils/format';

export default function SearchScreen({ onBack, onSelectStation, onGetDirections }) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar estación, barrio o dirección..."
            placeholderTextColor="#475569"
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
              onBack();
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
  );
}


