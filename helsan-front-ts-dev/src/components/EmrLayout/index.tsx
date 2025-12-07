// import { useState } from "react";
import { useTranslation } from "react-i18next";
// import { useParams } from "react-router";
import InitialInfoPatientRight from "./InitialInfoPatientRight";
import HealthSummery from "./HealthSummery";
import CardDoctor from "./CardDoctor";
import BloodPressureChart from "./Charts/BloodPressureChart";
import ChartBodyTempreture from "./Charts/ChartBodyTempreture";
import Diagnosis from "./Diagnosis";
import Allergies from "./Allergies";
import DrugInfo from "./DrugInfo";
import Surgery from "./Surgery";
import Vaccinations from "./Vaccinations";
import FamilialDisease from "./FamilialDisease";
import Pregnancies from "./Pregnancies";
import Addictions from "./AddictionsTable";
import ExaminesTable from "./ExaminesTable";
import HeartBeatChart from "./Charts/ChartHeartBeat";
import NumberOfBreath from "./Charts/ChartNumberOfBreaths";
import ChartBloodSugar from "./Charts/ChartBloodSugar";
import ChartBMI from "./Charts/ChartBMI";
import ParaServicesTable from "./ParaServicesTable";
import { useGetUserHealthInfo } from "@/pages/userEMR/lib/useGetUserHealthInfo";
import { useGetEmrServices } from "@/pages/userEMR/lib/useGetEmrServices";
// import { useSelector } from "react-redux";
// import PatientFiles from "./PatientFiles";

const EmrLayout: React.FC = () => {
  //   const { id: paramsId } = useParams();
  //tanstack
  const { userHealthInfo } = useGetUserHealthInfo();
  console.log("🚀 ~ EmrLayout ~ userHealthInfo:", userHealthInfo);
  const { userServices } = useGetEmrServices();
  console.log("userServices", userServices);
  const { t } = useTranslation();

  // const getPersianSrvName = async () => {
  //     const res = await apiCall.get(endpoints.getPersianSrvName);
  //     if (res?.isSuccess) {
  //         setFaName(res?.data?.data?.serviceTypeDetails);
  //     }
  // };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-x-5">
      <div className="flex flex-col items-start gap-4 mb-2 w-full lg:w-4/5">
        {/* {loading ? (
          <div>درحال بارگیری</div>
        ) : ( */}
        <>
          <div className="w-full">
            <InitialInfoPatientRight patientInfo={userHealthInfo} />
          </div>
          <div className="w-full">
            <HealthSummery
              patientInfo={userHealthInfo}
              // loading={loading}
            />
          </div>
          <div className="w-full grid grid-cols-1 xl:grid-cols-3 3xs:grid-cols-2 gap-3">
            <div className="w-full">
              <CardDoctor title={t("bloodPressure")}>
                <BloodPressureChart vitalSigns={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
            <div className="w-full">
              <CardDoctor title={t("temp")}>
                <ChartBodyTempreture temperature={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
            <div className="w-full">
              <CardDoctor title={t("heartBeats")}>
                <HeartBeatChart heartRate={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
            <div className="w-full">
              <CardDoctor title={t("NumberOfBreath")}>
                <NumberOfBreath respiratory={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
            <div className="w-full">
              <CardDoctor title={t("bloodsugar")}>
                <ChartBloodSugar bloodSugar={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
            <div className="w-full">
              <CardDoctor title={t("bmi")}>
                <ChartBMI bmi={userHealthInfo?.vitalSigns} />
              </CardDoctor>
            </div>
          </div>
        </>
        {/* )} */}
      </div>
      <div className="lg:w-1/5">
        <div className="flex flex-wrap gap-4 justify-center xs:justify-between">
          {/* {profileInfo.role === "doctor" && paramsId && (
            <PatientFiles patientInfo={Patient} />
          )} */}
          <Diagnosis patientInfo={userHealthInfo} />
          <Allergies patientInfo={userHealthInfo} />
          <DrugInfo patientInfo={userServices} />
          <Surgery patientInfo={userHealthInfo} />
          <Vaccinations patientInfo={userHealthInfo} />
          <FamilialDisease patientInfo={userHealthInfo} />
          <Pregnancies patientInfo={userHealthInfo} />
          <Addictions patientInfo={userHealthInfo} />
          <ExaminesTable patientInfo={userServices} />
          <ParaServicesTable
            patientInfo={userServices}
            // faName={faName}
          />
        </div>
      </div>
    </div>
  );
};

export default EmrLayout;
