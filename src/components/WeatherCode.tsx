import { useEffect, useState } from "react";

import {
    fetchWeatherCodeData,
    fetchCityCoordinates,
    WeatherCodeData,
} from "../utils/weatherUtils";

interface WeatherCodeProps {
    city: string;
}

const WeatherCode = ({ city }: WeatherCodeProps) => {
    const [weatherData, setWeatherData] = useState<WeatherCodeData | null>(
        null
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coordinates = await fetchCityCoordinates(city);

                const weatherCodeData = await fetchWeatherCodeData(
                    coordinates.latitude,
                    coordinates.longitude,
                    2,
                    3
                );

                // Process weather data to match the WeatherCodeData interface
                const weatherDays = weatherCodeData.time.map((date, index) => ({
                    date,
                    weatherCode: weatherCodeData.weatherCode[index],
                    apparentTemperatureMax:
                        weatherCodeData.apparentTemperatureMax[index],
                    apparentTemperatureMin:
                        weatherCodeData.apparentTemperatureMin[index],
                }));

                setWeatherData({ days: weatherDays });
            } catch (error) {
                console.error("Error fetching weather code data:", error);
            }
        };

        fetchData();
    }, [city]);

    return (
        <div>
            {weatherData && (
                <div className="weather-code-div">
                    {weatherData.days.map((day, index) => (
                        <div key={index} className="weather-card">
                            <h2>{day.date.toLocaleDateString()}</h2>
                            <p>Weather Code: {day.weatherCode}</p>
                            <p>
                                Max Temperature: {day.apparentTemperatureMax}°C
                            </p>
                            <p>
                                Min Temperature: {day.apparentTemperatureMin}°C
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherCode;
