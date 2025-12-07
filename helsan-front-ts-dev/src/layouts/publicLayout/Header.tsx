import { AiOutlineLoading3Quarters } from "react-icons/ai";
import * as pathRoute from "@/routes/pathRoutes";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import Logo from "@/components/logo";
import { IAuthInterface } from "@/interfaces/authInterface";
import { useGetUserProfile } from "@/pages/panel/lib/useGetUserProfile";
import { toPersianDigits } from "@/utils/antdPagination";
import { useLogout } from "@/pages/auth/lib/useGetLogoutApi";
import { logout } from "@/redux/reducers/authReducer";
import LanguageToggleButton from "./components/LanguageToggleButton";
import Logout from "@/assets/images/logout-vector.svg";
import { Modal } from "@/components/modal/Modal";

import {
  BiUser,
  BiSearch,
  BiMenu,
  BiSolidUserCircle,
  BiLogIn,
  BiLogOut,
} from "react-icons/bi";
import CustomButton from "@/components/button";
import { toast } from "@/components/toast/toastApi";

const PublicNavbar: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  const { isLoggedIn } = useSelector((state: IAuthInterface) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);
  const { userProfile, refetch } = useGetUserProfile({ enabled: false });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mutate: logoutMutate, isPending } = useLogout();

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setOpenLogoutModal(true);
  };
  //logout handler
  const logoutHandler = () => {
    logoutMutate(undefined, {
      onSuccess: (result) => {
        if (result.isSuccess) {
          dispatch(logout());
          window.open("https://sso.inhso.ir/auth/logout", "_self");
          toast.success((result.data as any)?.messageFa);
          console.log("isLoggedIn1", isLoggedIn);
          setOpenLogoutModal(false);
          localStorage.removeItem("currentRole");
        } else {
          toast.error((result.error as any)?.error?.errorCode);
        }
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      },
    });
  };
  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn]);

  const clubMenuItems = [
    {
      key: "21",
      label: <Link to="/customers-club">{t("customersClub")}</Link>,
    },
    {
      key: "22",
      label: <Link to="/health-society-club">{t("healthSocietyClub")}</Link>,
    },
  ];

  const menuItems = [
    {
      key: 1,
      name: t("home"),
      route: pathRoute.homePagePath,
    },
    {
      key: 2,
      name: (
        <Dropdown
          menu={{ items: clubMenuItems }}
          placement="bottom"
          trigger={["hover"]}
          openClassName="py-2"
        >
          <span className="cursor-pointer">{t("clubs")}</span>
        </Dropdown>
      ),
    },
    {
      key: 3,
      name: t("header.termsAndConditions"),
    },
  ];

  const renderMenuItems = (): any => [
    {
      label: (
        <div className="text-colorPrimary duration-300">
          {toPersianDigits(userProfile?.firstName)}&nbsp;&nbsp;
          {toPersianDigits(userProfile?.lastName)}
        </div>
      ),
      key: "fullName",
      icon: <BiSolidUserCircle className="!text-gray-300 !text-2xl" />,
    },
    { type: "divider" },
    {
      label: (
        <Link
          to={pathRoute.profilePagePath}
          className="hover:text-colorPrimary duration-300"
        >
          {t("myProfile")}
        </Link>
      ),
      key: "profile",
    },
    {
      label: (
        <Link
          to={pathRoute.myEmrPagePath}
          className="hover:text-colorPrimary duration-300"
        >
          {t("myDoc")}
        </Link>
      ),
      key: "myEmr",
    },
    {
      label: (
        <Link
          to={pathRoute.homePagePath}
          className="hover:text-colorPrimary duration-300"
        >
          {t("settings")}
        </Link>
      ),
      key: "settings",
    },
    { type: "divider" },
    {
      label: <div className="!text-red-500">{t("logOut")}</div>,
      key: "exit",
      icon: (
        <BiLogOut
          className="!text-red-500 inline-block align-middle"
          size={16}
        />
      ),
      className:
        "hover:text-colorPrimary duration-300 cursor-pointer -mr-[2px]",
      onClick: handleLogout,
    },
  ];

  return (
    <nav
      className={`bg-white fixed top-0 w-full z-[1000] ${
        isScrolled ? "shadow-md" : "shadow-none"
      }`}
      dir="rtl"
    >
      <div className="w-full px-4 py-2 flex flex-col mdx:flex-row mdx:items-center mdx:justify-between gap-y-2 border border-[#E2E8F0]">
        <div className="relative w-full mdx:w-auto flex items-center justify-center">
          <Link to="/" className="mx-auto">
            <Logo isikato={false} subtitle={t("footer.text3")} />
          </Link>

          <button
            onClick={toggleNavbar}
            type="button"
            className="absolute cursor-pointer right-0 mdx:hidden p-2 text-gray-500 hover:shadow-sm rounded-lg"
          >
            <BiMenu fontSize={30} />
          </button>
        </div>

        <div className="hidden mdx:flex items-center gap-x-6 flex-wrap mr-6 justify-start flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.route ?? "/"}
              className="text-md text-gray-600 hover:text-colorPrimary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden mdx:flex items-center gap-x-4">
          <div className="ms-2 mdx:ms-3 lg:ms-4 hidden mdx:flex items-center justify-center">
            <LanguageToggleButton />
          </div>

          <div className="cursor-pointer shadow-sm p-2 rounded-md">
            {/* <svg
              className="w-5 h-5 text-colorPrimary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              /> */}
            {/* </svg> */}
            <BiSearch fontSize={20} className="text-colorPrimary" />
          </div>

          {isLoggedIn ? (
            <Dropdown
              placement="bottom"
              trigger={["click"]}
              menu={{ items: renderMenuItems() }}
              disabled={isPending}
            >
              <div className="cursor-pointer shadow-sm p-2 rounded-md">
                {isPending ? (
                  <AiOutlineLoading3Quarters className="!text-colorPrimary text-xl animate-spin" />
                ) : (
                  <BiUser className="!text-colorPrimary text-xl" />
                )}
              </div>
            </Dropdown>
          ) : (
            <Link to={pathRoute.loginPagePath}>
              <CustomButton
                size="large"
                variant="link"
                className="!border-colorPrimary border p-2 !text-colorPrimary hover:!shadow-lg"
              >
                <BiLogIn fontSize={20} />
                {t("account")}
              </CustomButton>
            </Link>
          )}
        </div>

        {isOpen && (
          <div className="flex p-2 rounded-b-lg flex-wrap items-center gap-x-4 gap-y-2 w-full justify-center sm:justify-start border-t pt-2 mdx:hidden">
            <>
              {menuItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.route ?? "/"}
                  className="text-sm font-medium hover:text-colorPrimary"
                >
                  {item.name}
                </Link>
              ))}
            </>

            <div className="flex items-center gap-x-2 mt-2 mx-auto sm:mr-auto">
              <div className="mx-auto sm:mr-auto">
                <LanguageToggleButton />
              </div>
              <div className="cursor-pointer shadow-sm p-2 rounded-md -mt-2.5">
                <BiSearch fontSize={20} className="text-colorPrimary" />
              </div>

              {isLoggedIn ? (
                <Dropdown
                  placement="bottom"
                  trigger={["click"]}
                  menu={{ items: renderMenuItems() }}
                >
                  <div className="cursor-pointer shadow-sm p-2 rounded-md -mt-2.5">
                    <BiUser className="!text-colorPrimary text-xl" />
                  </div>
                </Dropdown>
              ) : (
                <Link to={pathRoute.loginPagePath}>
                  <CustomButton
                    size="default"
                    variant="link"
                    className="!border-colorPrimary border p-2 !text-colorPrimary hover:!shadow-lg -mt-2.5"
                  >
                    <BiLogIn fontSize={18} />
                    {t("account")}
                  </CustomButton>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        open={openLogoutModal}
        onCancel={() => {
          setOpenLogoutModal(false);
        }}
        footer={null}
      >
        <div className="flex flex-col items-center pt-[1.25rem] px-[1.25rem] pb-0">
          <div className="confirm-modal__concept w-[160px] h-[70px] mb-[1.5rem]">
            <img
              src={Logout}
              alt="logout"
              className="confirm-modal__concept-img w-full h-full"
            />
          </div>
          <div className="confirm-modal__content mb-[1rem]">
            <h5 className="confirm-modal__title fm-bo text-[0.875rem] text-center font-yekanBakhBold">
              {t("header.text2")}
            </h5>
          </div>
          <div className="w-full flex items-center justify-between gap-2 mt-2">
            <CustomButton
              size="large"
              type="danger"
              className="take-turns-btn confirm-modal__button confirm-modal__button--danger flex-1 scale-90"
              onClick={() => setOpenLogoutModal(false)}
            >
              {t("cancel")}
            </CustomButton>
            <CustomButton
              size="large"
              type="primary"
              className="take-turns-btn confirm-modal__button primary-grd-h flex-1 !me-[8px] hover:!text-[#fafcfe] hover:!bg-primary-gradient hover:shadow-[0px_10px_20px_#3f9eff40] scale-90"
              onClick={logoutHandler}
              loading={isPending}
            >
              {t("header.out")}
            </CustomButton>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default PublicNavbar;
