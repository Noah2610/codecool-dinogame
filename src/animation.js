const ANIMATION_INTERVAL_MS = 250;
let animationInterval = null;

export function startAnimations() {
    stopAnimations();
    animationInterval = setInterval(updateAnimations, ANIMATION_INTERVAL_MS);
}

export function stopAnimations() {
    if (animationInterval === null) return;
    clearInterval(animationInterval);
    animationInterval = null;
}

export function updateAnimations() {
    window.game.entities
        .filter((entity) => entity.animation)
        .forEach(updateAnimation);
}

export function updateAnimation(entity) {
    const imgEl = entity.element.querySelector("img");
    if (!imgEl) {
        console.error("Entity has animation but no image", entity);
        return;
    }

    const anim = entity.animation;
    entity.animation.frame = (anim.frame + 1) % anim.images.length;

    const image = anim.images[anim.frame];
    imgEl.src = image;
}

export function setAnimation(entity, images) {
    entity.animation = {
        frame: 0,
        images,
    };
    updateAnimation(entity);
}
