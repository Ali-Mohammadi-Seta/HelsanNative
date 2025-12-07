import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import HC_more from 'highcharts/highcharts-more';
// import Exporting from 'highcharts/modules/exporting';
// import ExportData from 'highcharts/modules/export-data';
import moment from 'moment-jalaali';
import 'moment/locale/fa';
import 'moment/locale/en-gb';
import { useTranslation } from 'react-i18next';

// HC_more(Highcharts);
// Exporting(Highcharts);
// ExportData(Highcharts);
moment.loadPersian();

interface HeartRateDataItem {
  pulse: number | null;
  createdAt: string;
}

interface HeartRateChartProps {
  width?: string | number;
  height?: number;
  heartRate?: HeartRateDataItem[];
}

interface ParsedData {
  Date: string[];
  Pulse: number[];
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({
  width = '100%',
  height = 300,
  heartRate = [],
}) => {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState<'fa' | 'en-gb'>('fa');

  useEffect(() => {
    const currentLang = i18n.language;
    setLocale(currentLang === 'fa' ? 'fa' : 'en-gb');
    moment.locale(currentLang === 'fa' ? 'fa' : 'en-gb');
  }, [i18n.language]);

  const parseHeartRate = (heartRate: HeartRateDataItem[]): ParsedData => {
    if (!Array.isArray(heartRate)) return { Date: [], Pulse: [] };

    const dates: string[] = [];
    const pulses: number[] = [];

    for (const sign of heartRate) {
      const { pulse, createdAt } = sign;
      if (pulse != null) {
        dates.push(moment(createdAt).format('YYYY-MM-DD'));
        pulses.push(pulse);
      }
    }

    return {
      Date: dates,
      Pulse: pulses,
    };
  };

  const data = parseHeartRate(heartRate);

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: '#f7f7f7',
      height,
      margin: [40, 50, 80, 60],
      style: {
        fontFamily: 'IRANSans',
      },
    },
    title: {
      text: '',
      style: {
        fontFamily: 'IRANSans',
      },
    },
    xAxis: {
      categories: data.Date.map((date) =>
        locale === 'fa'
          ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')
          : moment(date, 'YYYY-MM-DD').format('YYYY/MM/DD')
      ),
      title: {
        text: t('dateByMonth'),
        style: {
          color: '#666666',
          fontFamily: 'IRANSans',
        },
      },
      labels: {
        style: {
          color: '#666666',
          fontFamily: 'IRANSans',
        },
        formatter: function () {
          return locale === 'fa'
            ? moment(this.value as string, 'jYYYY/jMM').format('jMM')
            : moment(this.value as string, 'YYYY/MM').format('MM');
        },
      },
    },
    yAxis: {
      title: {
        text: t('heart'),
        style: {
          color: '#666666',
          fontFamily: 'IRANSans',
        },
        align: 'high',
        rotation: 0,
        y: -10,
        x: 0,
      },
      labels: {
        style: {
          color: '#666666',
          fontFamily: 'IRANSans',
        },
      },
    },
    tooltip: {
      shared: true,
      style: {
        fontFamily: 'IRANSans',
      },
    //   formatter: function () {
    //     // `this` is a Highcharts.TooltipFormatterContextObject
    //     const fullDate =
    //       locale === 'fa'
    //         ? moment(this.x as string, 'jYYYY/jMM/jDD').format('jYYYY/jMM/jDD')
    //         : moment(this.x as string, 'YYYY/MM/DD').format('YYYY/MM/DD');
    //     return `<b>${fullDate}</b><br/>${t('heart')}: ${this.points?.[0].y ?? ''}`;
    //   },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: 'IRANSans',
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
        name: t('heart'),
        data: data.Pulse,
        color: '#ff4d4f',
        type: 'line',
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
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#666666',
        fontSize: '12px',
        fontFamily: 'IRANSans',
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
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
            yAxis: {
              title: {
                text: '',
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

export default HeartRateChart;
