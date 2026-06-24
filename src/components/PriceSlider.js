import React, { useState, useRef, useCallback } from 'react';
import { View, Text, PanResponder } from 'react-native';
import styles from '../styles/PriceSliderStyles';

const MIN_PRICE = 0;
const MAX_PRICE = 10;

export default function PriceSlider({ maxPrice, onMaxPriceChange }) {
  const [trackWidth, setTrackWidth] = useState(1);
  const trackWidthRef = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const usableWidth = trackWidthRef.current - 24;
        if (usableWidth <= 0) return;
        const rawX = evt.nativeEvent.locationX - 12;
        const ratio = Math.min(1, Math.max(0, rawX / usableWidth));
        const price = MIN_PRICE + Math.round(ratio * (MAX_PRICE - MIN_PRICE) * 2) / 2;
        onMaxPriceChange(Math.min(MAX_PRICE, Math.max(MIN_PRICE, price)));
      },
    })
  ).current;

  const onLayout = useCallback((e) => {
    const w = e.nativeEvent.layout.width;
    trackWidthRef.current = w;
    setTrackWidth(w);
  }, []);

  const pct = Math.min(1, Math.max(0, (maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        Precio máx: ${maxPrice.toFixed(2)} /kWh
      </Text>
      <View
        style={styles.trackContainer}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={styles.trackBg} />
        <View style={[styles.trackFill, { width: `${pct * 100}%` }]} />
        <View style={[styles.thumb, { left: pct * (trackWidth - 24) }]} />
      </View>
    </View>
  );
}
