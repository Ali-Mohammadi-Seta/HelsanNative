import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import welcomeBanner from "@/assets/images/welcomeBanner.png";
import halfBanner from "@/assets/images/halfBanner.png";

const MainSection = () => {
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(window.innerWidth);
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const isSmallScreen = (screenWidth ?? 0) <= 500;

  const backgroundUrl = isSmallScreen
    ? "none"
    : (screenWidth ?? 0) > 992
    ? `url(${welcomeBanner})`
    : `url(${halfBanner})`;

  return (
    <div
      className={`
        w-full h-[600px] bg-no-repeat bg-center rounded-2xl shadow
        ${
          isSmallScreen
            ? "bg-gray-100 flex items-center justify-center text-center !h-[350px]"
            : ""
        }
      `}
      style={{
        backgroundImage: backgroundUrl,
        backgroundSize: "100% 100%",
      }}
    >
      <div
        className={`
    relative w-full h-[600px] bg-no-repeat bg-center rounded-2xl shadow
    ${
      isSmallScreen
        ? "bg-gray-100 flex items-center justify-center text-center !h-[350px]"
        : ""
    }
  `}
        style={{
          backgroundImage: backgroundUrl,
          backgroundSize: "100% 100%",
        }}
      >
        {screenWidth && screenWidth > 500 && screenWidth < 992 && (
          <div className="absolute inset-0 bg-white/70 rounded-2xl z-0" />
        )}

        <div
          className={`
      relative z-10 h-full flex flex-col items-center text-center
      ${
        isSmallScreen
          ? "justify-start pt-16 gap-4 w-[90%] max-w-[500px] mx-auto"
          : "justify-center gap-6"
      }
    `}
        >
          <p className="text-colorPrimary font-bold text-center text-xl px-4 lg:pr-64">
            {t("bannerTexts.firstText")}
          </p>
          <p className="text-colorPrimary font-bold text-center text-xl px-4 lg:pr-80">
            {t("bannerTexts.secondText")}
          </p>
          <p className="text-colorPrimary font-bold text-center text-xl px-4 lg:pr-64">
            {t("bannerTexts.thirdText")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
