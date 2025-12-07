import React from "react";
import { useTranslation } from "react-i18next";
import { toPersianDigits } from "@/utils/antdPagination";
import { dataNames } from "@/utils/constants";

interface BloodPressure {
  upper?: number | string;
  lower?: number | string;
}

interface BloodSugarEntry {
  beforeMeal?: number | string;
  afterMeal?: number | string;
}

interface LastVitalSign {
  temp?: number | string;
  pulse?: number | string;
  resp?: number | string;
  bloodPressure?: BloodPressure[];
  bloodSuger?: BloodSugarEntry[];
}

interface LatestHealthStatus {
  [key: string]: "0" | "1" | string;
}

interface Health {
  lastVitalSign?: LastVitalSign;
  latestHealthStatus?: LatestHealthStatus;
}

interface PatientInfo {
  health?: Health;
}

interface HealthSummeryProps {
  patientInfo?: PatientInfo;
  loading?: boolean;
}

const HealthSummery: React.FC<HealthSummeryProps> = ({
  patientInfo,
  loading,
}) => {
  const { t } = useTranslation();

  const healthInfo = patientInfo?.health || {};
  const lastVitalSign = healthInfo.lastVitalSign || {};
  const latestHealthStatus = healthInfo.latestHealthStatus || {};

  const latestBloodPressure = lastVitalSign.bloodPressure?.slice(-1)[0];
  const latestBloodSugar = lastVitalSign.bloodSuger?.slice(-1)[0];

  return (
    <div className="w-full py-4 px-8 bg-white rounded-md shadow-md">
      <div className="flex justify-between">
        <h3 className="text-base font-semibold">{t("PatientHealthStatus")}</h3>
      </div>

      {loading ? (
        <div>{t("loading")}</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          {lastVitalSign.temp && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">{t("Temperature")}:</span>
                {toPersianDigits(lastVitalSign.temp)}
              </p>
            </div>
          )}

          {lastVitalSign.pulse && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">{t("heartBeats")}:</span>
                {toPersianDigits(lastVitalSign.pulse)}
              </p>
            </div>
          )}

          {lastVitalSign.resp && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">{t("breathing")}:</span>
                {toPersianDigits(lastVitalSign.resp)}
              </p>
            </div>
          )}

          {latestBloodPressure?.upper && latestBloodPressure?.lower && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">
                  {t("bloodPressure")}:
                </span>
                {toPersianDigits(latestBloodPressure.upper)}/
                {toPersianDigits(latestBloodPressure.lower)}
              </p>
            </div>
          )}

          {latestBloodSugar?.beforeMeal && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">
                  {t("nashta", "Blood Sugar (Before Meal)")}:
                </span>
                {toPersianDigits(latestBloodSugar.beforeMeal)}
              </p>
            </div>
          )}

          {latestBloodSugar?.afterMeal && (
            <div className="flex gap-x-1">
              <p className="m-0 whitespace-nowrap">
                <span className="me-2 font-semibold">
                  {t("ghandbad", "Blood Sugar (After Meal)")}:
                </span>
                {toPersianDigits(latestBloodSugar.afterMeal)}
              </p>
            </div>
          )}

          {Object.entries(dataNames).map(([key, label]) => {
            const status = latestHealthStatus[key];
            const isChecked =
              status === "1"
                ? t("have")
                : status === "0"
                ? t("haveNot")
                : "نامشخص";

            return (
              <p className="m-0 font-semibold" key={key}>
                {label}:{" "}
                <span
                  className={`font-light ms-1 ${
                    status === "1"
                      ? "!text-green-500 !font-medium"
                      : status === "0"
                      ? "!text-red-500 !font-medium"
                      : ""
                  }`}
                >
                  {isChecked}
                </span>
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HealthSummery;
