/**
 *
 * Logo
 *
 */

import logo from "@/assets/images/logo.svg";
import { useTranslation } from "react-i18next";

interface ILogoProps {
  isikato?: boolean;
  title?: string;
  src?: string;
  subtitle?: string;
}
const Logo: React.FC<ILogoProps> = ({ isikato, src, title, subtitle }) => {
  const { t } = useTranslation();
  const logoTitle = title || t("logoTitle");

  return (
    <span className="logo-content flex h-[60px]">
      <img src={src || logo} alt="logo icon" className="h-full" />
      <span
        className={`${
          isikato && "!mt-7"
        } logo-text flex flex-col justify-center`}
      >
        <div className="logo-title text-[20px] text-center text-colorPrimary">
          {/* <FormattedMessage {...messages.logoTitle} /> */}
          {/* {props.logoTitle} */}
          {logoTitle}
          <p className="text-[14px] text-center text-colorPrimary">
            {subtitle}
          </p>
          {isikato && (
            <>
              <p className="text-[14px] text-center text-colorPrimary">
                {t("logoTitle")}
              </p>
            </>
          )}
        </div>
        {/* <span className="logo-subtitle">
                    <FormattedMessage {...messages.logoSubtitle} />
                </span> */}
      </span>
    </span>
  );
};

// Logo.defaultProps = {
//     src: logo,
//     logoTitle: t('logoTitle'),
// };

export default Logo;
