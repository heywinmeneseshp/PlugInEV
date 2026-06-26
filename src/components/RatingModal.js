import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, weights, radius } from '../styles/theme';

const HINTS = ['', 'Mala experiencia', 'Mejorable', 'Regular', 'Muy buena', '¡Excelente!'];

export default function RatingModal({ visible, onClose, onSubmit, stationName }) {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit?.({ rating, comment: comment.trim() });
    setRating(0);
    setComment('');
    onClose?.();
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={s.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={s.sheet}>
          <View style={s.handle} />

          <Text style={s.title}>Califica tu experiencia</Text>
          {stationName ? <Text style={s.sub}>{stationName}</Text> : null}

          {/* Stars */}
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={42}
                  color={star <= rating ? '#FFD60A' : colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.ratingHint}>{HINTS[rating] || 'Toca para calificar'}</Text>

          {/* Comment */}
          <TextInput
            style={s.commentInput}
            placeholder="Cuéntanos más sobre tu experiencia (opcional)"
            placeholderTextColor={colors.textHint}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={rating === 0}
            activeOpacity={0.85}
            style={s.submitWrap}
          >
            <LinearGradient
              colors={rating > 0 ? ['#00BAFF', '#00FF8C'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.06)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.submitGrad}
            >
              <Ionicons name="star" size={18} color={rating > 0 ? '#050A15' : colors.textMuted} />
              <Text style={[s.submitText, rating === 0 && s.submitTextDisabled]}>
                Enviar calificación
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={s.skipBtn} onPress={handleClose}>
            <Text style={s.skipText}>Omitir por ahora</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  wrapper:  { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: '#0D1626',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 0,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: weights.bold, color: colors.textPrimary, marginBottom: 4 },
  sub: { fontSize: 14, color: colors.textMuted, marginBottom: 24, textAlign: 'center' },

  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  ratingHint: { fontSize: 14, color: colors.textSecondary, marginBottom: 20, minHeight: 20 },

  commentInput: {
    width: '100%', minHeight: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg,
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 12,
    fontSize: 14, color: colors.textPrimary,
    marginBottom: 20,
  },

  submitWrap: { width: '100%', borderRadius: 27, marginBottom: 12 },
  submitGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 54, borderRadius: 27,
  },
  submitText:         { fontSize: 16, fontWeight: weights.bold, color: '#050A15' },
  submitTextDisabled: { color: colors.textMuted },

  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 14, color: colors.textMuted },
});
