import PanelHeader from "@/components/panelHeader";
import { ReactNode } from "react";

interface ContentLayoutProps {
  header?: {
    title: string;
    description?: string;
    extraContent?: ReactNode;
  };
  children: ReactNode;
  className?: string;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  header,
  children,
  className,
}) => {
  return (
    <div className={`p-9 bg-white shadow-md rounded-2xl ${className ?? ""}`}>
      {header && (
        <PanelHeader
          title={header.title}
          description={header.description}
          extraContent={header.extraContent}
        />
      )}

      {children}
    </div>
  );
};

export default ContentLayout;
