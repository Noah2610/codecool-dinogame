import { LOCALSTORAGE_HIGHSCORE_KEY } from "./settings.js";

const SCORE_EL = document.querySelector("#score");
const HIGHSCORE_MESSAGE_EL = document.querySelector("#highscore");

export function renderScore(score) {
    SCORE_EL.innerText = score;
}

export function handleHighscore() {
    const highscore = getHighscore();
    if (window.game.score > highscore) {
        saveHighscore(window.game.score);
        setHighscoreMessage("New Highscore!");
    } else {
        setHighscoreMessage(`Highscore: ${highscore}`);
    }
}

export function getHighscore() {
    const value = window.localStorage.getItem(LOCALSTORAGE_HIGHSCORE_KEY);
    if (value === null) {
        return 0;
    }

    const highscore = parseInt(value);
    return Number.isNaN(highscore) ? 0 : highscore;
}

export function saveHighscore(score) {
    window.localStorage.setItem(LOCALSTORAGE_HIGHSCORE_KEY, score.toString());
}

export function setHighscoreMessage(msg) {
    HIGHSCORE_MESSAGE_EL.innerText = msg;
    HIGHSCORE_MESSAGE_EL.classList.remove("hidden");
}

export function clearHighscoreMessage() {
    HIGHSCORE_MESSAGE_EL.classList.add("hidden");
}
