import chalk from "chalk";
import dedent from "dedent-js";

const printError = (error) => {
    console.log(`${chalk.bgRed(" ERROR ")} ${error}`);
};

const printSuccess = (message) => {
    console.log(`${chalk.bgGreen(" SUCCESS ")} ${message}`);
};

const printHelp = () => {
    console.log(dedent`${chalk.bgYellow(" HELP ")}
    Без параметров - вывод погоды
    -s [CITY] для уточнения города
    -h для вывода помощи
    -t [API_KEY] для сохранения токена
    `);
};

const printWeather = (res, icon) => {
    console.log(dedent`${chalk.bgBlueBright(" WEATHER ")} Погода в городе ${
        res.name
    } (GMT+${res.timezone / 3600})
    ${icon}  ${res.weather[0].description}
    Температура: ${res.main.temp}°C (ощущается как: ${res.main.feels_like}°C)
    Влажность: ${res.main.humidity}%
    Давление: ${res.main.pressure}
    Скорость ветра: ${res?.wind?.speed}м/с
    `);
};

export { printError, printSuccess, printHelp, printWeather };
