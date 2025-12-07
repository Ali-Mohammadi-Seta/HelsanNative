import { Skeleton, Tabs, TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import Questionnaire from "./components/Questionnaire";
import { MyHealthinfo } from "./components";
import { useGetQuestionnaireStatus } from "./lib/useGetQuestionnaireStatus";
import { useGetUserHealthInfo } from "./lib/useGetUserHealthInfo";

export function MyEMRPage() {
  const { t } = useTranslation();
  //tanstack
  const { questionnaireStatus } = useGetQuestionnaireStatus();
  const { isLoading } = useGetUserHealthInfo();

  const a = 1234567890;
  console.log(a.toLocaleString("fa-IR"));
  const items: TabsProps["items"] = [
    {
      key: "health-record",
      label: t("healthRec"),
      children: isLoading ? (
        <div className="flex justify-center items-center w-full h-80 mx-auto my-auto rounded-2xl">
          <Skeleton.Input className="!w-full !h-full !rounded-xl" active />
        </div>
      ) : !questionnaireStatus?.selfExpressionFilledBefore ? (
        <Questionnaire />
      ) : (
        <MyHealthinfo />
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="health-record" items={items} />
    </div>
  );
}

export default MyEMRPage;
