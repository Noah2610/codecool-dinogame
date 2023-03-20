const MESSAGE_EL = document.querySelector("#message");

export function setElementPosition(element, { x, y }) {
    if (typeof x === "number") {
        element.style.left = `${x}px`;
    }
    if (typeof y === "number") {
        element.style.top = `${y}px`;
    }
}

export function setMessage(msg) {
    MESSAGE_EL.innerText = msg;
}

export function clearMessage() {
    MESSAGE_EL.innerText = "";
}

export function randomInRange(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

export function doEntitiesCollide(entityA, entityB) {
    const aLef = entityA.x;
    const aRig = entityA.x + entityA.width;
    const aTop = entityA.y;
    const aBot = entityA.y + entityA.height;
    const bLef = entityB.x;
    const bRig = entityB.x + entityB.width;
    const bTop = entityB.y;
    const bBot = entityB.y + entityB.height;

    return aLef <= bRig && aRig >= bLef && aTop <= bBot && aBot >= bTop;
}
