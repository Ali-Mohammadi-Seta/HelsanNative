import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// import HC_more from "highcharts/highcharts-more";
// import Exporting from "highcharts/modules/exporting";
// import ExportData from "highcharts/modules/export-data";
import moment from "moment-jalaali";
import { useTranslation } from "react-i18next";

// HC_more(Highcharts);
// Exporting(Highcharts);
// ExportData(Highcharts);
moment.loadPersian();

type BloodPressureReading = {
  lower: number;
  upper: number;
};

type VitalSign = {
  createdAt: string;
  bloodPressure: BloodPressureReading[];
};

type ChartData = {
  Date: string[];
  Lower: number[];
  Upper: number[];
};

interface BloodPressureChartProps {
  width?: string | number;
  height?: number;
  vitalSigns?: VitalSign[];
}

const BloodPressureChart = ({
  width = "100%",
  height = 300,
  vitalSigns = [],
}: BloodPressureChartProps) => {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<"fa" | "en-gb">("fa");

  useEffect(() => {
    const currentLang = i18n.language;
    const newLocale = currentLang === "fa" ? "fa" : "en-gb";
    setLocale(newLocale);
    moment.locale(newLocale);
  }, [i18n.language]);

  const parseVitalSigns = (
    vitalSignsInput: VitalSign[] | undefined | null
  ): ChartData => {
    const vitalSigns = Array.isArray(vitalSignsInput) ? vitalSignsInput : [];

    const dates: string[] = [];
    const lowerValues: number[] = [];
    const upperValues: number[] = [];

    for (const sign of vitalSigns) {
      const { bloodPressure, createdAt } = sign;
      console.log("🚀 ~ parseVitalSigns ~ bloodPressure:", bloodPressure);
      if (bloodPressure && bloodPressure.length > 0) {
        dates.push(moment(createdAt).format("YYYY-MM-DD"));
        lowerValues.push(bloodPressure[0]?.lower ?? 0);
        upperValues.push(bloodPressure[0]?.upper ?? 0);
      }
    }

    return {
      Date: dates,
      Lower: lowerValues,
      Upper: upperValues,
    };
  };
  console.log("🚀 ~ parseVitalSigns ~ parseVitalSigns:", parseVitalSigns);

  const data = parseVitalSigns?.(vitalSigns);
  console.log("🚀 ~ BloodPressureChart ~ data:", data);

  Highcharts.setOptions({
    lang: {
      viewFullscreen: t("viewFullscreen"),
      contextButtonTitle: t("contextButtonTitle"),
      downloadJPEG: t("downloadJPEG"),
      downloadPDF: t("downloadPDF"),
      downloadPNG: t("downloadPNG"),
      downloadSVG: t("downloadSVG"),
      printChart: t("printChart"),
      viewData: t("viewData"),
      downloadCSV: t("downloadCSV"),
      downloadXLS: t("downloadXLS"),
    },
  });

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "#f7f7f7",
      height: height,
      margin: [40, 50, 80, 60],
      style: {
        fontFamily: "IRANSans",
      },
    },
    title: {
      text: "",
      style: {
        fontFamily: "IRANSans",
      },
    },
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
          const value = this.value?.toString() || "";
          return locale === "fa"
            ? moment(value, "jYYYY/jMM/jDD").format("jMM")
            : moment(value, "YYYY/MM/DD").format("MM");
        },
      },
    },
    yAxis: {
      title: {
        text: t("FESHAR"),
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
      // Optional: nicer tooltip
      formatter: function () {
        const x = this.x as any;
        const fullDate =
          locale === "fa"
            ? moment(x, "jYYYY/jMM/jDD").format("jYYYY/jMM/jDD")
            : moment(x, "YYYY/MM/DD").format("YYYY/MM/DD");

        const upper = this.points?.find(
          (p) => p.series.name === t("pressureUp")
        )?.y;
        const lower = this.points?.find(
          (p) => p.series.name === t("pressureDown")
        )?.y;

        return `<b>${fullDate}</b><br/>${t("pressureUp")}: ${upper}<br/>${t(
          "pressureDown"
        )}: ${lower}`;
      },
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
    // 🔥 Use your parsed data here
    series: [
      {
        type: "line",
        name: t("pressureUp"), // Upper
        data: data.Upper,
      },
      {
        type: "line",
        name: t("pressureDown"), // Lower
        data: data.Lower,
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
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
            yAxis: {
              title: {
                text: "",
              },
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

export default BloodPressureChart;
