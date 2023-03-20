import { DINO_SIZE, HEIGHT, ANIMATIONS } from "./settings.js";
import { setupControls } from "./controls.js";
import { clearMessage, setElementPosition, setMessage } from "./util.js";
import {
    renderScore,
    clearHighscoreMessage,
    handleHighscore,
} from "./highscore.js";
import {
    OBSTACLES_EL,
    startSpawningObstacles,
    stopSpawningObstacles,
} from "./obstacle.js";
import { startAnimations, stopAnimations } from "./animation.js";
import { startUpdateLoop, stopUpdateLoop } from "./update.js";

const DINO_EL = document.querySelector("#dino");

export function startGame() {
    if (window.game.isGameOver || window.game.isRunning) return;

    window.game.isRunning = true;
    clearMessage();
    startSpawningObstacles();
    startAnimations();
    startUpdateLoop();
}

export function stopGame() {
    if (!window.game.isRunning) return;

    window.game.isRunning = false;
    stopSpawningObstacles();
    stopAnimations();
    stopUpdateLoop();
}

export function resetGame() {
    window.game = createGameState();
    window.game.dino = createDinoState();
    addEntity(window.game.dino);
    setElementPosition(window.game.dino.element, window.game.dino);
    OBSTACLES_EL.innerHTML = "";
    setMessage("Press SPACE to start!");
    setupControls();
    renderScore(window.game.score);
    clearHighscoreMessage();
}

export function resumeGame() {
    startGame();
}

export function pauseGame() {
    stopGame();
    setMessage("PAUSED press P to resume");
}

export function gameOver() {
    stopGame();
    window.game.isGameOver = true;
    setMessage("GAME OVER press R to reset");
    handleHighscore();
}

export function addEntity(entity) {
    window.game.entities.push(entity);
}

function createGameState() {
    return {
        isRunning: false,
        isGameOver: false,
        speed: 10,
        obstacles: [],
        entities: [],
        score: 0,
    };
}

function createDinoState() {
    return {
        x: DINO_SIZE.width,
        y: HEIGHT - DINO_SIZE.height,
        width: DINO_SIZE.width,
        height: DINO_SIZE.height,
        yVelocity: 0,
        isOnGround: false,
        isJumping: false,
        animation: {
            frame: 0,
            images: ANIMATIONS.run,
        },
        element: DINO_EL,
    };
}
