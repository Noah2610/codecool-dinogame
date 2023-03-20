export const WIDTH = 800;
export const HEIGHT = 320;
export const GRAVITY = 1;
export const JUMP_STRENGTH = -20;
export const JUMP_STOP_VELOCITY = -4;
export const DINO_SIZE = { width: 64, height: 118 };
export const OBSTACLE_SIZE = { width: 64, height: 81 };
export const ANIMATION_INTERVAL_MS = 250;

export const ANIMATIONS = {
    run: ["assets/rabbit-sit.png", "assets/rabbit-stand.png"],
    jump: ["assets/rabbit-jump.png"],
    obstacle: ["assets/egg-0.png", "assets/egg-1.png"],
};

export const CONTROLS = {
    jump: [" ", "w", "arrowup"],
    pause: ["p", "escape"],
    reset: ["r"],
};
