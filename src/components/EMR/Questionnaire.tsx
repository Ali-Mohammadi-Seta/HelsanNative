// src/components/EMR/Questionnaire.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme, gradients, shadows } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { useGetQuestionnaireCachedInfo } from '@/lib/hooks/emr/useGetQuestionnaireCachedInfo';
import { useSaveDoneQuestionnaire } from '@/lib/hooks/emr/useSaveDoneQuestionnaire';
import { showToast } from '@/lib/toast/showToast';
import Button from '@/components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ─── Types ─────────────────────────────────────────────────── */
interface QuestionOption {
  id: number;
  title: string;
  value: string;
}

interface Question {
  id: number;
  value: string;
  title: string;
  options: QuestionOption[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

type Answers = Record<string, string>;

/* ─── Animated Touchable ─────────────────────────────────────── */
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

/* ─── Option Item ────────────────────────────────────────────── */
function OptionItem({
  option,
  selected,
  accentColor,
  onPress,
  index,
}: {
  option: QuestionOption;
  selected: boolean;
  accentColor: string;
  onPress: () => void;
  index: number;
}) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 16, stiffness: 130, delay: index * 60 }}
    >
      <AnimatedTouchable
        activeOpacity={0.8}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 14, stiffness: 250 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 250 });
        }}
        onPress={onPress}
        style={animStyle}
      >
        <View
          style={[
            styles.optionRow,
            {
              backgroundColor: selected
                ? `${accentColor}14`
                : isDark
                ? colors.surface
                : '#f9fafb',
              borderColor: selected
                ? accentColor
                : isDark
                ? colors.border
                : '#e5e7eb',
              borderWidth: selected ? 2 : 1,
            },
          ]}
        >
          {/* Index badge */}
          <View
            style={[
              styles.optionIndex,
              {
                backgroundColor: selected ? accentColor : `${accentColor}22`,
              },
            ]}
          >
            <Text
              style={[
                styles.optionIndexText,
                { color: selected ? '#ffffff' : accentColor },
              ]}
            >
              {option.id}
            </Text>
          </View>

          {/* Option text */}
          <Text
            style={[
              styles.optionText,
              {
                color: selected ? accentColor : colors.text,
                fontFamily: selected ? 'IRANSans-Bold' : 'IRANSans',
              },
            ]}
          >
            {option.title}
          </Text>

          {/* Check icon */}
          <AnimatePresence>
            {selected && (
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 14, stiffness: 200 }}
              >
                <View
                  style={[
                    styles.checkIcon,
                    { backgroundColor: accentColor },
                  ]}
                >
                  <Ionicons name="checkmark" size={12} color="#ffffff" />
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </AnimatedTouchable>
    </MotiView>
  );
}

/* ─── Progress Bar ───────────────────────────────────────────── */
function ProgressBar({
  total,
  current,
  answered,
  onStepPress,
  accentColor,
}: {
  total: number;
  current: number;
  answered: Set<number>;
  onStepPress: (idx: number) => void;
  accentColor: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.progressWrap}>
      {/* Step dots row */}
      <View style={styles.progressDots}>
        {Array.from({ length: total }).map((_, idx) => {
          const isDone = answered.has(idx);
          const isActive = idx === current;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onStepPress(idx)}
              style={{ flex: 1, paddingVertical: 6 }}
              activeOpacity={0.7}
            >
              <MotiView
                animate={{
                  height: isActive ? 8 : 4,
                  backgroundColor: isDone
                    ? accentColor
                    : isActive
                    ? `${accentColor}88`
                    : colors.divider,
                }}
                transition={{ type: 'spring', damping: 18, stiffness: 160 }}
                style={styles.progressSegment}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count label */}
      <View style={styles.progressLabelRow}>
        <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
          {answered.size}/{total}
        </Text>
      </View>
    </View>
  );
}

