import React, { FC, ReactElement } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { Input, Form, Skeleton } from "antd";
import { useTranslation } from "react-i18next";

type CaptchaSvg = string | ReactElement;

interface CaptchaWidgetProps {
  captcha?: { svg?: CaptchaSvg };
  inputValue?: string;
  setInputValue?: (value: string) => void;
  onRefresh?: () => void;
  captchaLoading?: boolean;
  name?: string;
  required?: boolean;
  requiredMessage?: string;
}

const CaptchaWidget: FC<CaptchaWidgetProps> = ({
  captcha,
  inputValue,
  setInputValue,
  onRefresh,
  captchaLoading,
  name = "captcha",
  required = true,
  requiredMessage,
}) => {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue?.(e.target.value);
  };

  const handleRefresh = () => onRefresh?.();

  const renderCaptcha = () => {
    if (captchaLoading) return <Skeleton.Input active />;
    const svg = captcha?.svg;
    if (!svg) return null;

    if (typeof svg === "string") {
      return (
        <div dangerouslySetInnerHTML={{ __html: svg }} aria-label="captcha" />
      );
    }

    return <div aria-label="captcha">{svg}</div>;
  };

  return (
    <Form.Item
      name={name}
      className="!mb-0"
      rules={
        required
          ? [
              {
                required: true,
                message: requiredMessage ?? t("captchaMessage"),
              },
            ]
          : undefined
      }
    >
      <div className="w-full relative mb-[100px]">
        <div className="absolute left-0 max-w-[152px] overflow-x-auto scrollbar-thin border border-gray-300 rounded-md">
          <div className="flex flex-col overflow-hidden">
            {renderCaptcha()}

            <div className="flex flex-row items-center">
              <Input
                value={inputValue}
                onChange={handleChange}
                className="w-3/4 h-10 rounded-none border-e border-gray-300"
                maxLength={5}
                inputMode="numeric"
                aria-label={t("captcha") as string}
                style={{ minWidth: 70 }}
              />

              <button
                type="button"
                onClick={handleRefresh}
                className="mx-2 flex items-center justify-center"
                aria-label={t("refreshCaptcha") as string}
                title={t("refreshCaptcha") as string}
              >
                <AiOutlineReload className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form.Item>
  );
};

export default CaptchaWidget;
