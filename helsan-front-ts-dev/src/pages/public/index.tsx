import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import CategoryCard from "./components/CategoryCard";
import apiServices from "@/services/apiServices";
import endpoints from "@/services/endpoints";
import * as pathRoutes from "@/routes/pathRoutes";
import { setIsLoggedIn, setUserRole } from "@/redux/reducers/authReducer";
import { AppDispatch } from "@/redux/store";
import ambulanceIcon from "@/assets/images/ambulance.gif";
import drugsIcon from "@/assets/images/drugs.gif";
import clinicIcon from "@/assets/images/clinic.gif";
import creditPaymentIcon from "@/assets/images/creditPayment.gif";
import shopIcon from "@/assets/images/shop.gif";
import teaIcon from "@/assets/images/tea.gif";
import runningIcon from "@/assets/images/running.gif";
import mapLocatorIcon from "@/assets/images/mapLocator.gif";
import taghziyeIcon from "@/assets/images/taghziye.gif";
import volunteeringCampaignIcon from "@/assets/images/volunteeringCampaign.gif";
import doctorsAndCounselingPsychologistIcon from "@/assets/images/doctorsAndCounselingPsychologist.gif";
import insuranceIcon from "@/assets/images/insurance.gif";
import homeNursingCareIcon from "@/assets/images/homeNursingCare.gif";
import healthcareCompaniesIcon from "@/assets/images/healthcareCompanies.gif";
import paraclinicIcon from "@/assets/images/paraclinic.gif";
import healthTourismIcon from "@/assets/images/healthTourism.gif";
import awarenessIcon from "@/assets/images/awareness.gif";
import educationIcon from "@/assets/images/education.gif";
import bannerImage from "@/assets/images/5 (1).svg";
import bannerBgTablet from "@/assets/images/3333.png";
import systemIcon from "@/assets/images/sepehrsalamat.png";
import shopBannerIcon from "@/assets/images/3.webp";
import shopBannerFiller2 from "@/assets/images/2.png";
import shopBannerFiller from "@/assets/images/3.png";
import CustomButton from "@/components/button";
import { toast } from "@/components/toast/toastApi";

interface Category {
  title: string;
  icon: string;
  url?: string;
  searchParams?: string;
  type?: string;
  cardColor: string;
  key: string;
}

