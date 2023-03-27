import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartPlaceHolder from "./chartPlaceHolder";
import "./style.css";


import { useState } from "react";
import ChartLayout from "./chartLayout";
import UITableChart from "./tableChart";
const UIPieChart = ({ title, data, tableData, className, info }: any) => {
  const [toggleView, setToggleView] = useState(true);
  ChartJS.register(ArcElement, Tooltip, Legend);
  const x = data?.labels
  return (
    <ChartLayout title={title} toggleView={toggleView} setToggleView={setToggleView} info={info}>
      <section className={`chart pie ${className}`}>
        {x?.length !== 0 ? (
          toggleView ? (
            <Pie data={data} height="300px" width="300px" options={{ maintainAspectRatio: false }} />
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

export default UIPieChart;
