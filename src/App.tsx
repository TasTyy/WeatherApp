import { useState } from "react";
import CitySearch from "./components/CitySearch";
import WeatherChart from "./components/WeatherChart";

import "./App.css";
interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

function App() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [city, setCity] = useState<string>("");

    const handleSearch = (data: WeatherData, cityName: string) => {
        setWeatherData(data);
        setCity(cityName);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Weather app</h1>
            <CitySearch onSearch={handleSearch} />
            {weatherData && (
                <WeatherChart
                    city={city}
                    time={weatherData.time}
                    temperature2m={weatherData.temperature2m}
                />
            )}
        </div>
    );
}

export default App;
