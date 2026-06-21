import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/lib/hooks/useDirection';
import { BackHeader } from '@/components';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { MotiView } from 'moti';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Mock data until API is back online
const mockTransactions = [
  { id: '1', amount: 150000, type: 'deposit', date: '۱۴۰۳/۰۴/۱۵', status: 'success', description: 'شارژ کیف پول' },
  { id: '2', amount: 250000, type: 'withdraw', date: '۱۴۰۳/۰۴/۱۴', status: 'success', description: 'مشاوره با دکتر محمدی' },
  { id: '3', amount: 50000, type: 'deposit', date: '۱۴۰۳/۰۴/۱۰', status: 'pending', description: 'بازگشت وجه لغو نوبت' },
];

function TransactionItem({ item, index }: { item: any; index: number }) {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  
  const isDeposit = item.type === 'deposit';
  
  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(400).springify()}>
      <View style={[
        styles.transactionCard, 
        { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
        }
      ]}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: isDeposit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons 
            name={isDeposit ? 'arrow-down' : 'arrow-up'} 
            size={24} 
            color={isDeposit ? '#10b981' : '#ef4444'} 
          />
        </View>

        <View style={{ flex: 1, marginHorizontal: 12, alignItems: direction.isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 14, color: colors.text, marginBottom: 4 }}>
            {item.description}
          </Text>
          <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 11, color: colors.textTertiary }}>
              {item.date}
            </Text>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
            <Text style={{ 
              fontFamily: 'IRANSans-Medium', 
              fontSize: 11, 
              color: item.status === 'success' ? '#10b981' : item.status === 'pending' ? '#f59e0b' : '#ef4444' 
            }}>
              {item.status === 'success' ? 'موفق' : item.status === 'pending' ? 'در انتظار' : 'ناموفق'}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: direction.isRTL ? 'flex-start' : 'flex-end' }}>
          <Text style={{ 
            fontFamily: 'IRANSans-Bold', 
            fontSize: 15, 
            color: isDeposit ? '#10b981' : colors.text 
          }}>
            {isDeposit ? '+' : '-'} {item.amount.toLocaleString('fa-IR')}
          </Text>
          <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 11, color: colors.textTertiary, marginTop: 4 }}>
            تومان
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function WalletScreen() {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdraw'>('all');
  
  // Fake balance logic
  const balance = 1250000;
  
  const filteredData = mockTransactions.filter(t => activeTab === 'all' || t.type === activeTab);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title="امور مالی و کیف پول" onBackPress={() => router.back()} />

      <FlashList
        data={filteredData}
        // @ts-ignore - TS types for FlashList are missing these in this environment
        estimatedItemSize={80}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 24 }}>
            <Animated.View entering={FadeInDown.duration(500).springify()}>
              <LinearGradient
                colors={isDark ? ['#1e1b4b', '#312e81', '#4338ca'] : ['#4f46e5', '#6366f1', '#818cf8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}
              >
                <View style={styles.glassOverlay} />
                
                <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 8, textAlign: 'center' }}>
                  موجودی کیف پول شما
                </Text>
                
                <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 36, color: '#ffffff' }}>
                    {balance.toLocaleString('fa-IR')}
                  </Text>
                  <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 12 }}>
                    تومان
                  </Text>
                </View>

                <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', gap: 12 }}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ffffff' }]}>
                    <Ionicons name="add" size={20} color="#4338ca" />
                    <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 14, color: '#4338ca', marginLeft: 6 }}>افزایش موجودی</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name="arrow-up" size={20} color="#ffffff" />
                    <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 14, color: '#ffffff', marginLeft: 6 }}>برداشت وجه</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>

            <View style={{ flexDirection: direction.isRTL ? 'row-reverse' : 'row', marginTop: 24, marginBottom: 8, gap: 8 }}>
              {([
                { key: 'all', label: 'همه تراکنش‌ها' },
                { key: 'deposit', label: 'واریزی‌ها' },
                { key: 'withdraw', label: 'برداشتی‌ها' },
              ] as const).map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: activeTab === tab.key ? colors.primary : isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                  }}
                >
                  <Text style={{ 
                    fontFamily: activeTab === tab.key ? 'IRANSans-Bold' : 'IRANSans-Medium', 
                    fontSize: 12, 
                    color: activeTab === tab.key ? '#fff' : colors.textSecondary 
                  }}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }: any) => <TransactionItem item={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
  }
});
