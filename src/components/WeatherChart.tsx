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
    city: string;
    time: Date[];
    temperature2m: number[];
}

const WeatherChart: React.FC<WeatherChartProps> = ({
    city,
    time,
    temperature2m,
}) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `Temperature data for ${city}`,
            },
        },
    };

    const data = {
        labels: time.map((date: Date) => date.toLocaleString()),
        datasets: [
            {
                label: "Temperature",
                data: temperature2m,
                backgroundColor: "rgb(6, 182, 212)",
            },
        ],
    };

    return <Line options={options} data={data} />;
};

export default WeatherChart;