/* ─── Start Screen ───────────────────────────────────────────── */
function StartScreen({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const gradientColors = isDark
    ? gradients.heroBanner.dark
    : (['#ecfdf5', '#f0fdf4', '#ffffff'] as [string, string, string]);

  return (
    <Animated.View
      entering={FadeInDown.duration(340).springify().damping(18)}
      style={styles.startWrap}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.startCard,
          shadows.lg,
          {
            borderColor: isDark ? colors.border : '#bbf7d0',
          },
        ]}
      >
        {/* Animated pulse ring */}
        <MotiView
          from={{ scale: 0.9, opacity: 0.6 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{
            type: 'timing',
            duration: 1600,
            loop: true,
          }}
          style={[
            styles.pulseRing,
            { borderColor: colors.primary },
          ]}
        />

        <View
          style={[
            styles.startIcon,
            { backgroundColor: `${colors.primary}1e` },
          ]}
        >
          <Ionicons name="clipboard-outline" size={52} color={colors.primary} />
        </View>

        <Text
          style={[
            styles.startTitle,
            { color: colors.text, writingDirection: direction.dir },
          ]}
        >
          {t('q_01')}
        </Text>

        <Text
          style={[
            styles.startDesc,
            {
              color: colors.textSecondary,
              writingDirection: direction.dir,
              textAlign: direction.isRTL ? 'right' : 'left',
            },
          ]}
        >
          {direction.isRTL
            ? 'با پاسخ به چند سوال ساده، پرونده سلامت شما تکمیل می‌شود.'
            : 'Complete your health profile by answering a few simple questions.'}
        </Text>

        {/* Feature bullets */}
        {[
          { icon: 'lock-closed-outline' as const, fa: 'اطلاعات شما محرمانه است', en: 'Your data is private' },
          { icon: 'time-outline' as const, fa: 'کمتر از ۲ دقیقه زمان می‌برد', en: 'Takes less than 2 minutes' },
          { icon: 'save-outline' as const, fa: 'می‌توانید ذخیره کنید', en: 'You can save progress' },
        ].map((feat, idx) => (
          <MotiView
            key={feat.en}
            from={{ opacity: 0, translateX: direction.isRTL ? 14 : -14 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 280, delay: 200 + idx * 80 }}
            style={[
              styles.featureRow,
              {
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                { backgroundColor: `${colors.primary}18` },
              ]}
            >
              <Ionicons name={feat.icon} size={14} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.featureText,
                { color: colors.textSecondary, writingDirection: direction.dir },
              ]}
            >
              {direction.isRTL ? feat.fa : feat.en}
            </Text>
          </MotiView>
        ))}

        <Button
          type="primary"
          size="large"
          fullWidth
          onPress={onStart}
          icon={
            <Ionicons
              name={direction.isRTL ? 'arrow-back' : 'arrow-forward'}
              size={18}
              color="#ffffff"
            />
          }
        >
          {t('q_02')}
        </Button>
      </LinearGradient>
    </Animated.View>
  );
}

