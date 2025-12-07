import { BrowserRouter } from "react-router";
import { useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import faIR from "antd/lib/locale/fa_IR";
import { IAuthInterface } from "@/interfaces/authInterface";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useServiceWorkerSync } from "@/hooks/useServiceWorkerSync";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { useTheme } from "@/hooks/useTheme";
import { AppRoutes } from "@/components/appRoutes/appRoutes";
import ChooseCurrentRole from "./pages/auth/components/ChooseCurrentRole";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/modal/Modal";
function App() {
  const { t, i18n } = useTranslation();
  const { loading, checkAuthorize } = useAuth();
  const { isLoggedIn } = useSelector((state: IAuthInterface) => state.auth);
  const { paletteAntd } = useTheme();
  const [openActiveRoleModal, setOpenActiveRoleModal] =
    useState<boolean>(false);
  useGeolocation();
  useServiceWorkerSync(checkAuthorize);
  useOfflineQueue();

  useEffect(() => {
    const hasActiveRole = localStorage.getItem("currentRole");
    console.log("hasActiveRole", hasActiveRole);
    if (!hasActiveRole && isLoggedIn) {
      setOpenActiveRoleModal(true);
    }
  }, []);
  useEffect(() => {
    document.title = t("logoTitle");
  }, [i18n.language, t]);

  return (
    <ConfigProvider
      direction="rtl"
      locale={faIR}
      theme={{
        token: {
          ...paletteAntd,
          fontFamily: "IRANSans",
          colorPrimary: "#16a34a",
        },
      }}
    >
      <BrowserRouter>
        <div className="relative bg-[#f9fafb]">
          {/* <ConnectionCheck /> */}
          {loading ? (
            <div className="w-full h-screen flex items-center justify-center"></div>
          ) : (
            <AppRoutes />
          )}
        </div>
        <Modal
          open={openActiveRoleModal}
          closeOnOverlayClick={false}
          showClose={false}
          footer={null}
          size="md"
        >
          <ChooseCurrentRole setShowChooseRoleModal={setOpenActiveRoleModal} />
        </Modal>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
