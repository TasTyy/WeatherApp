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
                    // Format the date as "day Month" (e.g., "5 May")
                    date: formatDate(date),
                    weatherCode: weatherCodeData.weatherCode[index],
                    apparentTemperatureMax:
                        weatherCodeData.apparentTemperatureMax[index].toFixed(
                            0
                        ),
                    apparentTemperatureMin:
                        weatherCodeData.apparentTemperatureMin[index].toFixed(
                            0
                        ),
                }));

                setWeatherData({ days: weatherDays });
            } catch (error) {
                console.error("Error fetching weather code data:", error);
            }
        };

        fetchData();
    }, [city]);

    // Function to format date as "day Month" (e.g., "5 May")
    const formatDate = (date: Date): string => {
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        return `${day} ${month}`;
    };

    // Function to map weather interpretation codes to Material Icons
    const getWeatherIcon = (weatherCode: number): string => {
        switch (weatherCode) {
            case 0:
                return "sunny"; // Clear sky
            case 1:
            case 2:
            case 3:
                return "cloud"; // Mainly clear, partly cloudy, overcast
            case 45:
            case 48:
                return "cloud"; // Fog and depositing rime fog
            case 51:
            case 53:
            case 55:
                return "grain"; // Drizzle: Light, moderate, dense intensity
            case 56:
            case 57:
                return "grain"; // Freezing Drizzle: Light and dense intensity
            case 61:
            case 63:
            case 65:
                return "umbrella"; // Rain: Slight, moderate and heavy intensity
            case 66:
            case 67:
                return "umbrella"; // Freezing Rain: Light and heavy intensity
            case 71:
            case 73:
            case 75:
                return "weather_snowy"; // Snow fall: Slight, moderate, and heavy intensity
            case 77:
                return "weather_snowy"; // Snow grains
            case 80:
            case 81:
            case 82:
                return "umbrella"; // Rain showers: Slight, moderate, and violent
            case 85:
            case 86:
                return "weather_snowy"; // Snow showers slight and heavy
            case 95:
                return "thunderstorm"; // Thunderstorm: Slight or moderate
            case 96:
            case 99:
                return "thunderstorm"; // Thunderstorm with slight and heavy hail
            default:
                return "help"; // Default icon for unknown weather codes
        }
    };

    return (
        <div>
            {weatherData && (
                <div className="weather-code-div">
                    {weatherData.days.map((day, index) => (
                        <div key={index} className="weather-card">
                            <h2>{day.date}</h2>
                            <p>
                                <i className="material-icons">
                                    {getWeatherIcon(day.weatherCode)}
                                </i>
                            </p>
                            <p className="max-temp">
                                {day.apparentTemperatureMax}°C
                            </p>
                            <p className="min-temp">
                                {day.apparentTemperatureMin}°C
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WeatherCode;
