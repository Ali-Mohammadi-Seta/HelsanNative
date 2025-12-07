import CardSample from "@/components/cards";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import sepehrImg from "@/assets/images/sepehrsalamat.png";
import medarioImg from "@/assets/images/medarioImg.png";
import haalImg from "@/assets/images/haal.png";
import pezeshketImg from "@/assets/images/pezeshket.svg";
import { Link } from "react-router";
import { Tooltip } from "antd";
import { PiKeyReturnDuotone } from "react-icons/pi";
import CustomButton from "@/components/button";
// import sepherPharmaImg from "@/assets/images/sepherPharma.png";

const HealthcareCompanies: React.FC = () => {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div>
      <div className="flex justify-center gap-5">
        <div className="  text-center py-10 text-colorPrimary font-bold text-xl">
          {t("healthcareCompaniesList")}
        </div>
        <Link className="mt-4" to="../">
          <Tooltip title={t("return")}>
            <CustomButton
              icon={<PiKeyReturnDuotone size={30} />}
              className="w-full rounded-[1rem] mt-[19px] flex   flex-row-reverse !border-none !bg-stone-50 !text-red-400 !text-xl py-2 !cursor-pointer"
            ></CustomButton>
          </Tooltip>
        </Link>
      </div>

      <div className="w-4/5 sm:w-11/12 lg:w-3/4 xl:w-3/5 mx-auto gap-4 grid grid-cols-1 min-[350px]:grid-cols-2 sm:grid-cols-4">
        <div className="w-2/3 mx-auto flex justify-center items-center cursor-pointer">
          <CardSample
            title={t("healthcareCompaniesName.sepehrSalamat")}
            linkTitle={t("goToPage")}
            image={sepehrImg}
            link="https://sso.inhso.ir/oidc/auth?client_id=client_1753181661291_29ef29cc769b9290&redirect_uri=https://inhs.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir"
          />
        </div>
        <div className="w-2/3 mx-auto flex justify-center items-center cursor-pointer">
          <CardSample
            title={t("healthcareCompaniesName.madario")}
            linkTitle={t("goToPage")}
            image={medarioImg}
            link="https://web.medario.ir/user/login"
          />
        </div>
        <div className="w-2/3 mx-auto flex justify-center items-center cursor-pointer">
          <CardSample
            title={t("healthcareCompaniesName.hal")}
            linkTitle={t("goToPage")}
            image={haalImg}
            link="https://haal.ir/"
          />
        </div>
        <div className="w-2/3 mx-auto flex justify-center items-center cursor-pointer">
          <CardSample
            title={t("healthcareCompaniesName.pezeshket")}
            linkTitle={t("goToPage")}
            image={pezeshketImg}
            link="https://pezeshket.com/"
          />
        </div>
      </div>
    </div>
  );
};

export default HealthcareCompanies;
