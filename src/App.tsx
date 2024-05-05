import { useEffect, useState } from "react";

import { Card } from "primereact/card";

import CitySearch from "./components/CitySearch";
import WeatherChart from "./components/WeatherChart";
import { fetchWeatherByCoordinates, WeatherData } from "./utils/weatherUtils";

function App() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>("");

    useEffect(() => {
        fetchWeatherByLocation();
    }, []);

    const fetchWeatherByLocation = async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const weatherData = await fetchWeatherByCoordinates(
                        latitude,
                        longitude
                    );
                    setCity(await fetchCityName(latitude, longitude));
                    setWeatherData(weatherData);
                    // Optionally, set city based on reverse geocoding using latitude and longitude
                },
                (error) => {
                    console.error("Error fetching user location:", error);
                }
            );
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const fetchCityName = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            return data.display_name;
        } catch (error) {
            console.error("Error fetching city name:", error);
            return "Unknown City";
        }
    };

    const handleSearch = (data: WeatherData, cityName: string) => {
        setWeatherData(data);
        setCity(cityName);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Weather app</h1>
            <CitySearch onSearch={handleSearch} />
            {weatherData && (
                <Card title={`${city}`} subTitle="Temperature graph">
                    <WeatherChart
                        time={weatherData.time}
                        temperature2m={weatherData.temperature2m}
                    />
                </Card>
            )}
        </div>
    );
}

export default App;
