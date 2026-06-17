import { BackHeader, Button, FloatingInput, FloatingSelect, Modal, SkeletonList } from '@/components';
import {
  closeSupportTicketApi,
  createSupportTicketApi,
  getSupportTicketApi,
  getSupportTicketsApi,
  replySupportTicketApi,
  type SupportTicketStatus,
} from '@/lib/api/apiService';
import { useDirection } from '@/lib/hooks/useDirection';
import { showToast } from '@/lib/toast/showToast';
import { useTheme } from '@/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type TicketFilter = 'all' | SupportTicketStatus;

type SupportTicketMessage = {
  senderType?: 'client' | 'admin' | 'user';
  senderName?: string;
  content?: string;
  body?: string;
  createdAt?: string;
};

type SupportTicketSummary = {
  id: string;
  ticketNumber?: string;
  reference?: string;
  subject?: string;
  status?: TicketFilter;
  messageCount?: number;
  lastMessageAt?: string;
  latestMessagePreview?: string;
  lastMessagePreview?: string;
  createdAt?: string;
};

const PAGE_LIMIT = 20;

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
};

const getStatusTone = (status?: string) => {
  switch (status) {
    case 'answered':
      return { bg: '#dbeafe', text: '#1d4ed8', dot: '#2563eb' };
    case 'closed':
      return { bg: '#f3f4f6', text: '#4b5563', dot: '#6b7280' };
    default:
      return { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' };
  }
};

export default function SupportScreen() {
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const queryClient = useQueryClient();
  const language = direction.isRTL ? 'fa' : 'en';
  const [filter, setFilter] = useState<TicketFilter>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [subjectTopic, setSubjectTopic] = useState('account_access');
  const [customSubject, setCustomSubject] = useState('');
  const [content, setContent] = useState('');
  const [reply, setReply] = useState('');

  const text = {
    title: direction.isRTL ? 'پشتیبانی' : 'Support',
    heroTitle: direction.isRTL ? 'چطور می‌توانیم کمک کنیم؟' : 'How can we help?',
    heroSub: direction.isRTL
      ? 'درخواست‌های خود را ثبت کنید و پاسخ تیم پشتیبانی را همین‌جا دنبال کنید.'
      : 'Create requests and follow replies from the support team here.',
    newTicket: direction.isRTL ? 'تیکت جدید' : 'New ticket',
    tickets: direction.isRTL ? 'تیکت‌های شما' : 'Your tickets',
    all: direction.isRTL ? 'همه' : 'All',
    open: direction.isRTL ? 'باز' : 'Open',
    answered: direction.isRTL ? 'پاسخ داده شده' : 'Answered',
    closed: direction.isRTL ? 'بسته شده' : 'Closed',
    noSubject: direction.isRTL ? 'بدون موضوع' : 'No subject',
    empty: direction.isRTL ? 'هنوز تیکتی ثبت نشده است.' : 'No support tickets yet.',
    message: direction.isRTL ? 'متن پیام' : 'Message',
    subject: direction.isRTL ? 'موضوع تیکت' : 'Ticket subject',
    customSubject: direction.isRTL ? 'موضوع سفارشی' : 'Custom subject',
    create: direction.isRTL ? 'ثبت تیکت' : 'Create ticket',
    reply: direction.isRTL ? 'ارسال پاسخ' : 'Send reply',
    close: direction.isRTL ? 'بستن تیکت' : 'Close ticket',
    closedHint: direction.isRTL ? 'این تیکت بسته شده است.' : 'This ticket is closed.',
    success: direction.isRTL ? 'انجام شد' : 'Done',
    failed: direction.isRTL ? 'درخواست انجام نشد.' : 'Request failed.',
    you: direction.isRTL ? 'شما' : 'You',
    admin: direction.isRTL ? 'پشتیبانی' : 'Support',
  };

  const filters: { key: TicketFilter; label: string }[] = [
    { key: 'all', label: text.all },
    { key: 'open', label: text.open },
    { key: 'answered', label: text.answered },
    { key: 'closed', label: text.closed },
  ];

  const subjectOptions = [
    { label: direction.isRTL ? 'دسترسی به حساب کاربری' : 'Account access', value: 'account_access' },
    { label: direction.isRTL ? 'اطلاعات پروفایل' : 'Profile information', value: 'profile_info' },
    { label: direction.isRTL ? 'پرونده پزشکی' : 'Medical record', value: 'medical_record' },
    { label: direction.isRTL ? 'ارتقای نقش' : 'Role upgrade', value: 'role_upgrade' },
    { label: direction.isRTL ? 'خدمات سامانه' : 'Services', value: 'services' },
    { label: direction.isRTL ? 'مشکل فنی' : 'Technical issue', value: 'technical_issue' },
    { label: direction.isRTL ? 'پیگیری درخواست' : 'Request follow-up', value: 'request_follow_up' },
    { label: direction.isRTL ? 'سایر' : 'Other', value: 'other' },
  ];

  const ticketsQuery = useQuery({
    queryKey: ['supportTickets', filter],
    queryFn: () =>
      getSupportTicketsApi({
        status: filter === 'all' ? undefined : filter,
        page: 1,
        limit: PAGE_LIMIT,
      }),
  });

  const ticketDetailQuery = useQuery({
    queryKey: ['supportTicket', selectedTicketId],
    queryFn: () => getSupportTicketApi(selectedTicketId || ''),
    enabled: !!selectedTicketId,
  });

  const createMutation = useMutation({
    mutationFn: createSupportTicketApi,
    onSuccess: (result) => {
      setCreateOpen(false);
      setContent('');
      setCustomSubject('');
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      showToast({ type: 'success', message: result, fallback: text.success, language });
    },
    onError: (error) => showToast({ type: 'error', message: error, fallback: text.failed, language }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ ticketId, content: replyContent }: { ticketId: string; content: string }) =>
      replySupportTicketApi(ticketId, { content: replyContent }),
    onSuccess: (result) => {
      setReply('');
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      queryClient.invalidateQueries({ queryKey: ['supportTicket', selectedTicketId] });
      showToast({ type: 'success', message: result, fallback: text.success, language });
    },
    onError: (error) => showToast({ type: 'error', message: error, fallback: text.failed, language }),
  });

  const closeMutation = useMutation({
    mutationFn: closeSupportTicketApi,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
      queryClient.invalidateQueries({ queryKey: ['supportTicket', selectedTicketId] });
      showToast({ type: 'success', message: result, fallback: text.success, language });
    },
    onError: (error) => showToast({ type: 'error', message: error, fallback: text.failed, language }),
  });

  const tickets: SupportTicketSummary[] = useMemo(() => {
    const data = ticketsQuery.data as any;
    return data?.docs ?? data?.items ?? data?.data?.docs ?? [];
  }, [ticketsQuery.data]);

  const detail = useMemo(() => {
    const raw = ticketDetailQuery.data as any;
    if (!raw) return null;
    if (raw.ticket) return { ...raw.ticket, messages: raw.messages ?? [] };
    return raw;
  }, [ticketDetailQuery.data]);

  const selectedMessages: SupportTicketMessage[] = detail?.messages ?? [];
  const selectedStatus = detail?.status as string | undefined;
  const canReply = selectedStatus !== 'closed';

  const handleCreate = () => {
    const selectedLabel = subjectOptions.find((item) => item.value === subjectTopic)?.label ?? text.subject;
    const finalSubject = subjectTopic === 'other' ? customSubject.trim() : selectedLabel;
    if (!finalSubject || !content.trim()) return;
    createMutation.mutate({ subject: finalSubject, content: content.trim() });
  };

  const handleReply = () => {
    if (!selectedTicketId || !reply.trim()) return;
    replyMutation.mutate({ ticketId: selectedTicketId, content: reply.trim() });
  };

  return (
    <View className="flex-1">
      <BackHeader title={text.title} />
      <ScrollView
        className={`flex-1 ${isDark ? 'bg-background' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
        >
          <View className="items-center mb-3" style={direction.row}>
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-primary/15">
              <Ionicons name="headset-outline" size={26} color={colors.primary} />
            </View>
            <View className="flex-1 mx-3" style={direction.startItems}>
              <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 18, ...direction.text }}>
                {text.heroTitle}
              </Text>
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 13, lineHeight: 22, ...direction.text }}>
                {text.heroSub}
              </Text>
            </View>
          </View>
          <Button
            type="primary"
            fullWidth
            icon={<Ionicons name="add-circle-outline" size={18} color="#ffffff" />}
            onPress={() => setCreateOpen(true)}
          >
            {text.newTicket}
          </Button>
        </View>

        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, flexDirection: direction.isRTL ? 'row-reverse' : 'row' }}
          >
            {filters.map((item) => {
              const active = item.key === filter;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setFilter(item.key)}
                  className="rounded-full px-4 py-2"
                  style={{
                    backgroundColor: active ? colors.primary : isDark ? colors.card : '#ffffff',
                    borderWidth: active ? 0 : 1,
                    borderColor: isDark ? colors.border : '#e5e7eb',
                  }}
                >
                  <Text
                    style={{
                      color: active ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans-Bold',
                      fontSize: 12,
                      writingDirection: direction.dir,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 16, marginBottom: 10, ...direction.text }}>
          {text.tickets}
        </Text>

        {ticketsQuery.isLoading ? (
          <View>
            <SkeletonList count={4} rows={3} avatar />
          </View>
        ) : tickets.length === 0 ? (
          <View className="rounded-2xl p-8 items-center" style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}>
            <Ionicons name="chatbox-ellipses-outline" size={42} color={colors.primary} />
            <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', marginTop: 10, ...direction.centeredText }}>
              {text.empty}
            </Text>
          </View>
        ) : (
          tickets.map((ticket) => {
            const status = getStatusTone(ticket.status);
            return (
              <TouchableOpacity
                key={ticket.id}
                className="rounded-2xl p-4 mb-3"
                style={{ backgroundColor: isDark ? colors.card : '#ffffff' }}
                onPress={() => setSelectedTicketId(ticket.id)}
                activeOpacity={0.75}
              >
                <View className="items-start justify-between" style={direction.row}>
                  <View className="flex-1" style={direction.startItems}>
                    <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold', fontSize: 15, ...direction.text }}>
                      {ticket.subject || text.noSubject}
                    </Text>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontFamily: 'IRANSans',
                        fontSize: 12,
                        marginTop: 6,
                        ...direction.text,
                      }}
                      numberOfLines={2}
                    >
                      {ticket.latestMessagePreview || ticket.lastMessagePreview || '-'}
                    </Text>
                  </View>
                  <View className="rounded-full px-3 py-1 mx-2" style={{ backgroundColor: status.bg }}>
                    <Text style={{ color: status.text, fontFamily: 'IRANSans-Bold', fontSize: 11 }}>
                      {filters.find((item) => item.key === ticket.status)?.label ?? text.open}
                    </Text>
                  </View>
                </View>
                <View className="items-center mt-3" style={direction.row}>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 11 }}>
                    {ticket.ticketNumber || ticket.reference || ''}
                  </Text>
                  <View className="w-1 h-1 rounded-full mx-2" style={{ backgroundColor: colors.textSecondary }} />
                  <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', fontSize: 11 }}>
                    {formatDate(ticket.lastMessageAt || ticket.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={text.newTicket}
        size="lg"
      >
        <FloatingSelect
          label={text.subject}
          value={subjectTopic}
          options={subjectOptions}
          onChange={(value) => setSubjectTopic(String(value))}
        />
        {subjectTopic === 'other' && (
          <FloatingInput
            label={text.customSubject}
            value={customSubject}
            onChangeText={setCustomSubject}
          />
        )}
        <FloatingInput
          label={text.message}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={5}
        />
        <Button
          type="primary"
          fullWidth
          loading={createMutation.isPending}
          onPress={handleCreate}
        >
          {text.create}
        </Button>
      </Modal>

      <Modal
        open={!!selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        title={detail?.subject || text.title}
        size="xl"
      >
        {ticketDetailQuery.isLoading ? (
          <View className="py-2">
            <SkeletonList count={3} rows={2} avatar={false} />
          </View>
        ) : (
          <View>
            {selectedMessages.map((message, index) => {
              const isClient = message.senderType === 'client' || message.senderType === 'user';
              return (
                <View
                  key={`${message.createdAt}-${index}`}
                  className="rounded-2xl p-3 mb-3"
                  style={{
                    backgroundColor: isClient ? colors.primary : isDark ? '#1f2937' : '#f3f4f6',
                    alignSelf: isClient
                      ? direction.isRTL ? 'flex-end' : 'flex-start'
                      : direction.isRTL ? 'flex-start' : 'flex-end',
                    maxWidth: '92%',
                  }}
                >
                  <Text
                    style={{
                      color: isClient ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans-Bold',
                      fontSize: 12,
                      ...direction.text,
                    }}
                  >
                    {isClient ? text.you : message.senderName || text.admin}
                  </Text>
                  <Text
                    style={{
                      color: isClient ? '#ffffff' : colors.text,
                      fontFamily: 'IRANSans',
                      fontSize: 13,
                      lineHeight: 22,
                      marginTop: 4,
                      ...direction.text,
                    }}
                  >
                    {message.content || message.body || '-'}
                  </Text>
                  <Text
                    style={{
                      color: isClient ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                      fontFamily: 'IRANSans',
                      fontSize: 10,
                      marginTop: 6,
                      ...direction.text,
                    }}
                  >
                    {formatDate(message.createdAt)}
                  </Text>
                </View>
              );
            })}

            {canReply ? (
              <>
                <FloatingInput
                  label={text.message}
                  value={reply}
                  onChangeText={setReply}
                  multiline
                  numberOfLines={4}
                />
                <View className="gap-3">
                  <Button
                    type="primary"
                    fullWidth
                    loading={replyMutation.isPending}
                    onPress={handleReply}
                  >
                    {text.reply}
                  </Button>
                  {selectedTicketId && (
                    <Button
                      type="danger"
                      variant="outline"
                      fullWidth
                      loading={closeMutation.isPending}
                      onPress={() => closeMutation.mutate(selectedTicketId)}
                    >
                      {text.close}
                    </Button>
                  )}
                </View>
              </>
            ) : (
              <Text style={{ color: colors.textSecondary, fontFamily: 'IRANSans', ...direction.centeredText }}>
                {text.closedHint}
              </Text>
            )}
          </View>
        )}
      </Modal>
    </View>
  );
}
