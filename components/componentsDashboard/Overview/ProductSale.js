import React, {useState} from "react";
// import ReactApexChart from 'react-apexcharts';
import {useTheme} from "@mui/material";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TotalRevenue = ({ seriesData, labels }) => {
  const [series, setSeries] = useState(seriesData);
  const theme = useTheme();

  const chartOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "donut",
      sparkline: {
        enabled: true,
      },
    },
    labels: labels,
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: true,
      position: "right",
      offsetY: 0,
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          legend: {
            position: "right",
          },
        },
      },
    ],
    colors: ["#1C9929", "#3294D1", "#D16F32"],
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: "60%",
        },
      },
    },
    stroke: {
      colors: [theme.palette.background.paper],
    },
    series,
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: "dark",
      custom: ({ seriesIndex, w }) =>
        `<div class="flex items-center h-10 min-h-10 max-h-10 px-5">
            <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
            <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}</div>
        </div>`,
    },
  };

  return (
    <div>
      {typeof window !== "undefined" && (
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={series}
          type={chartOptions.chart.type}
          height={200}
        />
      )}
    </div>
  );
};

export default TotalRevenue;
