import {
    DINO_SIZE,
    WIDTH,
    HEIGHT,
    ANIMATIONS,
    OBSTACLE_SIZE,
    OBSTACLE_SPAWN_INTERVAL_MS_RANGE,
    CONTROLS,
    JUMP_STRENGTH,
    JUMP_STOP_VELOCITY,
} from "./settings.js";
import {
    clearMessage,
    setElementPosition,
    setMessage,
    randomInRange,
} from "./util.js";
import { startAnimations, stopAnimations, setAnimation } from "./animation.js";
import {
    startUpdateLoop,
    stopUpdateLoop,
    renderScore,
    clearHighscoreMessage,
    handleHighscore,
} from "./update.js";

const eventListeners = [];

const OBSTACLES_EL = document.querySelector("#obstacles");

let obstacleSpawnTimeout = null;

const DINO_EL = document.querySelector("#dino");

function main() {
    resetGame();
    // startGame();
}

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

export function startSpawningObstacles() {
    stopSpawningObstacles();
    const setSpawnTimeout = () => {
        obstacleSpawnTimeout = setTimeout(() => {
            spawnObstacle();
            setSpawnTimeout();
        }, getRandomObstacleSpawnDelay());
    };
    setSpawnTimeout();
}

export function stopSpawningObstacles() {
    if (obstacleSpawnTimeout !== null) {
        clearTimeout(obstacleSpawnTimeout);
        obstacleSpawnTimeout = null;
    }
}

function spawnObstacle() {
    if (!window.game.isRunning) {
        return;
    }

    const element = document.createElement("div");
    element.classList.add("obstacle");

    const img = document.createElement("img");
    img.setAttribute("src", ANIMATIONS.obstacle[0]);
    element.appendChild(img);

    const obstacle = {
        element,
        x: WIDTH + OBSTACLE_SIZE.width,
        y: HEIGHT - OBSTACLE_SIZE.height,
        width: OBSTACLE_SIZE.width,
        height: OBSTACLE_SIZE.height,
        didScore: false,
        animation: {
            frame: 0,
            images: ANIMATIONS.obstacle,
        },
    };

    setElementPosition(element, obstacle);

    addEntity(obstacle);
    window.game.obstacles.push(obstacle);
    OBSTACLES_EL.appendChild(element);
}

function getRandomObstacleSpawnDelay() {
    return randomInRange(
        OBSTACLE_SPAWN_INTERVAL_MS_RANGE[0],
        OBSTACLE_SPAWN_INTERVAL_MS_RANGE[1],
    );
}

function setupControls() {
    cleanupEventListeners();

    const keyDown = (e) => !e.repeat && onKeyDown(e.key.toLowerCase());
    const keyUp = (e) => onKeyUp(e.key.toLowerCase());

    document.addEventListener("keydown", keyDown);
    eventListeners.push([document, "keydown", keyDown]);
    document.addEventListener("keyup", keyUp);
    eventListeners.push([document, "keyup", keyUp]);

    const startGameInitially = (e) => {
        if (getActionForKey(e.key.toLowerCase()) !== "jump") {
            return;
        }

        clearMessage();
        startGame();
        document.removeEventListener("keydown", startGameInitially);
    };
    document.addEventListener("keydown", startGameInitially);
    eventListeners.push([document, "keydown", startGameInitially]);

    const windowOnBlur = () => {
        if (window.game.isGameOver) return;
        pauseGame();
    };
    const windowOnFocus = () => {
        // if (window.game.isGameOver) return;
        // resumeGame();
    };

    window.addEventListener("blur", windowOnBlur);
    eventListeners.push([window, "blur", windowOnBlur]);
    window.addEventListener("focus", windowOnFocus);
    eventListeners.push([window, "focus", windowOnFocus]);
}

function cleanupEventListeners() {
    let listener;
    while ((listener = eventListeners.pop())) {
        listener[0].removeEventListener(listener[1], listener[2]);
    }
}

function onKeyDown(key) {
    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            if (!window.game.isRunning) return;
            startJump();
            break;
        case "pause":
            togglePause();
            break;
        case "reset":
            resetGame();
            break;
    }
}

function onKeyUp(key) {
    if (!window.game.isRunning) return;

    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            stopJump();
            break;
    }
}

function togglePause() {
    if (window.game.isRunning) {
        pauseGame();
    } else {
        resumeGame();
    }
}

function getActionForKey(key) {
    for (const action of Object.keys(CONTROLS)) {
        if (CONTROLS[action].includes(key)) {
            return action;
        }
    }
}

function startJump() {
    if (!window.game.dino.isOnGround || window.game.dino.isJumping) return;

    window.game.dino.yVelocity = JUMP_STRENGTH;
    window.game.dino.isJumping = true;
    window.game.dino.isOnGround = false;
    window.game.dino.element.classList.add("in-air");

    setAnimation(window.game.dino, ANIMATIONS.jump);
}

function stopJump() {
    if (!window.game.dino.isJumping) return;

    window.game.dino.yVelocity = Math.max(
        JUMP_STOP_VELOCITY,
        window.game.dino.yVelocity,
    );
    window.game.dino.isJumping = false;
}

main();
