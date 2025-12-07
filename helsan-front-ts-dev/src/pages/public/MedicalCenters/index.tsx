import hospitalImg from "@/assets/images/hospitalImg.png";
import clinicsImg from "@/assets/images/clinics.png";
import privateClinicsImg from "@/assets/images/privateClinics.png";
import { useTranslation } from "react-i18next";
import HospitalsList from "./components/hospitalsList";
import { useEffect, useRef, useState } from "react";

type Category = "hospitals" | "clinics" | "privateClinics";

const MedicalCenters = () => {
  const [category, setCategory] = useState("hospitals");
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);

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

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="pt-10">
      {/* <div
        className="hidden md:block w-full h-[600px] bg-no-repeat bg-center shadow-2xl rounded-2xl !shadow-gray-200 mb-2"
        style={{
          backgroundImage: `url(${medicalBanner})`,
          backgroundSize: "100% 100%",
        }}
      >
        <p className="flex justify-end w-3/5 pt-50 text-colorPrimary font-extrabold text-2xl md:text-4xl mx-auto">
          {t("helsanMedicalCenters")}
        </p>
      </div> */}

      <div className="bg-gray-200 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-8 py-6 w-full md:w-4/5 xl:w-3/4 mx-auto min-h-72">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleCategoryChange("hospitals")}
          >
            <div
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white shadow-md"
              style={{
                backgroundImage: `url(${hospitalImg})`,
                backgroundSize: "100% 100%",
              }}
            ></div>
            <p className="text-center pt-3 font-bold">{t("hospitals")}</p>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleCategoryChange("clinics")}
          >
            <div
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white shadow-md"
              style={{
                backgroundImage: `url(${clinicsImg})`,
                backgroundSize: "100% 100%",
              }}
            ></div>
            <p className="text-center pt-3 font-bold">{t("clinics")}</p>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleCategoryChange("privateClinics")}
          >
            <div
              className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white shadow-md"
              style={{
                backgroundImage: `url(${privateClinicsImg})`,
                backgroundSize: "100% 100%",
              }}
            ></div>
            <p className="text-center pt-3 font-bold">{t("privateClinics")}</p>
          </div>
        </div>
      </div>

      <div ref={contentRef}>
        <p className="my-10 font-extrabold text-center text-colorPrimary text-xl">
          {t(`${category}`)}
        </p>
        <HospitalsList />
      </div>
    </div>
  );
};

export default MedicalCenters;
