import { Typography } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;
interface IPanelHeaderProps {
  title: string;
  description?: string;
  extraContent?: ReactNode;
}
const PanelHeader: React.FC<IPanelHeaderProps> = ({
  title,
  description,
  extraContent,
}) => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <Title className="!mb-0 !py-5" level={4}>
          {title}
        </Title>
        <div>{extraContent}</div>
      </div>
      <p className="text-[15px]  text-gray-500">{description}</p>
    </div>
  );
};

export default PanelHeader;
