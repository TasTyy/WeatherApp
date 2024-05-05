import { useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message"; // Step 1
import "primeicons/primeicons.css";

interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

interface CitySearchProps {
    onSearch: (weatherData: WeatherData, cityName: string) => void;
}

function CitySearch({ onSearch }: CitySearchProps) {
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async () => {
        try {
            // Fetch latitude and longitude for the entered city using a geocoding service
            setErrorMessage("");
            const coordinates = await fetchCoordinates(city);

            // Fetch weather data using the obtained coordinates
            const params = {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                hourly: "temperature_2m",
            };
            const url = "https://api.open-meteo.com/v1/forecast";
            const responses = await fetchWeatherApi(url, params);
            const response = responses[0];
            const hourly = response?.hourly();
            if (hourly) {
                // Convert Float32Array to regular array
                const temperature2m: number[] = Array.from(
                    hourly.variables(0)?.valuesArray() ?? []
                );
                // Extract required weather data
                const weatherData: WeatherData = {
                    time: range(
                        Number(hourly.time()),
                        Number(hourly.timeEnd()),
                        hourly.interval()
                    ).map(
                        (t: number) =>
                            new Date((t + response.utcOffsetSeconds()) * 1000)
                    ),
                    temperature2m: temperature2m,
                };
                onSearch(weatherData, city);
            }
        } catch (error) {
            setErrorMessage("Insert correct city name");
        }
        setCity("");
    };

    // Function to fetch latitude and longitude for the entered city
    const fetchCoordinates = async (city: string) => {
        // Geocoding service API to fetch coordinates for the city
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
        );
        const data = await response.json();
        if (data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        } else {
            throw new Error("City not found");
        }
    };

    const range = (start: number, stop: number, step: number) =>
        Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
        );

    return (
        <div>
            <div className="p-inputgroup p-mb-4">
                <InputText
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <Button
                    label="Search"
                    icon="pi pi-search"
                    onClick={handleSearch}
                />
            </div>
            {errorMessage && <Message severity="error" text={errorMessage} />}
        </div>
    );
}

export default CitySearch;
