import { useEffect, useState } from "react";

import { Card } from "primereact/card";

import CitySearch from "./components/CitySearch";
import WeatherChart from "./components/WeatherChart";
import WeatherCode from "./components/WeatherCode";
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
        <div className="main">
            <h1 style={{ textAlign: "center" }}>Weather app</h1>
            <CitySearch onSearch={handleSearch} />
            {weatherData && (
                <div className="inner-div">
                    <Card>
                        <WeatherCode city={city} />
                    </Card>

                    <Card title={`${city}`} subTitle="Temperature graph">
                        <WeatherChart
                            time={weatherData.time}
                            temperature2m={weatherData.temperature2m}
                        />
                    </Card>
                </div>
            )}
        </div>
    );
}

export default App;
