import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProviderCardProps {
  id: string;
  firstName: string;
  lastName: string;
  expertise: string;
  avatarUrl?: string;
  rating?: number;
  onPress: (id: string) => void;
  index?: number;
}

export function ProviderCard({ id, firstName, lastName, expertise, avatarUrl, rating = 5.0, onPress, index = 0 }: ProviderCardProps) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 50 }}
      style={{ marginBottom: 12, marginHorizontal: 16 }}
    >
      <TouchableOpacity onPress={() => onPress(id)} activeOpacity={0.8}>
        <LinearGradient
          colors={isDark ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)'] : ['#ffffff', '#f8fafc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            {
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              flexDirection: direction.isRTL ? 'row-reverse' : 'row',
            }
          ]}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }]}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
          )}

          <View style={[styles.info, direction.startItems]}>
            <Text style={[styles.name, { color: colors.text, textAlign: direction.isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {firstName} {lastName}
            </Text>
            <Text style={[styles.expertise, { color: colors.textSecondary, textAlign: direction.isRTL ? 'right' : 'left' }]} numberOfLines={1}>
              {expertise}
            </Text>

            <View style={[styles.footer, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[styles.ratingBadge, { backgroundColor: 'rgba(250, 204, 21, 0.15)', flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="star" size={12} color="#eab308" />
                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View style={{ justifyContent: 'center', paddingHorizontal: 8 }}>
            <Ionicons name={direction.isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textTertiary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    marginHorizontal: 4,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 15,
    marginBottom: 4,
  },
  expertise: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 8,
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
    color: '#eab308',
  },
});
