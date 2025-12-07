import { setDirection } from "@/redux/reducers/direction/directionReducer";
import { Dispatch } from "redux";
import i18next from "i18next";

export const changeLanguage = (
  language: "fa" | "en",
  dispatch: Dispatch,
  i18n: typeof i18next,
  setCurrentLanguage: (lang: "fa" | "en") => void
) => {
  setCurrentLanguage(language);
  i18n.changeLanguage(language);

  const isRtl = language === "fa";

  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = language;

  dispatch(setDirection(isRtl));
};
