let obj = {};

export default function train (velocity, diffX, diffY, birdHeight, score, gameover) {
    obj = {
        velocity: velocity,
        diffX: diffX,
        diffY: diffY,
        birdY: birdHeight,
        score: score,
        oldscore: 0,
        gameover: gameover,
    };
    return takeAction();
}

function takeAction() {
    return (Math.round(Math.random() * 100 ) % 40 === 0); // random jump
}