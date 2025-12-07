import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Dropdown, Menu } from "antd";
import type { MenuProps } from "antd";
import irflag from "@/assets/images/irflag.png";
import ukflag from "@/assets/images/ukflag.png";
import { changeLanguage } from "@/utils/changeLanguage";
import CustomButton from "@/components/button";

type SupportedLanguage = "fa" | "en";

const LanguageToggleButton = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const currentLang = i18n.language as SupportedLanguage;

  const currentFlag = currentLang === "en" ? ukflag : irflag;
  const currentLangNameForAlt =
    currentLang === "fa" ? t("farsi") : t("English");

  const handleLanguageChange = async (lang: SupportedLanguage) => {
    if (lang === currentLang) return;
    setLoading(true);
    await changeLanguage(lang, dispatch, i18n, () => {});
    setLoading(false);
  };

  const menu: MenuProps = {
    onClick: ({ key }) => handleLanguageChange(key as SupportedLanguage),
    items: [
      {
        key: "fa",
        label: (
          <div className="flex items-center gap-2">
            <img
              src={irflag}
              alt="Persian flag"
              className="w-5 h-5 rounded-full"
            />
            {t("farsi")}
          </div>
        ),
      },
      {
        key: "en",
        label: (
          <div className="flex flex-row-reverse items-center gap-2">
            <img
              src={ukflag}
              alt="English flag"
              className="w-5 h-5 rounded-full mb-1"
            />
            {t("English")}
          </div>
        ),
      },
    ],
  };

  return (
    <Dropdown
      overlay={<Menu {...menu} />}
      trigger={["click"]}
      placement="bottom"
    >
      <CustomButton
        type="primary"
        size="small"
        loading={loading}
        aria-label={t("selectLanguage", "Select Language")}
        className="
          flex items-center justify-center
          !p-0 overflow-hidden
            hover:border-blue-500 focus:border-blue-500
          transition-all duration-200 ease-in-out
          shadow-sm hover:shadow-md w-8 h-8
        "
      >
        {!loading && (
          <img
            src={currentFlag}
            alt={`${currentLangNameForAlt} ${t("flag", "flag")}`}
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </CustomButton>
    </Dropdown>
  );
};

export default LanguageToggleButton;
