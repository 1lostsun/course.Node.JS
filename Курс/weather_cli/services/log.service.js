import chalk from "chalk";
import dedent from "dedent-js"


const printError = (error) => {
    console.log(chalk.bgRed(' ERROR ') + ' ' + error);
};

const printSuccess = (message) => {
    console.log(chalk.bgGreen(' SUCCESS ') + ' ' + message);
};

const printHelp = () => {
    console.log(
        dedent` ${chalk.bgCyan(' HELP ')}
        Без параметров - вывод погоды
        -s [CITY] - Для установки города
        -h - Для вывода помощи
        -t [API_KEY] - Для сохранения токена
        `
    )
};

const printWeather = (res) => {
    console.log(
        dedent` ${chalk.bgYellow(' Weather ')} Погода в городе ${res.name}
        ${res.weather[0].description}
        Температура: ${res.main.temp}
        Ощущается как: ${res.main.feels_like}
        Влажность: ${res.main.humidity}%
        Скорость ветра: ${res.wind.speed}
        `
    )
};

export { printError, printSuccess, printHelp, printWeather };