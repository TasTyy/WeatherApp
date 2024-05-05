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

interface WeatherChartProps {
    time: Date[];
    temperature2m: number[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({ time, temperature2m }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                },
            },
        },
    };

    const data = {
        labels: time.map((date: Date) => date.toLocaleString()),
        datasets: [
            {
                label: "Temperature",
                data: temperature2m,
                borderColor: "rgb(1, 50, 58)",
                backgroundColor: "rgb(6, 182, 212)",
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default WeatherChart;
