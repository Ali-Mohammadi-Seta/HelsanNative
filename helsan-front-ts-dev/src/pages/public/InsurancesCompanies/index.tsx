import CardSample from "@/components/cards";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import sepherPharmaImg from "@/assets/images/favicon.ico";
import { Link } from "react-router";
import { Tooltip } from "antd";
import { PiKeyReturnDuotone } from "react-icons/pi";
import CustomButton from "@/components/button";

const InsurancesCompanies: React.FC = () => {
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
          {t("SupplementaryInsurance")}
        </div>
        <Link className="mt-4" to="../">
          <Tooltip title={t('return')}>
            <CustomButton icon={<PiKeyReturnDuotone size={30} />} className="w-full rounded-[1rem] mt-[19px] flex   flex-row-reverse !border-none !bg-stone-50 !text-red-400 !text-xl py-2 !cursor-pointer"></CustomButton>
          </Tooltip>
        </Link>
      </div>

      <div>
        <div className="w-2/3 mx-auto flex justify-center items-center">
          <CardSample
            title={t("SepehrSupplementary")}
            linkTitle={t("goToPage")}
            image={sepherPharmaImg}
            link="https://mokamel.isikato.ir/"
          />
        </div>
      </div>
    </div>
  );
};

export default InsurancesCompanies;
