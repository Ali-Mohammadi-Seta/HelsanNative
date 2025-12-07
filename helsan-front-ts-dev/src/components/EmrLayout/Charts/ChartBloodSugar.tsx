import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import HC_more from "highcharts/highcharts-more";
// import Exporting from "highcharts/modules/exporting";
// import ExportData from "highcharts/modules/export-data";
import moment from "moment-jalaali";
import "moment/locale/fa";
import "moment/locale/en-gb";
import { useTranslation } from "react-i18next";

// HC_more(Highcharts);
// Exporting(Highcharts);
// ExportData(Highcharts);
moment.loadPersian();

interface BloodSugarDataPoint {
  createdAt: string;
  bloodSuger?: Array<{
    beforeMeal?: number;
    afterMeal?: number;
  }>;
}

interface BloodSugarChartProps {
  width?: string | number;
  height?: number;
  bloodSugar?: BloodSugarDataPoint[];
}

const BloodSugarChart: React.FC<BloodSugarChartProps> = ({
  width = "100%",
  height = 300,
  bloodSugar,
}) => {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<"fa" | "en-gb">("fa");

  useEffect(() => {
    const currentLang = i18n.language;
    const newLocale = currentLang === "fa" ? "fa" : "en-gb";
    setLocale(newLocale);
    moment.locale(newLocale);
  }, [i18n.language]);

  const parseBloodSugar = (
    raw: BloodSugarDataPoint[] | null | undefined | any
  ) => {
    const data: BloodSugarDataPoint[] = Array.isArray(raw) ? raw : [];

    const result = {
      Date: [] as string[],
      BeforeMeal: [] as number[],
      AfterMeal: [] as number[],
    };

    for (const entry of data) {
      const { createdAt, bloodSuger } = entry;
      if (bloodSuger && bloodSuger.length > 0) {
        result.Date.push(moment(createdAt).format("YYYY-MM-DD"));
        result.BeforeMeal.push(bloodSuger[0]?.beforeMeal ?? 0);
        result.AfterMeal.push(bloodSuger[0]?.afterMeal ?? 0);
      }
    }

    return result;
  };

  const data = parseBloodSugar(bloodSugar ?? []);

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "#f7f7f7",
      height,
      margin: [40, 50, 80, 60],
      style: {
        fontFamily: "IRANSans",
      },
    },
    title: { text: "" },
    xAxis: {
      categories: data.Date.map((date) =>
        locale === "fa"
          ? moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD")
          : moment(date, "YYYY-MM-DD").format("YYYY/MM/DD")
      ),
      title: {
        text: t("dateByMonth"),
        style: {
          color: "#666666",
          fontFamily: "IRANSans",
        },
      },
      labels: {
        style: {
          color: "#666666",
          fontFamily: "IRANSans",
        },
        formatter: function () {
          return locale === "fa"
            ? moment(String(this.value), "jYYYY/jMM/jDD").format("jMM")
            : moment(String(this.value), "YYYY/MM/DD").format("MM");
        },
      },
    },
    yAxis: {
      title: {
        text: t("Blood Sugar (mg/dL)"),
        style: {
          color: "#666666",
          fontFamily: "IRANSans",
        },
        align: "high",
        rotation: 0,
        y: -10,
        x: 0,
      },
      labels: {
        style: {
          color: "#666666",
          fontFamily: "IRANSans",
        },
      },
    },
    tooltip: {
      shared: true,
      style: {
        fontFamily: "IRANSans",
      },
      //   formatter: function () {
      //     const fullDate =
      //       locale === 'fa'
      //         ? moment(this.x as string, 'jYYYY/jMM/jDD').format('jYYYY/jMM/jDD')
      //         : moment(this.x as string, 'YYYY/MM/DD').format('YYYY/MM/DD');

      //     return `<b>${fullDate}</b><br/>${t('nashta')}: ${
      //       this.points?.[1]?.y ?? ''
      //     }<br/>${t('ghandbad')}: ${this.points?.[0]?.y ?? ''}`;
      //   },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "IRANSans",
          },
          formatter: function () {
            return `${this.y}`;
          },
        },
        enableMouseTracking: true,
      },
    },
    series: [
      {
        name: t("ghandbad"),
        data: data.AfterMeal,
        color: "#ff4d4f",
        type: "line",
      },
      {
        name: t("nashta"),
        data: data.BeforeMeal,
        color: "#40a9ff",
        type: "line",
      },
    ],
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: true,
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
      itemStyle: {
        color: "#666666",
        fontSize: "12px",
        fontFamily: "IRANSans",
      },
    },
    responsive: {
      rules: [
        {
          condition: { maxWidth: 500 },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
            yAxis: {
              title: { text: "" },
            },
          },
        },
      ],
    },
  };

  return (
    <div style={{ width, height }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BloodSugarChart;
