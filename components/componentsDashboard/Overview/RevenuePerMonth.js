import React, { useEffect, useState } from "react";
// import ReactApexChart Chart from 'react-apexcharts';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueChart = ({ values, months, paymentMade }) => {
  const data = {
    options: {
      // tooltip: {
      //   y: {
      //     formatter: function(value) {
      //       return `$${value.toFixed(2)}`;
      //     }
      //   }
      // },
      chart: {
        id: "revenue-chart",
        type: "area",
        height: 400,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: months || ["Jan"],
      },
      yaxis: {
        title: {
          text: "Revenue",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
    },
    series: [
      {
        name: "Revenue",
        data: values || [0],
      },
      {
        name: "Payment Made",
        data: paymentMade || [0],
      },
    ],
  };

  return (
    <div>
      {typeof window !== "undefined" && values && months && (
        <Chart
          options={data.options}
          series={data.series}
          type="area"
          height={400}
        />
      )}
    </div>
  );
};

export default RevenueChart;
