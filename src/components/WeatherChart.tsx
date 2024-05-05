import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Temperature Data",
        },
    },
};

interface WeatherChartProps {
    time: Date[];
    temperature2m: number[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ time, temperature2m }) => {
    const data = {
        labels: time.map((date: Date) => date.toLocaleString()),
        datasets: [
            {
                label: "Temperature",
                data: temperature2m,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default WeatherChart;
