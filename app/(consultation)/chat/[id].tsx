import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { BackHeader } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  // Mock messages for UI layout purposes (since we don't have the exact API response shape immediately)
  const messages = [
    { id: '1', text: 'سلام، وقت بخیر. آیا آزمایش‌ها را بررسی کردید؟', isMine: true, time: '10:00' },
    { id: '2', text: 'سلام. بله، نتایج کاملا نرمال است و جای نگرانی نیست.', isMine: false, time: '10:05' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <BackHeader title="پشتیبانی مشاوره" onBackPress={() => router.back()} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlashList
          data={messages}
          // @ts-ignore - TS types for FlashList are missing these in this environment
          estimatedItemSize={60}
          inverted
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }: any) => {
            const isMine = item.isMine;
            return (
              <View
                style={{
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  backgroundColor: isMine ? colors.primary : isDark ? 'rgba(255,255,255,0.1)' : colors.card,
                  padding: 12,
                  borderRadius: 16,
                  borderBottomRightRadius: isMine ? 4 : 16,
                  borderBottomLeftRadius: isMine ? 16 : 4,
                  marginBottom: 12,
                  maxWidth: '80%',
                }}
              >
                <Text style={{ fontFamily: 'IRANSans', fontSize: 14, color: isMine ? '#fff' : colors.text }}>
                  {item.text}
                </Text>
                <Text style={{ fontFamily: 'IRANSans', fontSize: 10, color: isMine ? 'rgba(255,255,255,0.7)' : colors.textTertiary, alignSelf: 'flex-end', marginTop: 4 }}>
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        <View style={[styles.inputContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TextInput
            placeholder="پیام خود را بنویسید..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : colors.background, textAlign: direction.isRTL ? 'right' : 'left' }]}
          />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'IRANSans',
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
