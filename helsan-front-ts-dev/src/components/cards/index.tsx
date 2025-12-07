import React from "react";
import CustomButton from "../button";

interface ICardProps {
  linkTitle?: string;
  title?: string;
  image?: string;
  link: string;
}

const CardSample: React.FC<ICardProps> = ({
  title,
  linkTitle,
  image,
  link,
}) => {
  return (
    <div>
      <div className="group relative text-center w-30 h-30 md:w-40 md:h-40 rounded-[20px] bg-[#f5f5f5] p-2 border-2 border-[#c3c6ce] transition-all duration-500 ease-out overflow-visible hover:border-colorPrimary hover:shadow-[0_4px_18px_0_rgba(0,0,0,0.25)]">
        <div className="grid h-[70%] place-content-center gap-[0.5em] text-black">
          <img className="w-1/2 mx-auto" src={image} />
        </div>
        <p className="text-xs md:text-base mt-1 font-bold">{title}</p>

        <a href={link} target="_blank">
          <CustomButton className="hidden 2xl:block absolute cursor-pointer left-1/2 bottom-0 w-9/10 transform -translate-x-1/2 translate-y-[125%] rounded-[1rem] bg-colorPrimary text-white text-sm md:text-base py-2 px-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-[50%] group-hover:opacity-100">
            {linkTitle}
          </CustomButton>
        </a>
      </div>

      <div className="mt-2 block 2xl:hidden text-center">
        <a href={link} target="_blank">
          <CustomButton className="w-full rounded-[1rem] bg-colorPrimary text-white text-sm py-2 !cursor-pointer">
            {linkTitle}
          </CustomButton>
        </a>
      </div>

    </div>
  );
};

export default CardSample;
