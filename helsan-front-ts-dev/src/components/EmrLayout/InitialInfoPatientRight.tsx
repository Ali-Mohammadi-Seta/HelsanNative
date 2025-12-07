import React from "react";
import { useTranslation } from "react-i18next";
import { TypesOfInsurancesWithValue } from "@/utils/constants";
import { toPersianDigits } from "@/utils/antdPagination";
import moment from "moment-jalaali";

interface HealthStatus {
  bloodRH?: string | null;
  bloodGroup?: string | null;
}

interface Health {
  latestHealthStatus?: HealthStatus | null;
}

interface PatientInfo {
  firstName?: string | null;
  lastName?: string | null;
  nationalId?: string | null;
  birthdate?: string | null; // assuming ISO string or similar
  insuranceCompany?: string | null;
  health?: Health | null;
}

interface InitialInfoPatientRightProps {
  patientInfo?: PatientInfo | null;
}

const InitialInfoPatientRight: React.FC<InitialInfoPatientRightProps> = ({
  patientInfo,
}) => {
  const { t } = useTranslation();

  // Function to get the Persian label for the insurance company
  const getInsuranceCompanyLabel = (insuranceValue?: string | null) => {
    if (!insuranceValue) return "";
    const insurance = TypesOfInsurancesWithValue.find(
      (item) => item.value === insuranceValue
    );
    return insurance ? insurance.label : "";
  };

  // Calculate age in Jalali years
  const calculateAge = (birthdate?: string | null): string => {
    if (!birthdate) return "-";

    try {
      const birthYear = moment(birthdate).jYear();
      const currentYear = moment().jYear();
      const age = currentYear - birthYear;
      return toPersianDigits(age.toString());
    } catch {
      return "-";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md py-4 px-8">
      <div className="p-1">
        <div className="pt-2">
          <ul className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            <li className="flex items-center">
              <span className="text-[#717f94] text-sm font-light ms-1">
                {t("patientName")}: &nbsp;{" "}
              </span>
              <span className="text-[#343434dd] text-sm font-bold">
                {patientInfo?.firstName ?? "-"} {patientInfo?.lastName ?? ""}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-[#717f94] text-sm font-light ms-1">
                {t("natCode")}: &nbsp;
              </span>
              <span className="text-[#343434dd] text-sm font-bold">
                {patientInfo?.nationalId ?? "-"}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-[#717f94] text-sm font-light ms-1">
                {t("age")}: &nbsp;{" "}
              </span>
              <span className="text-[#343434dd] text-sm font-bold">
                {calculateAge(patientInfo?.birthdate)}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-[#717f94] text-sm font-light ms-1">
                {t("bimeTarafGharardad")}:&nbsp;{" "}
              </span>
              <span className="text-[#343434dd] text-sm font-bold">
                {patientInfo?.insuranceCompany
                  ? getInsuranceCompanyLabel(patientInfo.insuranceCompany)
                  : "-"}
              </span>
            </li>
            <li className="flex items-center">
              <span className="text-[#717f94] text-sm font-light ms-1">
                {t("bloodGroup")}:&nbsp;{" "}
              </span>
              <span className="text-[#343434dd] text-sm font-bold">
                <span
                  className={`${
                    patientInfo?.health?.latestHealthStatus?.bloodRH
                      ? "align-super"
                      : "align-middle"
                  }`}
                >
                  {patientInfo?.health?.latestHealthStatus?.bloodRH ===
                  t("mosbat")
                    ? "+"
                    : "-"}
                </span>
                {patientInfo?.health?.latestHealthStatus?.bloodGroup}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InitialInfoPatientRight;
