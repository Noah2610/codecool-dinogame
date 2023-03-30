export const WIDTH = 800;
export const HEIGHT = 320;
export const GRAVITY = 1;
export const JUMP_STRENGTH = -20;
export const JUMP_STOP_VELOCITY = -4;
export const DINO_SIZE = { width: 64, height: 118 };
export const OBSTACLE_SIZE = { width: 64, height: 81 };
export const UPDATE_INTERVAL_MS = 1000 / 60;
export const ANIMATION_INTERVAL_MS = 250;
export const LOCALSTORAGE_HIGHSCORE_KEY = "dino-highscore";
export const OBSTACLE_SPAWN_INTERVAL_MS_RANGE = [500, 2000];

const ASSETS_BASE_URL =
    "https://noah2610.github.io/cc-easter-challenge-assets/";

const asset = (path) => `${ASSETS_BASE_URL}/${path}`;

export const ANIMATIONS = {
    run: [asset("rabbit-sit.png"), asset("rabbit-stand.png")],
    jump: [asset("rabbit-jump.png")],
    obstacle: [asset("egg-0.png"), asset("egg-1.png")],
};

export const CONTROLS = {
    jump: [" ", "w", "arrowup"],
    pause: ["p", "escape"],
    reset: ["r"],
};
