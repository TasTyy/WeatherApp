import { fetchWeatherApi } from "openmeteo";

export interface WeatherData {
    time: Date[];
    temperature2m: number[];
}

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

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
