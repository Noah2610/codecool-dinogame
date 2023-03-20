import {
    ANIMATIONS,
    CONTROLS,
    JUMP_STRENGTH,
    JUMP_STOP_VELOCITY,
} from "./settings.js";
import { clearMessage } from "./util.js";
import { setAnimation } from "./animation.js";
import { startGame, resumeGame, pauseGame, resetGame } from "./game.js";

const eventListeners = [];

export function setupControls() {
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
