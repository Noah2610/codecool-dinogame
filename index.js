const WIDTH = 800;
const HEIGHT = 256;
const GRAVITY = 1;
const JUMP_STRENGTH = -20;
const JUMP_STOP_VELOCITY = -4;
const OBSTACLE_SIZE = { width: 32, height: 64 };

const CONTROLS = {
    jump: [" ", "w", "arrowup"],
    pause: ["p", "escape"],
};

const DINO_EL = document.querySelector("#dino");
const OBSTACLES_EL = document.querySelector("#obstacles");
const MESSAGE_EL = document.querySelector("#message");

const dino = {
    x: 64,
    y: 0,
    width: 32,
    height: 64,
    yVelocity: 0,
    isOnGround: false,
    isJumping: false,
};
const game = {
    isRunning: false,
    speed: 10,
    obstacles: [],
};

const OBSTACLE_SPAWN_INTERVAL_MS = 1000;
let obstacleSpawnInterval = null;

function main() {
    setupControls();
    // startGame();
}

function startGame() {
    if (game.isRunning) return;

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

function pauseGame() {
    stopGame();
    setMessage("PAUSED");
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

function setupControls() {
    document.addEventListener(
        "keydown",
        (e) => !e.repeat && onKeyDown(e.key.toLowerCase()),
    );
    document.addEventListener("keyup", (e) =>
        onKeyUp(e.key.toLowerCase()),
    );

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
    setMessage("Press SPACE to start!");
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
        startGame();
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
    setElementPosition(DINO_EL, dino);
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

function setElementPosition(element, { x, y }) {
    if (typeof x === "number") {
        element.style.left = `${x}px`;
    }
    if (typeof y === "number") {
        element.style.top = `${y}px`;
    }
}

function setMessage(msg) {
    MESSAGE_EL.innerText = msg;
}

function clearMessage() {
    MESSAGE_EL.innerText = "";
}

main();
