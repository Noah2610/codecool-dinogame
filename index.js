const WIDTH = 800;
const HEIGHT = 256;
const GRAVITY = 1;
const JUMP_STRENGTH = -20;
const JUMP_STOP_VELOCITY = -4;
const OBSTACLE_SIZE = { width: 32, height: 64 };

const CONTROLS = {
    jump: [" ", "w", "arrowup"],
};

const DINO_EL = document.querySelector("#dino");
const OBSTACLES_EL = document.querySelector("#obstacles");

const dino = {
    x: 64,
    y: 0,
    width: 32,
    height: 64,
    yVelocity: 0,
    isOnGround: false,
    isJumping: false,
    speed: 10,
};
const obstacles = [];

const OBSTACLE_SPAWN_INTERVAL_MS = 1000;
let obstacleSpawnInterval = null;

function main() {
    setupControls();
    setupObstacleSpawning();
    nextUpdate();
}

function setupObstacleSpawning() {
    obstacleSpawnInterval = setInterval(
        spawnObstacle,
        OBSTACLE_SPAWN_INTERVAL_MS,
    );
}

function setupControls() {
    document.addEventListener(
        "keydown",
        (e) => !e.repeat && onKeyDown(e.key.toLowerCase()),
    );
    document.addEventListener("keyup", (e) =>
        onKeyUp(e.key.toLowerCase()),
    );
}

function onKeyDown(key) {
    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            jump();
            break;
    }
}

function onKeyUp(key) {
    const action = getActionForKey(key);
    switch (action) {
        case "jump":
            stopJump();
            break;
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

    obstacles.push(obstacle);
    OBSTACLES_EL.appendChild(element);
}

function despawnObstacle(obstacleIndex) {
    obstacles[obstacleIndex].element.remove();
    obstacles.splice(obstacleIndex, 1);
}

function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= dino.speed;
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

main();
