import { ANIMATIONS, HEIGHT, GRAVITY } from "./settings.js";
import { setAnimation } from "./animation.js";
import { setElementPosition, doEntitiesCollide } from "./util.js";
import { gameOver } from "./game.js";
import { renderScore } from "./highscore.js";

const UPDATE_INTERVAL_MS = 1000 / 60;
let updateInterval = null;

export function startUpdateLoop() {
    stopUpdateLoop();
    updateInterval = setInterval(update, UPDATE_INTERVAL_MS);
}

export function stopUpdateLoop() {
    if (updateInterval !== null) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function update() {
    if (!window.game.isRunning) {
        return;
    }

    handleGravity();
    moveDino();
    moveObstacles();
    handleCollision();
    handleScore();

    drawDino();
}

function handleGravity() {
    if (window.game.dino.isOnGround) {
        window.game.dino.yVelocity = 0;
        return;
    }

    window.game.dino.yVelocity += GRAVITY;
}

function moveDino() {
    const yBottom = window.game.dino.y + window.game.dino.height;
    let y = window.game.dino.y;
    y += window.game.dino.yVelocity;

    if (
        window.game.dino.yVelocity > 0 &&
        yBottom >= HEIGHT &&
        !window.game.dino.isOnGround
    ) {
        y = HEIGHT - window.game.dino.height;
        onHitGround(window.game.dino);
    }

    window.game.dino.y = y;
}

function onHitGround(dino) {
    dino.isOnGround = true;
    dino.element.classList.remove("in-air");
    setAnimation(dino, ANIMATIONS.run);
}

function drawDino() {
    setElementPosition(window.game.dino.element, window.game.dino);
}

function despawnObstacle(obstacleIndex) {
    window.game.obstacles[obstacleIndex].element.remove();
    window.game.obstacles.splice(obstacleIndex, 1);
}

function moveObstacles() {
    for (let i = window.game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = window.game.obstacles[i];
        obstacle.x -= window.game.speed;
        if (obstacle.x < -obstacle.width) {
            despawnObstacle(i);
            continue;
        }

        setElementPosition(obstacle.element, obstacle);
    }
}

function handleCollision() {
    for (const obstacle of window.game.obstacles) {
        if (doEntitiesCollide(window.game.dino, obstacle)) {
            gameOver();
            return;
        }
    }
}

function handleScore() {
    for (const obstacle of window.game.obstacles) {
        if (
            !obstacle.didScore &&
            obstacle.x + obstacle.width < window.game.dino.x
        ) {
            obstacle.didScore = true;
            renderScore(++window.game.score);
        }
    }
}
