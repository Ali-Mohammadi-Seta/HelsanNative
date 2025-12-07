import { useEffect, useState } from "react";
import { useGetQuestionnaireCachedInfo } from "../../lib/useGetQuestionnaireCachedInfo";
import { useSaveDoneQuestionnaire } from "../../lib/useSaveDoneQuestionnaire";
import ContentLayout from "@/layouts/publicLayout/Content";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import CustomButton from "@/components/button";
import { toast } from "@/components/toast/toastApi";

// --- Type Definitions ---

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

// Define the shape of your answers object dynamically
// K will be the 'value' of the question (e.g., "bloodGroup", "bloodRH")
// V will be the selected option's 'value' (e.g., "O", "مثبت", "1", "0", "none")
type Answers = {
  [key: string]: string;
};

// --- Questions Data ---
const questions: Question[] = [
  {
    id: 1,
    value: "bloodGroup",
    title: i18n.t("bloodGroup"),
    options: [
      { id: 1, title: "O", value: "O" },
      { id: 2, title: "A", value: "A" },
      { id: 3, title: "B", value: "B" },
      { id: 4, title: "AB", value: "AB" },
    ],
  },
  {
    id: 2,
    value: "bloodRH",
    title: "RH",
    options: [
      { id: 1, title: i18n.t("mosbat"), value: i18n.t("mosbat") },
      { id: 2, title: i18n.t("manfi"), value: i18n.t("manfi") },
    ],
  },
  {
    id: 3,
    value: "hormonalProblems",
    title: i18n.t("hormonalProblems"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 4,
    value: "liverProblems",
    title: i18n.t("liverProblems"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 5,
    value: "heartProblems",
    title: i18n.t("heartProblems"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 6,
    value: "kidneyProblems",
    title: i18n.t("kidneyProblems"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 7,
    value: "thyroidProblems",
    title: i18n.t("thyroidProblems"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 8,
    value: "presenceOfMetalInBody",
    title: i18n.t("felez"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 9,
    value: "pregnant",
    title: i18n.t("bardar"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 10,
    value: "smoker",
    title: i18n.t("dokhaniat"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 11,
    value: "artificialOrgans",
    title: i18n.t("ozvMasnouee"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 12,
    value: "breastfeeding",
    title: i18n.t("shirDehi"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 13,
    value: "diabetes",
    title: i18n.t("diyabet"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 14,
    value: "hypertension",
    title: i18n.t("fesharKhun"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 15,
    value: "hepatitisB",
    title: i18n.t("hepatitBi"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 16,
    value: "hepatitisC",
    title: i18n.t("hepatitC"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 17,
    value: "gallstones",
    title: i18n.t("safra"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 18,
    value: "rheumaticDiseases",
    title: i18n.t("romatism"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 19,
    value: "cancer",
    title: i18n.t("saratanDarad"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
  {
    id: 20,
    value: "ms",
    title: i18n.t("MS"),
    options: [
      { id: 1, title: i18n.t("yes"), value: "1" },
      { id: 2, title: i18n.t("no"), value: "0" },
      { id: 3, title: i18n.t("unknown"), value: "none" },
    ],
  },
];

const Questionnaire: React.FC = () => {
  // tanstack - Assuming useGetQuestionnaireCachedInfo returns Answers or null/undefined
  // and useSaveDoneQuestionnaire accepts Answers and a callback with a result object
  const { cachedInfo } = useGetQuestionnaireCachedInfo() as {
    cachedInfo: Answers | null;
  };
  const { saveDoneQuestionnaire, isSending } = useSaveDoneQuestionnaire() as {
    saveDoneQuestionnaire: (
      data: { isDone: boolean; [key: string]: string | boolean },
      callbacks: { onSuccess: (result: { isSuccess: boolean }) => void }
    ) => void;
    isSending: boolean;
  };

  const [startStep, setStartStep] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (cachedInfo) {
      console.log("cacheddddd", cachedInfo);
      setAnswers(cachedInfo); // cachedInfo is already typed as Answers | null
    }
  }, [cachedInfo]);

  const answerHandler = (questionId: number, optionValue: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers: Answers = { ...prevAnswers };
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

  const sendHandler = async () => {
    if (allAnswered) {
      saveDoneQuestionnaire(
        { isDone: true, ...answers },
        {
          onSuccess: (result) => {
            if (result.isSuccess) {
              toast.success(t("sentQuess"));
              setAnswers({});
              setCurrentStep(0);
            }
          },
        }
      );
    }
  };

  const saveHandler = async () => {
    saveDoneQuestionnaire(
      { isDone: false, ...answers },
      {
        onSuccess: (result) => {
          if (result.isSuccess) {
            toast.success(t("q_09"));
            setAnswers({});
            setCurrentStep(0);
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

  return (
    <>
      {startStep ? (
        <div className="flex justify-center items-center mt-20 sm:mt-64 w-full h-full">
          <div className="flex flex-col gap-y-2 p-5">
            <p className="font-medium text-xl text-center">{t("q_01")}</p>
            <CustomButton
              className="flex justify-center items-center w-full xs:w-1/4 mx-auto p-4"
              type="primary"
              onClick={() => setStartStep(false)}
            >
              {t("q_02")}
            </CustomButton>
          </div>
        </div>
      ) : (
        <>
          <ContentLayout
            header={{
              title: t("q_03"),
            }}
          >
            <div className="pt-10 md:px-14">
              <div className="flex justify-between gap-x-1 w-full mt-3">
                {questions.map((qu, index) => (
                  <span
                    key={qu.id}
                    className={`w-16 h-2 rounded-md cursor-pointer ${
                      isQuestionAnswered(qu.id)
                        ? "bg-colorPrimary"
                        : currentStep === index
                        ? "bg-blue-500"
                        : "bg-slate-400"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  ></span>
                ))}
              </div>
              <p className="text-lg font-bold mt-4 mb-2">
                {currentStep + 1}. {currentQuestion.title}
              </p>
              <ul>
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex gap-x-2 mb-2 group"
                    onClick={() =>
                      answerHandler(currentQuestion.id, option.value)
                    }
                  >
                    <p
                      className={`p-2 flex justify-center items-center w-8 border rounded-md cursor-pointer group-hover:bg-colorPrimary group-hover:text-white ${
                        isOptionSelected(currentQuestion.id, option.value)
                          ? "bg-colorPrimary text-white"
                          : "bg-white"
                      }`}
                    >
                      {option.id}
                    </p>
                    <li
                      className={`p-2 flex justify-center items-center rounded-md cursor-pointer border w-full group-hover:bg-colorPrimary group-hover:text-white
                    ${
                      isOptionSelected(currentQuestion.id, option.value)
                        ? "bg-colorPrimary text-white"
                        : "bg-white"
                    }
                                        `}
                    >
                      {option.title}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="flex flex-col xs:flex-row justify-between py-3 md:px-14">
              <div className="flex flex-col xs:flex-row justify-start gap-y-2 mb-2 xs:mb-0">
                <CustomButton
                  className="xs:me-1"
                  type="primary"
                  onClick={nextQuestionHandler}
                  disabled={currentStep === questions.length - 1}
                >
                  {t("q_04")}
                </CustomButton>
                <CustomButton
                  onClick={previousQuestionHandler}
                  disabled={currentStep === 0}
                >
                  {t("q_05")}
                </CustomButton>
                <CustomButton
                  className="xs:ms-1"
                  type="primary"
                  onClick={sendHandler}
                  disabled={!allAnswered}
                  loading={isSending}
                >
                  {t("q_06")}
                </CustomButton>
              </div>
              <div className="flex flex-col xs:flex-row justify-end gap-y-2">
                <CustomButton
                  onClick={saveHandler}
                  loading={isSending}
                  className="w-full"
                >
                  {t("q_07")}
                </CustomButton>
                <CustomButton
                  className="xs:ms-1"
                  type="danger"
                  onClick={() => setStartStep(true)}
                >
                  {t("q_08")}
                </CustomButton>
              </div>
            </div>
          </ContentLayout>
        </>
      )}
    </>
  );
};

export default Questionnaire;
