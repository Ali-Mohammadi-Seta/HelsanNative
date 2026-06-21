import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

interface TicketItemProps {
  id: string;
  title: string;
  status: string;
  date: string;
  onPress: (id: string) => void;
  index?: number;
}

export function TicketItem({ id, title, status, date, onPress, index = 0 }: TicketItemProps) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'open': return '#3b82f6'; // blue
      case 'closed': return '#10b981'; // green
      default: return colors.textSecondary;
    }
  };

  const statusColor = getStatusColor();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
      style={{ marginBottom: 12, marginHorizontal: 16 }}
    >
      <TouchableOpacity 
        onPress={() => onPress(id)} 
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.card,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
            flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          }
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
          <Ionicons name="chatbubbles" size={24} color={statusColor} />
        </View>

        <View style={[styles.info, direction.startItems]}>
          <Text style={[styles.title, { color: colors.text, textAlign: direction.isRTL ? 'right' : 'left' }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.meta, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
            <Text style={[styles.date, { color: colors.textTertiary }]}>{date}</Text>
          </View>
        </View>

        <View style={{ justifyContent: 'center' }}>
          <Ionicons name={direction.isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 15,
    marginBottom: 8,
  },
  meta: {
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 11,
  },
  date: {
    fontFamily: 'IRANSans',
    fontSize: 12,
  },
});