export function HomePage() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const code = queryParams.get("code");
  const doctorsAndCounselingPsychologistUrl =
    "https://sso.inhso.ir/oidc/auth?client_id=client_1754117598828_b4e0885381f0f549&redirect_uri=https://consultation.inhso.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir";

  useEffect(() => {
    const sendHealthMinsCode = async () => {
      if (code) {
        const res = await apiServices.post(endpoints.healthGovRegister, {
          code,
        });
        if (res.isSuccess) {
          const result = await apiServices.get(endpoints.checkAuthorize);
          if (result.isSuccess) {
            dispatch(setIsLoggedIn(result?.data?.data?.isLogin));
            dispatch(setUserRole(result?.data?.data?.roles?.ourRoles));
          }
          if (result?.data?.data?.isLogin === true) {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            navigate(pathRoutes.homePagePath);
          }
          toast.success((res.data as any)?.messageFa);
        } else {
          toast.error((res.error as any)?.messageFa);
          navigate(pathRoutes.homePagePath);
        }
      }
    };

    sendHealthMinsCode();
  }, [code, dispatch, navigate, queryClient]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const categories: Category[] = [
    {
      key: "places",
      title: t("header.places"),
      icon: clinicIcon,
      url: pathRoutes.medicalCenter,
      cardColor: "!bg-[linear-gradient(115deg,#ff512f,#dd2476)]",
    },
    {
      key: "drugstore",
      title: t("drugstore"),
      icon: drugsIcon,
      type: "pharmacy",
      url: pathRoutes.pharmaciesCompanies,
      cardColor:
        "!bg-[linear-gradient(319deg,#6a5acd_0%,#c54b8c_37%,#b284be_100%)]",
    },
    {
      key: "paraclinic",
      title: t("paraclinic"),
      icon: paraclinicIcon,
      cardColor:
        "!bg-[linear-gradient(319deg,#cd5700_0%,#fd9600_37%,#bfdd50_100%)]",
    },
    {
      key: "healthcareCompanies",
      title: t("healthcareCompanies"),
      icon: healthcareCompaniesIcon,
      url: pathRoutes.healthcareCompanies,
      cardColor:
        "!bg-[linear-gradient(159deg,rgba(0,0,128,1)_0%,rgba(0,191,255,1)_100%)]",
    },
    {
      key: "doctorsAndCounselingPsychologist",
      title: t("doctorsAndCounselingPsychologist"),
      icon: doctorsAndCounselingPsychologistIcon,
      cardColor:
        "!bg-[linear-gradient(159deg,rgb(34,139,34)_0%,rgb(50,205,50)_100%)]",
    },
    {
      key: "taghziye",
      title: t("taghziye"),
      icon: taghziyeIcon,
      url: "search",
      type: "place",
      cardColor:
        "!bg-[linear-gradient(159deg,rgba(65,105,255,1)_0%,rgba(137,207,240,1)_100%)]",
    },
    {
      key: "healthRoom",
      title: t("healthRoom"),
      icon: teaIcon,
      cardColor: "!bg-[linear-gradient(115deg,#09610a,#67f588)]",
    },
    {
      key: "insurance",
      title: t("insurance"),
      icon: insuranceIcon,
      cardColor: "!bg-[linear-gradient(315deg,#e056fd_0%,#000000_74%)]",
      url: pathRoutes.insurancesCompanies,
    },
    {
      key: "healthTourism",
      title: t("healthTourism"),
      icon: healthTourismIcon,
      cardColor:
        "!bg-[linear-gradient(159deg,rgba(65,105,255,1)_0%,rgba(137,207,240,1)_100%)]",
    },
    {
      key: "exercise",
      title: t("exercise"),
      icon: runningIcon,
      cardColor: "!bg-[linear-gradient(115deg,#ff6677,#f48e5f,#ff5047)]",
    },
    {
      key: "transportation",
      title: t("transportation"),
      icon: ambulanceIcon,
      cardColor: "!bg-[linear-gradient(315deg,#e34234_0%,#ff3800_74%)]",
    },
    {
      key: "homeNursingCare",
      title: t("homeNursingCare"),
      icon: homeNursingCareIcon,
      cardColor: "!bg-[linear-gradient(315deg,#3bb78f_0%,#0bab64_74%)]",
    },
    {
      key: "locator",
      title: t("locator"),
      icon: mapLocatorIcon,
      url: "map",
      cardColor: "!bg-[linear-gradient(to_right,#f7971e,#ffd200)]",
    },
    {
      key: "creditPayment",
      title: t("creditPayment"),
      icon: creditPaymentIcon,
      cardColor: "!bg-[linear-gradient(315deg,#63d471_0%,#233329_74%)]",
    },
    {
      key: "shops",
      title: t("shops"),
      icon: shopIcon,
      cardColor: "!bg-[linear-gradient(326deg,#cd1c18_0%,#66023c_74%)]",
    },
    {
      key: "volunteeringCampaign",
      title: t("volunteeringCampaign"),
      icon: volunteeringCampaignIcon,
      cardColor: "!bg-[linear-gradient(315deg,#F6C324_0%,#F17E7E_74%)]",
    },
    {
      key: "education",
      title: t("education"),
      icon: educationIcon,
      cardColor: "!bg-[linear-gradient(to_right,#8CA6DB,#B993D6)]",
    },
    {
      key: "awareness",
      title: t("awareness"),
      icon: awarenessIcon,
      cardColor: "!bg-[linear-gradient(to_right,#f83600,#fe8c00)]",
    },
  ];

  const firstRowCategories = categories.slice(0, 7);
  const secondRowCategories = categories.slice(7, 14);
  const thirdRowCategories = categories.slice(14);

  return (
    <article className="!w-full ">
      <div className="w-full lg:max-w-[1170px] mx-auto px-4 md:px-0 ">
        {/* --- CONSULTATION BANNER (compact on mobile) --- */}
        <section
          dir="rtl"
          className="pt-6 xs:px-[20px] md:px-[50px] lg:px-[25px] xl:px-[44px]"
        >
          {/* Main container with a light red background */}
          <div className="flex flex-col-reverse md:flex-row justify-between bg-red-50 rounded-2xl shadow-lg overflow-hidden">
            {/* --- Text Content (On the right for desktop, bottom for mobile) --- */}
            <div className="w-full md:w-1/2 p-6 lg:p-10 text-center md:text-right">
              <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-slate-800 leading-tight">
                {t("homePage.consultationBannerTitle")}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {t("homePage.consultationBannerDesc")}
              </p>
              <Link
                to={doctorsAndCounselingPsychologistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6" // Use inline-block for margin to apply
              >
                <CustomButton className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 sm:py-3 sm:px-8 text-sm sm:text-base rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {t("homePage.consultationBannerButton")}
                </CustomButton>
              </Link>
            </div>

            {/* --- Image (On the left for desktop, top for mobile) --- */}
            <div className=" ">
              <img
                src={bannerImage}
                alt={t("homePage.consultationBannerTitle")} // Important for accessibility
                className="w-full h-64 object-contain flex"
              />
            </div>
          </div>
        </section>

        {/* --- CATEGORIES & BANNERS SECTION --- */}
        <section className="category-section">
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-[30px] py-10">
            {firstRowCategories.map((item, i) => (
              <CategoryCard
                key={i}
                cardKey={item.key}
                categoryType={item.type}
                searchParams={item.searchParams}
                url={item.url}
                title={item.title}
                icon={item.icon}
                cardColor={item.cardColor}
              />
            ))}
          </div>

          {/* --- Main BANNER (row on mobile, compact) --- */}
          <div className=" xs:px-[27px] md:px-[50px] lg:px-[20px] xl:px-[44px] mb-10">
            <div
              className="
      group relative z-0 flex flex-row sm:flex-row-reverse items-stretch w-full overflow-hidden
      rounded-3xl h-32 sm:h-40 md:h-52 lg:h-56
      text-rose-950
      bg-gradient-to-r from-red-200 via-[#ecdccf] to-red-300
      ring-1 ring-rose-200/70 shadow-lg shadow-rose-200/60
      transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
      before:absolute before:inset-0 before:z-0
      before:bg-[radial-gradient(120%_90%_at_-10%_-10%,rgba(255,255,255,0.5),transparent_60%),radial-gradient(120%_90%_at_110%_120%,rgba(255,255,255,0.35),transparent_60%)]
      before:pointer-events-none
    "
            >
              {/* Image side */}
              <div className="relative basis-2/5 shrink-0 min-w-0 flex items-center justify-end overflow-hidden">
                <img
                  src={bannerBgTablet}
                  alt="Friendly healthcare illustration"
                  className="w-full h-full object-fit  md:object-fill object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* gentle fade from image to text area */}
                <div
                  className="
          pointer-events-none absolute inset-y-0 right-0 sm:left-0 sm:right-auto
          w-20 sm:w-28 md:w-32
          bg-gradient-to-l sm:bg-gradient-to-r from-transparent
        "
                />
              </div>

              {/* Text side */}
              <div
                className="
        relative z-10 basis-3/5 min-w-0
        flex flex-col justify-center
        mx-auto sm:mx-0 items-center md:items-start text-center md:text-left
        px-4 sm:px-6 md:px-8
      "
              >
                <div className="flex md:block items-center gap-2 md:gap-0">
                  <img
                    src={systemIcon}
                    alt="System Icon"
                    className="w-5 h-5 xs:w-7 xs:h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-0 md:mb-3 opacity-90
                     bg-white/60 p-1 rounded-xl ring-1 ring-white/70 shadow-sm"
                    loading="lazy"
                  />
                  <h2 className="text-[0.9rem] 2xs:text-[0.7rem] xs:text-[0.85rem] sm:text-xl md:text-xl lg:text-start font-extrabold leading-tight max-w-xl">
                    {t("homePage.mainBannerTitle")}
                  </h2>
                </div>

                <p className="mt-2 text-[0.7rem] 2xs:text-[0.6rem] sm:text-sm md:text-base max-w-xl md:text-start text-rose-900/90">
                  {t("homePage.mainBannerDesc")}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-[30px] pb-10">
            {secondRowCategories.map((item, i) => (
              <CategoryCard
                key={i}
                cardKey={item.key}
                categoryType={item.type}
                searchParams={item.searchParams}
                url={item.url}
                title={item.title}
                icon={item.icon}
                cardColor={item.cardColor}
              />
            ))}
          </div>

          <section
            className="pb-8 xs:px-[27px] md:px-[50px] lg:px-[20px] xl:px-[44px] "
            dir="rtl"
          >
            <div className="relative isolate rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200 shadow-sm w-full">
              <div className="flex flex-col md:flex-row-reverse h-28 sm:h-36 md:h-44 lg:h-48 w-full">
                <div className="order-1 md:order-1 flex-1 md:flex-none md:basis-7/12 flex items-center justify-center md:justify-end text-center md:text-right p-3 sm:p-5 md:p-6">
                  <div className="w-full">
                    <h3 className="font-extrabold text-slate-800 2xs:text-[0.9rem] xs:text-[1rem] sm:text-lg md:text-xl">
                      {t("homePage.shopBannerTitle")}
                    </h3>
                    <p className="mt-1 text-slate-600 2xs:text-[0.8rem] xs:text-[0.85rem] sm:text-sm md:text-[0.95rem] leading-relaxed">
                      {t("homePage.shopBannerDesc")}
                    </p>

                    <Link
                      className="mt-3 flex justify-center md:justify-end"
                      to={pathRoutes.pharmaciesCompanies}
                    >
                      <CustomButton className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                        {t("homePage.shopBannerButton")}
                      </CustomButton>
                    </Link>
                  </div>
                </div>

                <div className="order-2 md:order-2 flex-1 md:flex-none md:basis-5/12 relative flex items-center justify-center bg-[#149CBF] p-3 sm:p-4">
                  <img
                    src={shopBannerIcon}
                    alt="Online Pharmacy Delivery"
                    className="w-[80%] object-contain"
                    loading="lazy"
                  />
                  {/* Soft decorative blobs */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  >
                    <div className="absolute -top-10 right-6 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
                    <div className="absolute -bottom-12 left-4 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                  </div>
                </div>
              </div>

              {/* Filler images: small screens only, absolutely positioned */}
              <img
                src={shopBannerFiller}
                alt=""
                aria-hidden="true"
                className="absolute bottom-1 right-2 h-10 sm:h-12 opacity-70 pointer-events-none select-none md:hidden"
                loading="lazy"
              />
              <img
                src={shopBannerFiller2}
                alt=""
                aria-hidden="true"
                className="absolute bottom-1 left-2 h-10 sm:h-12 opacity-50 pointer-events-none select-none md:hidden"
                loading="lazy"
              />
            </div>
          </section>

          <div className="grid grid-cols-4 lg:grid-cols-5 gap-[30px] pb-10">
            {thirdRowCategories.map((item, i) => (
              <CategoryCard
                key={i}
                cardKey={item.key}
                categoryType={item.type}
                searchParams={item.searchParams}
                url={item.url}
                title={item.title}
                icon={item.icon}
                cardColor={item.cardColor}
              />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}

export default HomePage;
