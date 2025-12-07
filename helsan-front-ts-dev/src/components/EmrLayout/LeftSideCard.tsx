import { Card } from "antd";

const LeftSideCard = ({
  image,
  title,
  showModal,
}: {
  image: string;
  title: string;
  showModal: () => void;
}) => {
  return (
    <Card
      onClick={showModal}
      className="cursor-pointer mt-0 flex flex-col items-center justify-center text-[#333]
          border-solid rounded-md text-[13px] bg-white
          shadow-[0px_1px_5px_0px_rgb(0,0,0,0.2),0px_2px_2px_0px_rgb(0,0,0,0.14),0px_3px_1px_-2px_rgb(0,0,0,0.12)]
          border-white h-[90px] w-[145px] hover:shadow-none! hover:border-2 hover:border-colorPrimary!"
    >
      <img
        src={image}
        alt="addictions"
        className="mb-2 w-[35px] h-[35px] mx-auto"
      />
      <p className="text-[12px]! text-center">{title}</p>
    </Card>
  );
};

export default LeftSideCard;
