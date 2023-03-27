import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartPlaceHolder from "./chartPlaceHolder";
import "./style.css";
import { faker } from "@faker-js/faker";
import { useState } from "react";
import ChartLayout from "./chartLayout";
import UITableChart from "./tableChart";

const UIBarChart = ({title, data, height, width, tableData, className, info}:any) => {
  const [toggleView, setToggleView] = useState(true);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: false,
        text: title,
      },
    },
  };


  return (
   <ChartLayout title={title} toggleView={toggleView} setToggleView={setToggleView} info={info}>
      <section className={`chart bar ${className}`}>
        {data?.datasets[0]?.data?.length ? (
          toggleView ? (
            <Bar options={options} data={data} width={width} height={height}/>
          ) : (
            <UITableChart data={tableData} />
          )
        ) : (
          <ChartPlaceHolder />
        )}
      </section>
  </ChartLayout>
  );
};

export default UIBarChart;
