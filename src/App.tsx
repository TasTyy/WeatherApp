import { useEffect, useState } from "react";
import CitySearch from "./components/CitySearch";
import WeatherChart from "./components/WeatherChart";
import { fetchWeatherApi } from "openmeteo";

import { Card } from "primereact/card";

interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

function App() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    useEffect(() => {
        fetchWeatherByLocation();
    });

    const fetchWeatherByLocation = async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const cityName = await fetchCityName(latitude, longitude);

                    const params = {
                        latitude,
                        longitude,
                        hourly: "temperature_2m",
                        past_days: 2,
                    };
                    const url = "https://api.open-meteo.com/v1/forecast";
                    const responses = await fetchWeatherApi(url, params);
                    const response = responses[0];
                    const hourly = response?.hourly();
                    if (hourly) {
                        const temperature2m: number[] = Array.from(
                            hourly.variables(0)?.valuesArray() ?? []
                        );
                        const weatherData: WeatherData = {
                            time: range(
                                Number(hourly.time()),
                                Number(hourly.timeEnd()),
                                hourly.interval()
                            ).map(
                                (t: number) =>
                                    new Date(
                                        (t + response.utcOffsetSeconds()) * 1000
                                    )
                            ),
                            temperature2m: temperature2m,
                        };
                        setWeatherData(weatherData);
                        setCity(cityName);
                        setLoading(false); // Set loading to false when data is fetched
                    }
                },
                (error) => {
                    console.error("Error fetching user location:", error);
                    setLoading(false); // Set loading to false if there's an error
                }
            );
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setLoading(false); // Set loading to false if there's an error
        }
    };

    const fetchCityName = async (latitude: number, longitude: number) => {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        return data.display_name;
    };

    const range = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
        );

    const handleSearch = (data: WeatherData, cityName: string) => {
        setWeatherData(data);
        setCity(cityName);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Weather app</h1>
            <CitySearch onSearch={handleSearch} />
            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    Loading...
                </div>
            ) : (
                weatherData && (
                    <Card title="Graph is showing temperatures for the past 2 days current day and forecast for next 4 days">
                        <h3></h3>
                        <WeatherChart
                            city={city}
                            time={weatherData.time}
                            temperature2m={weatherData.temperature2m}
                        />
                    </Card>
                )
            )}
        </div>
    );
}

export default App;
