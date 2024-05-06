import { useState } from "react";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

import { fetchWeatherByCoordinates, WeatherData } from "../utils/weatherUtils";

interface CitySearchProps {
    onSearch: (weatherData: WeatherData, cityName: string) => void;
}

function CitySearch({ onSearch }: CitySearchProps) {
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = async () => {
        try {
            setErrorMessage("");
            const coordinates = await fetchCityCoordinates(city);

            const weatherData = await fetchWeatherByCoordinates(
                coordinates.latitude,
                coordinates.longitude
            );
            onSearch(weatherData, city);
        } catch (error) {
            setErrorMessage("Insert correct city name");
        }
        setCity("");
    };

    const fetchCityCoordinates = async (city: string) => {
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
