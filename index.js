const WIDTH = 800;
const HEIGHT = 256;
const GRAVITY = 1;
const JUMP_STRENGTH = -20;
const JUMP_STOP_VELOCITY = -4;

const CONTROLS = {
    jump: [" ", "w", "arrowup"],
};

const DINO_EL = document.querySelector("#dino");

const dino = {
    x: 0,
    y: 0,
    width: 32,
    height: 64,
    yVelocity: 0,
    isOnGround: false,
    isJumping: false,
};
const obstacles = [];

function main() {
    setupControls();
    nextUpdate();
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
    DINO_EL.style.top = `${dino.y}px`;
}

main();
