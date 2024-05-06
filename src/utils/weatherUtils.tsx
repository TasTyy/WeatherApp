import { fetchWeatherApi } from "openmeteo";

export interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

export interface WeatherCodeData {
    time: Date[];
    weatherCode: number[];
    apparentTemperatureMax: number[];
    apparentTemperatureMin: number[];
}

export const fetchWeatherCodeData = async (
    latitude: number,
    longitude: number,
    pastDays: number,
    forecastDays: number
): Promise<WeatherCodeData> => {
    const params = {
        latitude,
        longitude,
        daily: [
            "weather_code",
            "apparent_temperature_max",
            "apparent_temperature_min",
        ],
        past_days: pastDays,
        forecast_days: forecastDays,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const daily = response.daily();

    const weatherData: WeatherCodeData = {
        time: range(
            Number(daily.time()),
            Number(daily.timeEnd()),
            daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        weatherCode: daily.variables(0)!.valuesArray()!,
        apparentTemperatureMax: daily.variables(1)!.valuesArray()!,
        apparentTemperatureMin: daily.variables(2)!.valuesArray()!,
    };

    return weatherData;
};

export const fetchWeatherByCoordinates = async (
    latitude: number,
    longitude: number
): Promise<WeatherData> => {
    const params = {
        latitude,
        longitude,
        hourly: "temperature_2m",
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
                    new Date((t + response.utcOffsetSeconds()) * 1000)
            ),
            temperature2m: temperature2m,
        };
        return weatherData;
    } else {
        throw new Error("Failed to fetch weather data");
    }
};

export const fetchCityCoordinates = async (city: string) => {
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
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
