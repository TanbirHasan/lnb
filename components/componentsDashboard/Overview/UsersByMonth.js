import React, { useEffect, useState } from "react";
// import ReactApexChart Chart from 'react-apexcharts';
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const UsersByMonth = ({ userNumber, userMonth, type, title }) => {
  const data = {
    options: {
      chart: {
        type: "bar",
        height: 380,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          dataLabels: {
            position: "center",
            align: 'center'
          },
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        align:'center',
        style: {
          colors: ["#fff"],
        },

        offsetX: 0,
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: userMonth || "NA",
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      // subtitle: {
      //     text: 'Category Names as DataLabels inside bars',
      //     align: 'center',
      // },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
    series: [
      {
        name: "Revenue",
        data: userNumber || [0],
      },
    ],
  };

  return (
    <div>
      {typeof window !== "undefined" && userNumber && userMonth && (
        <ReactApexChart
          options={data.options}
          series={data.series}
          type={type || "bar"}
          height={400}
        />
      )}
    </div>
  );
};

export default UsersByMonth;


