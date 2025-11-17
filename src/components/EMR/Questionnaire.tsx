import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Button } from '@/components';
import { useTheme } from '@/styles/theme';
import { useGetQuestionnaireCachedInfo } from '@/lib/hooks/emr/useGetQuestionnaireCachedInfo';
import { useSaveDoneQuestionnaire } from '@/lib/hooks/emr/useSaveDoneQuestionnaire';

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
}

type Answers = {
  [key: string]: string;
};

const { width } = Dimensions.get('window');

const Questionnaire: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { cachedInfo } = useGetQuestionnaireCachedInfo();
  const { saveDoneQuestionnaire, isSending } = useSaveDoneQuestionnaire();

  const [startStep, setStartStep] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});

  // Questions data
  const questions: Question[] = [
    {
      id: 1,
      value: 'bloodGroup',
      title: t('bloodGroup'),
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
      options: [
        { id: 1, title: t('mosbat'), value: t('mosbat') },
        { id: 2, title: t('manfi'), value: t('manfi') },
      ],
    },
    {
      id: 3,
      value: 'hormonalProblems',
      title: t('hormonalProblems'),
      options: [
        { id: 1, title: t('yes'), value: '1' },
        { id: 2, title: t('no'), value: '0' },
        { id: 3, title: t('unknown'), value: 'none' },
      ],
    },
    // Add all other questions here following the same pattern...
  ];

  useEffect(() => {
    if (cachedInfo) {
      setAnswers(cachedInfo);
    }
  }, [cachedInfo]);

  const answerHandler = (questionId: number, optionValue: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        newAnswers[question.value] = optionValue;
      }
      return newAnswers;
    });
  };

  const nextQuestionHandler = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousQuestionHandler = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const allAnswered = questions.every((question) =>
    answers.hasOwnProperty(question.value)
  );

  const sendHandler = () => {
    if (allAnswered) {
      saveDoneQuestionnaire(
        { isDone: true, ...answers },
        {
          onSuccess: (result: any) => {
            if (result?.isSuccess) {
              Toast.show({
                type: 'success',
                text1: t('success'),
                text2: t('sentQuess'),
              });
              setAnswers({});
              setCurrentStep(0);
              setStartStep(true);
            }
          },
        }
      );
    }
  };

  const saveHandler = () => {
    saveDoneQuestionnaire(
      { isDone: false, ...answers },
      {
        onSuccess: (result: any) => {
          if (result?.isSuccess) {
            Toast.show({
              type: 'success',
              text1: t('success'),
              text2: t('q_09'),
            });
          }
        },
      }
    );
  };

  const currentQuestion = questions[currentStep];

  const isOptionSelected = (questionId: number, optionValue: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (question) {
      return answers[question.value] === optionValue;
    }
    return false;
  };

  const isQuestionAnswered = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    return question && answers.hasOwnProperty(question.value);
  };

  if (startStep) {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <View className="bg-card p-6 rounded-xl w-full max-w-md">
          <Text className="text-foreground text-xl font-bold text-center mb-4">
            {t('q_01')}
          </Text>
          <Button
            title={t('q_02')}
            onPress={() => setStartStep(false)}
            variant="primary"
            className="w-full"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Progress Bar */}
      <View className="px-4 pt-4">
        <View className="flex-row justify-between gap-x-1">
          {questions.map((qu, index) => (
            <TouchableOpacity
              key={qu.id}
              onPress={() => setCurrentStep(index)}
              className="flex-1"
            >
              <View
                className={`h-2 rounded-full ${
                  isQuestionAnswered(qu.id)
                    ? 'bg-primary'
                    : currentStep === index
                    ? 'bg-info'
                    : 'bg-divider'
                }`}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Question Content */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-foreground text-lg font-bold mb-4">
          {currentStep + 1}. {currentQuestion.title}
        </Text>

        {currentQuestion.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => answerHandler(currentQuestion.id, option.value)}
            className="mb-3"
          >
            <View className="flex-row items-center">
              <View
                className={`w-10 h-10 rounded-lg justify-center items-center mr-3 ${
                  isOptionSelected(currentQuestion.id, option.value)
                    ? 'bg-primary'
                    : 'bg-card border border-border'
                }`}
              >
                <Text
                  className={`font-medium ${
                    isOptionSelected(currentQuestion.id, option.value)
                      ? 'text-white'
                      : 'text-foreground'
                  }`}
                >
                  {option.id}
                </Text>
              </View>
              <View
                className={`flex-1 p-4 rounded-lg ${
                  isOptionSelected(currentQuestion.id, option.value)
                    ? 'bg-primary'
                    : 'bg-card border border-border'
                }`}
              >
                <Text
                  className={`${
                    isOptionSelected(currentQuestion.id, option.value)
                      ? 'text-white'
                      : 'text-foreground'
                  }`}
                >
                  {option.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-4 pb-4 bg-background border-t border-divider pt-4">
        <View className="flex-row justify-between mb-3">
          <Button
            title={t('q_05')}
            onPress={previousQuestionHandler}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 mr-2"
          />
          <Button
            title={t('q_04')}
            onPress={nextQuestionHandler}
            disabled={currentStep === questions.length - 1}
            variant="primary"
            className="flex-1 ml-2"
          />
        </View>

        <View className="flex-row justify-between">
          <Button
            title={t('q_07')}
            onPress={saveHandler}
            loading={isSending}
            variant="outline"
            className="flex-1 mr-2"
          />
          <Button
            title={t('q_06')}
            onPress={sendHandler}
            disabled={!allAnswered}
            loading={isSending}
            variant="primary"
            className="flex-1 ml-2"
          />
        </View>
      </View>
    </View>
  );
};

export default Questionnaire;