import { WIDTH, HEIGHT, ANIMATIONS, OBSTACLE_SIZE } from "./settings.js";
import { setElementPosition, randomInRange } from "./util.js";
import { addEntity } from "./game.js";

export const OBSTACLES_EL = document.querySelector("#obstacles");
const OBSTACLE_SPAWN_INTERVAL_MS_RANGE = [500, 2000];

let obstacleSpawnTimeout = null;

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
