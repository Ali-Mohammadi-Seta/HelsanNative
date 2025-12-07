import React from "react";
import { ConfigProvider, Rate, Tooltip } from "antd";
import { AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

interface HospitalData {
  name: string;
  address: string;
  comments: string;
}

interface HospitalCardProps {
  cardImage: string;
  data?: HospitalData;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ cardImage, data }) => {
  const { t } = useTranslation();

  return (
    <div className="justify-center">
      <div className="place-detail-card grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 items-center p-6 rounded-xl bg-gray-200 shadow-[0px_20px_40px] shadow-[#3f9eff0d]">
        <div className="flex flex-col justify-center items-center md:flex-row md:justify-start">
          <div className="place-img w-[80px] h-[80px] overflow-hidden rounded-[50%] me-[16px]">
            <img src={cardImage} alt="place avatar" className="w-full" />
          </div>
          <div className="place-info flex flex-1 flex-col justify-between">
            <div className="place-name flex items-center m-0 text-[16px] text-colorSecondary justify-center md:justify-start fm-bo font-IRANSans">
              <h3 className="place-name flex items-center m-0 text-[16px] text-colorSecondary fm-bo font-IRANSans">
                {data?.name}
              </h3>
              <Tooltip title={t("addToFav")} overlayClassName="add-to-wishlist">
                <span className="ms-2">
                  <AiOutlineHeart className="unliked cursor-pointer text-[#ff4370]" />
                </span>
              </Tooltip>
            </div>
            <h4 className="flex items-center gap-1 place-address m-0 pt-3 text-[12px] text-[#717f94] text-center md:text-right fm-rg font-IRANSans">
              <AiOutlineSend size={12}/>
              {data?.address}
            </h4>
          </div>
        </div>
        <div className="take-turns 2sm:w-full 2sm:!mt-[10px] 2sm:mx-auto flex flex-col items-center md:items-end">
          <div className="place-score">
            <ConfigProvider direction="ltr">
              <Rate disabled value={2} allowHalf style={{ direction: "ltr" }} />
            </ConfigProvider>
            <span className="score-detail m-[4px] text-[12px] text-[#717f94] fm-rg font-IRANSans">
              {data?.comments}
            </span>
          </div>
          <Link
            to={"#"}
            className="mt-4 text-center md:text-left"
            style={{ direction: "ltr" }}
          >
            <p className="take-turns-btn w-[172px] primary-grd-h text-colorPrimary hover:text-colorPrimary underline">
              {t("viweInfo")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
