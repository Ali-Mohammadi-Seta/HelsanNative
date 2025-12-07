import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineWifi } from "react-icons/ai";

export default function ConnectionCheck() {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  if (isOnline) return null;
  return (
    <section className="absolute top-0 left-0 bg-[rgba(0,0,0,0.8)] z-50 w-full h-full">
      <div className="text-center w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-white text-center block text-3xl leading-15 mb-5">
          {t("checkConnention")}
        </h3>
        <div className="mt-4 flex justify-center">
          <AiOutlineWifi
            className="!text-blue-800 !text-7xl"
            aria-hidden="true"
            focusable={false}
          />
        </div>
      </div>
    </section>
  );
}