/* ─── Main Questionnaire ─────────────────────────────────────── */
const Questionnaire: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const language = direction.isRTL ? 'fa' : 'en';

  const { cachedInfo } = useGetQuestionnaireCachedInfo();
  const { saveDoneQuestionnaire, isSending } = useSaveDoneQuestionnaire();

  const [startStep, setStartStep] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [slideDir, setSlideDir] = useState<'forward' | 'backward'>('forward');
  const [questionKey, setQuestionKey] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  // ── Questions definition ─────────────────────────────────────
  const questions: Question[] = [
    {
      id: 1,
      value: 'bloodGroup',
      title: t('bloodGroup'),
      icon: 'water-outline',
      color: '#ef4444',
      options: [
        { id: 1, title: 'O', value: 'O' },
        { id: 2, title: 'A', value: 'A' },
        { id: 3, title: 'B', value: 'B' },
        { id: 4, title: 'AB', value: 'AB' },
      ],
    },
    {
      id: 2,
      value: 'bloodRH',
      title: 'RH',
      icon: 'add-circle-outline',
      color: '#f59e0b',
      options: [
        { id: 1, title: t('mosbat'), value: t('mosbat') },
        { id: 2, title: t('manfi'), value: t('manfi') },
      ],
    },
    {
      id: 3,
      value: 'hormonalProblems',
      title: t('hormonalProblems'),
      icon: 'git-network-outline',
      color: '#8b5cf6',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 4,
      value: 'diabetes',
      title: direction.isRTL ? 'دیابت' : 'Diabetes',
      icon: 'flask-outline',
      color: '#06b6d4',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 5,
      value: 'heartDisease',
      title: direction.isRTL ? 'بیماری قلبی' : 'Heart Disease',
      icon: 'heart-outline',
      color: '#ec4899',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 6,
      value: 'bloodPressure',
      title: direction.isRTL ? 'فشار خون' : 'Blood Pressure',
      icon: 'fitness-outline',
      color: '#3b82f6',
      options: [
        { id: 1, title: direction.isRTL ? 'فشار بالا' : 'High', value: '1' },
        { id: 2, title: direction.isRTL ? 'نرمال' : 'Normal', value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 7,
      value: 'asthma',
      title: direction.isRTL ? 'آسم' : 'Asthma',
      icon: 'partly-sunny-outline',
      color: '#10b981',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 8,
      value: 'kidneyDisease',
      title: direction.isRTL ? 'بیماری کلیوی' : 'Kidney Disease',
      icon: 'medical-outline',
      color: '#f97316',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 9,
      value: 'smoker',
      title: direction.isRTL ? 'سیگاری' : 'Smoker',
      icon: 'warning-outline',
      color: '#64748b',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
      ],
    },
    {
      id: 10,
      value: 'alcohol',
      title: direction.isRTL ? 'مصرف الکل' : 'Alcohol Use',
      icon: 'wine-outline',
      color: '#a855f7',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
      ],
    },
    {
      id: 11,
      value: 'cancerHistory',
      title: direction.isRTL ? 'سابقه سرطان' : 'Cancer History',
      icon: 'ribbon-outline',
      color: '#dc2626',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 12,
      value: 'mentalDisorders',
      title: direction.isRTL ? 'اختلالات روانی' : 'Mental Disorders',
      icon: 'happy-outline',
      color: '#7c3aed',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    {
      id: 13,
      value: 'drugAbuse',
      title: direction.isRTL ? 'اعتیاد' : 'Drug Abuse',
      icon: 'bandage-outline',
      color: '#b45309',
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
      ],
    },
  ];

  const total = questions.length;
  const currentQuestion = questions[currentStep];
  const accentColor = currentQuestion?.color ?? colors.primary;

  // Load cached answers
  useEffect(() => {
    if (cachedInfo) {
      setAnswers(cachedInfo as Answers);
    }
  }, [cachedInfo]);

  // Track answered steps for progress bar
  const answeredSet = new Set(
    questions
      .map((q, idx) => (answers.hasOwnProperty(q.value) ? idx : -1))
      .filter((v) => v >= 0),
  );

  const allAnswered = questions.every((q) => answers.hasOwnProperty(q.value));

  // ── Handlers ─────────────────────────────────────────────────
  const answerHandler = (questionId: number, value: string) => {
    setAnswers((prev) => {
      const q = questions.find((q) => q.id === questionId);
      if (!q) return prev;
      return { ...prev, [q.value]: value };
    });
  };

  const goToStep = (step: number, dir: 'forward' | 'backward' = 'forward') => {
    if (step < 0 || step >= total) return;
    setSlideDir(dir);
    setCurrentStep(step);
    setQuestionKey((k) => k + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const nextStep = () => {
    if (currentStep < total - 1) goToStep(currentStep + 1, 'forward');
  };

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1, 'backward');
  };

  const sendHandler = () => {
    if (!allAnswered) return;
    saveDoneQuestionnaire(
      { isDone: true, ...answers },
      {
        onSuccess: (result: any) => {
          if (result?.isSuccess) {
            showToast({ type: 'success', message: result, fallback: t('sentQuess'), language });
            setAnswers({});
            setCurrentStep(0);
            setStartStep(true);
          }
        },
      },
    );
  };

  const saveHandler = () => {
    saveDoneQuestionnaire(
      { isDone: false, ...answers },
      {
        onSuccess: (result: any) => {
          if (result?.isSuccess) {
            showToast({ type: 'success', message: result, fallback: t('q_09'), language });
          }
        },
      },
    );
  };

  const isSelected = (questionId: number, value: string) => {
    const q = questions.find((q) => q.id === questionId);
    return q ? answers[q.value] === value : false;
  };

  // ── Start screen ─────────────────────────────────────────────
  if (startStep) {
    return (
      <ScrollView
        contentContainerStyle={styles.startScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StartScreen onStart={() => setStartStep(false)} />
      </ScrollView>
    );
  }

  // ── Entering animation direction ─────────────────────────────
  const enteringAnim =
    slideDir === 'forward'
      ? FadeInRight.duration(260).springify().damping(18)
      : FadeInLeft.duration(260).springify().damping(18);

  // ── Question screen ──────────────────────────────────────────
  return (
    <View style={[styles.wrap, { backgroundColor: isDark ? colors.background : '#f4f7f4' }]}>
      {/* Progress Bar */}
      <Animated.View entering={FadeIn.duration(300)}>
        <ProgressBar
          total={total}
          current={currentStep}
          answered={answeredSet}
          onStepPress={(idx) => goToStep(idx, idx > currentStep ? 'forward' : 'backward')}
          accentColor={accentColor}
        />
      </Animated.View>

      {/* Question Card */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.questionScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          key={questionKey}
          entering={enteringAnim}
          exiting={FadeOut.duration(140)}
          style={[
            styles.questionCard,
            shadows.md,
            {
              backgroundColor: isDark ? colors.card : '#ffffff',
              borderColor: isDark ? colors.border : `${accentColor}20`,
              borderWidth: 1,
            },
          ]}
        >
          {/* Question header */}
          <LinearGradient
            colors={[`${accentColor}18`, `${accentColor}06`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.questionHeader}
          >
            <View
              style={[
                styles.questionHeaderContent,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <View
                style={[
                  styles.questionIcon,
                  { backgroundColor: `${accentColor}28` },
                ]}
              >
                <Ionicons
                  name={currentQuestion.icon}
                  size={26}
                  color={accentColor}
                />
              </View>
              <View
                style={[
                  { flex: 1, marginHorizontal: 12 },
                  direction.startItems,
                ]}
              >
                <Text
                  style={[
                    styles.questionStep,
                    { color: accentColor },
                  ]}
                >
                  {direction.isRTL
                    ? `سوال ${currentStep + 1} از ${total}`
                    : `Question ${currentStep + 1} of ${total}`}
                </Text>
                <Text
                  style={[
                    styles.questionTitle,
                    { color: colors.text, writingDirection: direction.dir },
                  ]}
                >
                  {currentQuestion.title}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Options */}
          <View style={styles.optionsList}>
            {currentQuestion.options.map((option, idx) => (
              <OptionItem
                key={option.id}
                option={option}
                selected={isSelected(currentQuestion.id, option.value)}
                accentColor={accentColor}
                onPress={() => {
                  answerHandler(currentQuestion.id, option.value);
                  // Auto-advance after short delay
                  if (currentStep < total - 1) {
                    setTimeout(() => nextStep(), 380);
                  }
                }}
                index={idx}
              />
            ))}
          </View>
        </Animated.View>

        {/* Completion message */}
        <AnimatePresence>
          {allAnswered && (
            <MotiView
              from={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', damping: 16, stiffness: 130 }}
              style={[
                styles.completionBanner,
                {
                  backgroundColor: isDark ? '#0d2a1a' : '#f0fdf4',
                  borderColor: '#22c55e',
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text
                style={[
                  styles.completionText,
                  { color: '#16a34a', writingDirection: direction.dir },
                ]}
              >
                {direction.isRTL
                  ? 'همه سوالات پاسخ داده شدند!'
                  : 'All questions answered!'}
              </Text>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>

      {/* Bottom action bar */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100)}
        style={[
          styles.actionBar,
          {
            backgroundColor: isDark ? colors.card : '#ffffff',
            borderTopColor: isDark ? colors.border : '#f0f0f0',
          },
        ]}
      >
        {/* Nav buttons */}
        <View
          style={[
            styles.navRow,
            { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <Button
            type="secondary"
            variant="outline"
            size="small"
            disabled={currentStep === 0}
            onPress={prevStep}
            icon={
              <Ionicons
                name={direction.isRTL ? 'chevron-forward' : 'chevron-back'}
                size={16}
                color={currentStep === 0 ? colors.textTertiary : colors.primary}
              />
            }
            style={{ flex: 1 }}
          >
            {t('q_05')}
          </Button>

          <View
            style={[
              styles.stepIndicator,
              { backgroundColor: `${accentColor}18` },
            ]}
          >
            <Text style={[styles.stepIndicatorText, { color: accentColor }]}>
              {currentStep + 1}/{total}
            </Text>
          </View>

          <Button
            type="primary"
            size="small"
            disabled={currentStep === total - 1}
            onPress={nextStep}
            icon={
              <Ionicons
                name={direction.isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color="#ffffff"
              />
            }
            style={{ flex: 1 }}
          >
            {t('q_04')}
          </Button>
        </View>

        {/* Save / Submit */}
        <View
          style={[
            styles.submitRow,
            { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <Button
            type="secondary"
            variant="outline"
            size="default"
            loading={isSending}
            onPress={saveHandler}
            icon={
              <Ionicons name="save-outline" size={16} color={colors.primary} />
            }
            style={{ flex: 1 }}
          >
            {t('q_07')}
          </Button>

          <Button
            type="primary"
            size="default"
            disabled={!allAnswered}
            loading={isSending}
            onPress={sendHandler}
            icon={
              <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
            }
            style={{ flex: 1 }}
          >
            {t('q_06')}
          </Button>
        </View>
      </Animated.View>
    </View>
  );
};

/* ─── Styles ─────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  // Start screen
  startScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  startWrap: {
    width: '100%',
  },
  startCard: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
    overflow: 'hidden',
    padding: 28,
    alignItems: 'center',
  },
  pulseRing: {
    borderRadius: 999,
    borderWidth: 2,
    height: 100,
    position: 'absolute',
    width: 100,
  },
  startIcon: {
    alignItems: 'center',
    borderRadius: 24,
    height: 90,
    justifyContent: 'center',
    width: 90,
  },
  startTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  startDesc: {
    fontFamily: 'IRANSans',
    fontSize: 14,
    lineHeight: 24,
    width: '100%',
  },
  featureRow: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  featureIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  featureText: {
    flex: 1,
    fontFamily: 'IRANSans',
    fontSize: 13,
    lineHeight: 21,
  },

  // Main questionnaire
  wrap: {
    flex: 1,
  },

  // Progress
  progressWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 3,
  },
  progressSegment: {
    borderRadius: 4,
  },
  progressLabelRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  progressLabel: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },

  // Question
  questionScrollContent: {
    padding: 16,
    paddingBottom: 8,
  },
  questionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
  },
  questionHeader: {
    padding: 18,
  },
  questionHeaderContent: {
    alignItems: 'center',
  },
  questionIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  questionStep: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  questionTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 17,
    lineHeight: 27,
  },
  optionsList: {
    gap: 10,
    padding: 16,
    paddingTop: 12,
  },

  // Option
  optionRow: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  optionIndex: {
    alignItems: 'center',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  optionIndexText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  checkIcon: {
    alignItems: 'center',
    borderRadius: 999,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },

  // Completion
  completionBanner: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    padding: 14,
  },
  completionText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
    flex: 1,
  },

  // Action bar
  actionBar: {
    borderTopWidth: 1,
    gap: 10,
    padding: 14,
    paddingBottom: 20,
  },
  navRow: {
    alignItems: 'center',
    gap: 10,
  },
  stepIndicator: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepIndicatorText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 12,
  },
  submitRow: {
    gap: 10,
  },
});

export default Questionnaire;
