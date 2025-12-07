import { useState, useMemo } from "react";
import { DatePicker, Select } from "antd";
import { useTranslation } from "react-i18next";
import CustomButton from "../button";
import FloatingSelect from "../floatingFields/FloatingSelect";

const { Option } = Select;

const FilteredChartes = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [selectedSecondOption, setSelectedSecondOption] = useState<
    string | undefined
  >();
  const [startDate, setStartDate] = useState<any>(null);

  // Build the second dropdown options based on the first select
  const secondOptions = useMemo(() => {
    switch (selectedOption) {
      case "day":
        return [
          t("1 recent day", { defaultValue: "1 recent day" }),
          t("3 recent days", { defaultValue: "3 recent days" }),
          t("7 recent days", { defaultValue: "7 recent days" }),
          t("12 recent days", { defaultValue: "12 recent days" }),
          t("18 recent days", { defaultValue: "18 recent days" }),
        ];
      case "month":
        return [
          t("1 recent month", { defaultValue: "1 recent month" }),
          t("3 recent months", { defaultValue: "3 recent months" }),
          t("6 recent months", { defaultValue: "6 recent months" }),
          t("9 recent months", { defaultValue: "9 recent months" }),
        ];
      case "year":
        return [
          t("1 recent year", { defaultValue: "1 recent year" }),
          t("3 recent years", { defaultValue: "3 recent years" }),
          t("6 recent years", { defaultValue: "6 recent years" }),
          t("9 recent years", { defaultValue: "9 recent years" }),
        ];
      default:
        return [];
    }
  }, [selectedOption, t]);

  return (
    <div dir={dir} className="w-full">
      {/* Responsive grid: 1 col on mobile, 2 on small, 4 on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 items-start">
        {/* Date */}
        <div className="w-full">
          <DatePicker
            placeholder={t("fromDate")}
            value={startDate}
            onChange={setStartDate}
            className="w-full rounded-md bg-white"
            style={{ width: "100%",height:"50px" }}
          />
        </div>

        {/* First select */}
        <div className="w-full">
          <FloatingSelect
            label=""
            className="w-full"
            placeholder={t("filterBarAsas")}
            value={selectedOption}
            onChange={(v) => {
              setSelectedOption(v);
              setSelectedSecondOption(undefined);
            }}
            allowClear
            size="middle"
          >
            <Option value="day">{t("day")}</Option>
            <Option value="month">{t("month")}</Option>
            <Option value="year">{t("year")}</Option>
          </FloatingSelect>
        </div>

        {/* Second select (depends on first) */}
        <div className="w-full">
          <FloatingSelect
            label=""
            className="w-full"
            placeholder={t("select")}
            disabled={!selectedOption}
            value={selectedSecondOption}
            onChange={setSelectedSecondOption}
            allowClear
            size="middle"
          >
            {secondOptions.map((opt, idx) => (
              <Option key={idx} value={String(opt)}>
                {opt}
              </Option>
            ))}
          </FloatingSelect>
        </div>

        {/* Search button */}
        <div className="w-full">
          <CustomButton
            type="primary"
            className="w-full lg:w-auto bg-colorPrimary"
            onClick={() => {
              // console.log({ startDate, selectedOption, selectedSecondOption });
            }}
            disabled={!startDate || !selectedOption || !selectedSecondOption}
          >
            {t("search")}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default FilteredChartes;
