import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Logo from "@/components/logo";

function Footer() {
  const { t } = useTranslation();

  const quickAccess = [
    { link: "/about", text: t("footer.quickAccess.text1") },
    { link: "/contact-us", text: t("footer.quickAccess.text2") },
  ];

  const helpLinks = [
    { link: "/UserGuide", text: t("footer.helpLinks.text1") },
    { link: "/introduction", text: t("public.overview") },
    { link: "/rules", text: t("footer.helpLinks.text4") },
  ];

  return (
    <footer className="bg-white mt-16 !rounded-t-4xl shadow-3xl">
      <div className="container mx-auto px-6 py-10">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-5">
          {/* Logo Section */}
          <div className="col-span-8 md:col-span-4">
            <Logo />
            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              {t("footer.text1")} {t("footer.text2")}
            </p>
          </div>
          {/* Quick Access */}
          <div className="col-span-4 md:col-span-4 md:justify-items-center">
            <h5 className="font-bold text-sm mb-4 flex items-center gap-2 !text-colorPrimary">
              <span className="w-1 h-5 rounded !bg-colorPrimary"></span>
              {t("footer.QuickAccess")}
            </h5>
            <ul className="space-y-2">
              {quickAccess.map((item, i) => (
                <li key={i}>
                  <Link
                    className="text-slate-600 text-sm transition-colors hover:text-colorPrimary"
                    style={{
                      transition: "color 0.2s",
                    }}
                    to={item.link}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-span-4 md:col-span-4 md:justify-items-center">
            <h5 className="text-red-600 font-bold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded"></span>
              {t("footer.helpSite")}
            </h5>
            <ul className="space-y-2">
              {helpLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    className="text-slate-600 hover:text-red-600 text-sm transition-colors"
                    to={item.link}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Social Icons */}
          {/* <div className="md:col-span-2 flex md:justify-end gap-2">
            <a
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105"
              style={{ backgroundColor: "rgba(22, 163, 74, 0.1)" }}
              href="https://chat.whatsapp.com/DUBAvz5CUWpIL49DCbMaAT"
              aria-label="WhatsApp"
            >
              <i
                className="fa fa-whatsapp text-xl"
                style={{ color: "#16a34a" }}
              />
            </a>
            <a
              className="w-10 h-10 bg-red-100 hover:bg-red-500 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-105 group"
              href="https://ble.ir/join/NTk2OWNIY2"
              aria-label="Bale"
            >
              <span className="text-xl text-red-600 group-hover:text-white transition-colors">
                📱
              </span>
            </a>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
          <p className="text-xs text-slate-500">{t("footer.pardazeshgaran")}</p>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-white text-xs rounded-lg font-medium shadow-sm !bg-colorPrimary">
              {t("salamat")}
            </span>
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg font-medium shadow-sm">
              {t("behdasht")}
            </span>
            <span className="text-slate-400 text-xs mr-2">
              {t("version")} 1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
