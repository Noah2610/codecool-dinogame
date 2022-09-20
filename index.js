const WIDTH = 800;
const HEIGHT = 256;
const GRAVITY = 1;
const JUMP_STRENGTH = -20;
const JUMP_STOP_VELOCITY = -4;
const OBSTACLE_SIZE = { width: 32, height: 64 };

const CONTROLS = {
    jump: [" ", "w", "arrowup"],
    pause: ["p", "escape"],
    reset: ["r"],
};

const DINO_EL = document.querySelector("#dino");
const OBSTACLES_EL = document.querySelector("#obstacles");
const MESSAGE_EL = document.querySelector("#message");
const SCORE_EL = document.querySelector("#score");

let game;
let dino;

const OBSTACLE_SPAWN_INTERVAL_MS = 1000;
let obstacleSpawnInterval = null;

function createDinoState() {
    return {
        x: 64,
        y: HEIGHT - 64,
        width: 32,
        height: 64,
        yVelocity: 0,
        isOnGround: false,
        isJumping: false,
        element: DINO_EL,
    };
}

function createGameState() {
    return {
        isRunning: false,
        isGameOver: false,
        speed: 10,
        obstacles: [],
        score: 0,
    };
}

function main() {
    resetGame();
    setupControls();
    // startGame();
}

function startGame() {
    if (game.isGameOver || game.isRunning) return;

    game.isRunning = true;
    clearMessage();
    startSpawningObstacles();
    nextUpdate();
}

function stopGame() {
    if (!game.isRunning) return;

    game.isRunning = false;
    stopSpawningObstacles();
}

function resumeGame() {
    startGame();
}

function pauseGame() {
    stopGame();
    setMessage("PAUSED press P to resume");
}

function resetGame() {
    game = createGameState();
    dino = createDinoState();
    setElementPosition(dino.element, dino);
    OBSTACLES_EL.innerHTML = "";
    setMessage("Press SPACE to start!");
    setupControls();
    renderScore(game.score);
}

function gameOver() {
    stopGame();
    game.isGameOver = true;
    setMessage("GAME OVER press R to reset");
}

function startSpawningObstacles() {
    stopSpawningObstacles();
    obstacleSpawnInterval = setInterval(
        spawnObstacle,
        OBSTACLE_SPAWN_INTERVAL_MS,
    );
}

function stopSpawningObstacles() {
    if (obstacleSpawnInterval !== null) {
        clearInterval(obstacleSpawnInterval);
        obstacleSpawnInterval = null;
    }
}

let eventListeners = [];
function setupControls() {
    cleanupEventListeners();

    const keyDown = (e) =>
        !e.repeat && onKeyDown(e.key.toLowerCase());
    const keyUp = (e) => onKeyUp(e.key.toLowerCase());

    document.addEventListener("keydown", keyDown);
    eventListeners.push([document, "keydown", keyDown]);
    document.addEventListener("keyup", keyUp);
    eventListeners.push([document, "keyup", keyUp]);

    const startGameInitially = (e) => {
        if (
            getActionForKey(e.key.toLowerCase()) !== "jump"
        ) {
            return;
        }

        clearMessage();
        startGame();
        document.removeEventListener(
            "keydown",
            startGameInitially,
        );
    };
    document.addEventListener(
        "keydown",
        startGameInitially,
    );
    eventListeners.push([
        document,
        "keydown",
        startGameInitially,
    ]);

    const windowOnBlur = () => {
        if (game.isGameOver) return;
        pauseGame();
    };
    const windowOnFocus = () => {
        // if (game.isGameOver) return;
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
        listener[0].removeEventListener(
            listener[1],
            listener[2],
        );
    }
}

function onKeyDown(key) {
    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            if (!game.isRunning) return;
            jump();
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
    if (!game.isRunning) return;

    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            stopJump();
            break;
    }
}

function togglePause() {
    if (game.isRunning) {
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

function jump() {
    if (!dino.isOnGround || dino.isJumping) return;

    dino.yVelocity = JUMP_STRENGTH;
    dino.isJumping = true;
    dino.isOnGround = false;
}

function stopJump() {
    if (!dino.isJumping) return;

    dino.yVelocity = Math.max(
        JUMP_STOP_VELOCITY,
        dino.yVelocity,
    );
    dino.isJumping = false;
}

function update() {
    if (!game.isRunning) {
        return;
    }

    handleGravity();
    moveDino();
    moveObstacles();
    handleCollision();
    handleScore();

    drawDino();

    nextUpdate();
}

function nextUpdate() {
    window.requestAnimationFrame(update);
}

function handleGravity() {
    if (dino.isOnGround) {
        dino.yVelocity = 0;
        return;
    }

    dino.yVelocity += GRAVITY;
}

function moveDino() {
    const yBottom = dino.y + dino.height;
    let y = dino.y;
    y += dino.yVelocity;

    if (dino.yVelocity > 0 && yBottom >= HEIGHT) {
        y = HEIGHT - dino.height;
        dino.isOnGround = true;
    }

    dino.y = y;
}

function drawDino() {
    setElementPosition(dino.element, dino);
}

function spawnObstacle() {
    if (!game.isRunning) {
        return;
    }

    const element = document.createElement("div");
    element.classList.add("obstacle");

    const obstacle = {
        element,
        x: WIDTH + OBSTACLE_SIZE.width,
        y: HEIGHT - OBSTACLE_SIZE.height,
        width: OBSTACLE_SIZE.width,
        height: OBSTACLE_SIZE.height,
        didScore: false,
    };

    setElementPosition(element, obstacle);

    game.obstacles.push(obstacle);
    OBSTACLES_EL.appendChild(element);
}

function despawnObstacle(obstacleIndex) {
    game.obstacles[obstacleIndex].element.remove();
    game.obstacles.splice(obstacleIndex, 1);
}

function moveObstacles() {
    for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obstacle = game.obstacles[i];
        obstacle.x -= game.speed;
        if (obstacle.x < -obstacle.width) {
            despawnObstacle(i);
            continue;
        }

        setElementPosition(obstacle.element, obstacle);
    }
}

function handleCollision() {
    for (const obstacle of game.obstacles) {
        if (doEntitiesCollide(dino, obstacle)) {
            gameOver();
            return;
        }
    }
}

function handleScore() {
    for (const obstacle of game.obstacles) {
        if (
            !obstacle.didScore &&
            obstacle.x + obstacle.width < dino.x
        ) {
            obstacle.didScore = true;
            renderScore(++game.score);
        }
    }
}

function renderScore(score) {
    SCORE_EL.innerText = score;
}

function setElementPosition(element, { x, y }) {
    if (typeof x === "number") {
        element.style.left = `${x}px`;
    }
    if (typeof y === "number") {
        element.style.top = `${y}px`;
    }
}

function doEntitiesCollide(entityA, entityB) {
    const aLef = entityA.x;
    const aRig = entityA.x + entityA.width;
    const aTop = entityA.y;
    const aBot = entityA.y + entityA.height;
    const bLef = entityB.x;
    const bRig = entityB.x + entityB.width;
    const bTop = entityB.y;
    const bBot = entityB.y + entityB.height;

    // prettier-ignore
    return (
        ((aLef >= bLef && aLef < bRig) || (aLef <= bLef && aRig > bLef)) &&
        ((aTop >= bTop && aTop < bBot) || (aTop <= bTop && aBot > bTop))
    );
}

function setMessage(msg) {
    MESSAGE_EL.innerText = msg;
}

function clearMessage() {
    MESSAGE_EL.innerText = "";
}

main();
