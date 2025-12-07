import React, { useEffect, useState } from "react";
import { AiOutlineControl } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import FilterContent from "./FilterContent";
import HospitalCard from "./hospitalCard";
import hospitalImg from "@/assets/images/hospitalImg.png";
import CustomButton from "@/components/button";
// Ensure this path is correct for where you saved the Modal code
import { Modal } from "@/components/modal/Modal";

const data = {
  name: "بیمارستان ایرانمهر",
  address: "خیابان شریعتی -قلهک",
  comments: "0 نظر",
};

const HospitalsList: React.FC = () => {
  const { t } = useTranslation();
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [filterModal, setFilterModal] = useState<boolean>(false);

  const updateDimensions = (): void => {
    setScreenWidth(window.innerWidth);
    // It's good practice to close mobile modals if resizing to desktop view
    if (window.innerWidth > 768) {
       setFilterModal(false);
    }
  };

  useEffect(() => {
    // No need to call updateDimensions() immediately on mount as useState initializes with window.innerWidth
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const showFilterModal = (): void => {
    setFilterModal(true);
  };

  const closeFilterModal = (): void => {
    setFilterModal(false);
  };

  return (
    <div className="flex justify-between">
      {screenWidth <= 768 ? (
        <div className="mobile-filter-sort-btns left-0 right-0 bottom-[30px] my-0 mx-auto fixed z-10 text-center">
          <CustomButton
            className="!text-[#a0aace] shadow-[0px_10px_15px_rgba(50, 51, 90, 0.102)] !rounded-tl-none !rounded-bl-none"
            type="primary"
            icon={<AiOutlineControl size={16}/>}
            onClick={showFilterModal}
          >
            {t("showFilters")}
          </CustomButton>
        </div>
      ) : (
        <div className="w-1/4 min-h-60">
          <div className="p-5 rounded-xl justify-center bg-gray-200">
            <FilterContent />
          </div>
        </div>
      )}

      <div className="md:w-4/6 w-full min-h-60">
        <HospitalCard cardImage={hospitalImg} data={data} />
      </div>

      <Modal
        open={filterModal}
        onClose={closeFilterModal}
        footer={null}
        dir="rtl"
      >
        <FilterContent />
      </Modal>
    </div>
  );
};

export default HospitalsList;