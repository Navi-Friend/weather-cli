import { getKeyValue } from "./storage.service.js";
import axios from "axios";

const getToken = async () => {
    const token = process.env.TOKEN ?? (await getKeyValue("token"));
    if (!token.length) {
        throw new Error(
            "Токен не задан. Задайте его через команду -t [API_KEY]"
        );
    }
    return token;
};

export const getIcon = (icon) => {
    const weatherIcons = {
        '01': '☀️',  // clear sky (day)
        '01': '🌙',  // clear sky (night)
        '02': '🌤️',  // few clouds (day)
        '02': '🌥️',  // few clouds (night)
        '03': '☁️',  // scattered clouds
        '04': '☁️',  // broken clouds
        '09': '🌧️',  // shower rain
        '10': '🌦️',  // rain (day)
        '10': '🌧️',  // rain (night)
        '11': '🌩️',  // thunderstorm
        '13': '❄️',  // snow
        '50': '🌫️'   // mist
    };
    return weatherIcons[icon.slice(0, -1)]
}

export const getWeather = async (city) => {
    const token = await getToken();
    const [lat, lon] = await getLatLon(city);
    const weather = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
            params: {
                lat,
                lon,
                appid: token,
                lang: "ru",
                units: "metric",
            },
        }
    );
    return weather.data;
};

const getLatLon = async (city) => {
    const token = await getToken();
    const { data } = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        { params: { q: city, limit: 1, appid: token } }
    );

    return [data[0].lat, data[0].lon];
};

// const handleAxiosError = (error) => {
//     if (error.response) {
//         // Запрос был сделан, и сервер ответил кодом состояния, который
//         // выходит за пределы 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//     } else if (error.request) {
//         // Запрос был сделан, но ответ не получен
//         // `error.request`- это экземпляр XMLHttpRequest в браузере и экземпляр
//         // http.ClientRequest в node.js
//         console.log(error.request);
//     } else {
//         // Произошло что-то при настройке запроса, вызвавшее ошибку
//         console.log("Error", error.message);
//     }
// };
