#!/usr/bin/env node

import { getArgs } from "./helpers/args.js";
import { getIcon, getWeather } from "./services/api.service.js";
import {
    printHelp,
    printSuccess,
    printError,
    printWeather,
} from "./services/log.service.js";
import { getKeyValue, saveKeyValue } from "./services/storage.service.js";

const initCLI = async () => {
    const args = getArgs(process.argv);
    if (args.h) {
        return printHelp();
    }
    if (args.s) {
        return saveCity(args.s);
    }
    if (args.t) {
        return saveToken(args.t);
    }
    return handleGetWeather();
};

const saveToken = async (token) => {
    if (!token.length) {
        return printError("Токен не передан");
    }
    try {
        await saveKeyValue("token", token);
        printSuccess("Токен сохранен");
    } catch (e) {
        printError(e.message);
    }
};

const saveCity = async (city) => {
    if (!city.length) {
        return printError("Город не передан");
    }
    try {
        await saveKeyValue("city", city);
        printSuccess("Город сохранен");
    } catch (e) {
        printError(e.message);
    }
};

const handleGetWeather = async () => {
    try {
        const city = await getKeyValue("city");
        const weather = await getWeather(city);
        printWeather(weather, getIcon(weather.weather[0].icon));
    } catch (error) {
        if (
            error?.response?.status == 404 ||
            error?.response?.status == 400 ||
            error.message.includes(
                "Cannot read properties of undefined (reading 'lat')"
            )
        ) {
            printError("Неверно указан город");
        } else if (error?.response?.status == 401) {
            printError("Неверно указан токен");
        } else {
            printError(error.message);
        }
    }
};

initCLI();
