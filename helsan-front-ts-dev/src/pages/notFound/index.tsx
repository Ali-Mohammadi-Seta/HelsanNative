import CustomButton from "@/components/button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const backgroundStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(10, 156, 2, 0.15) 0%, #ffffff 80%)`,
  };

  return (
    <section
      className="flex flex-col items-center justify-start min-h-screen pt-24 transition-all duration-300 ease-in-out"
      style={backgroundStyle}
    >
      <div
        className="text-[150px] font-bold tracking-wider mb-4 animate-pulse"
        style={{ color: "#16a34a" }}
      >
        404
      </div>

      <div className="text-[80px] mb-4 animate-bounce">😕</div>

      <p className="text-2xl mb-8 text-center text-gray-700">{t("notFound")}</p>

      <CustomButton
        type="primary"
        size="large"
        href="/"
        className="px-8 py-3 shadow-lg transition-transform transform hover:scale-105"
        style={{
          color: "#16a34a",
          borderColor: "#16a34a",
          backgroundColor: "#ffffff",
          transition: "transform 0.2s ease",
        }}
      >
        {t("returnToHomepage")}
      </CustomButton>
    </section>
  );
};

export default NotFound;
