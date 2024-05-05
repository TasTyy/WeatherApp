// App.tsx
import { useState } from "react";
import CitySearch from "./components/CitySearch";
import WeatherChart from "./components/WeatherChart";

interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

function App() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    const handleSearch = (data: WeatherData) => {
        setWeatherData(data);
        console.log(data);
    };

    return (
        <div className="flex items-center">
            <p className="text-lg align-middle">Weather App</p>
            <CitySearch onSearch={handleSearch} />
            {weatherData && (
                <WeatherChart
                    time={weatherData.time}
                    temperature2m={weatherData.temperature2m}
                />
            )}
        </div>
    );
}

export default App;
