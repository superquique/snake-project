import { Snake, Segment } from "./snake.js";
import { Edible } from "./edible.js";

const segmentWidth = 25;
const segmentHeight = 25;
const boardWidth = 600;
const boardHeight = 600;
let coordinateX = 5;
let coordinateY = Math.floor(boardHeight / 25 / 2);

const gameBoard = document.getElementById("game-board");
const boardHeader = document.getElementById("board-header");

gameBoard.style.width = boardWidth + "px";
gameBoard.style.height = boardHeight + "px";

boardHeader.style.width = boardWidth + "px";

const head = new Segment(coordinateX, coordinateY, segmentWidth, segmentHeight, "right", 0);
const snake = new Snake(head);

for (let i = 0; i<2; i++) {
    coordinateX--;

    let newSegment = new Segment(coordinateX, coordinateY, segmentWidth, segmentHeight, null, i+1);
    snake.addSegment(newSegment);
}

console.log(snake.getAllSegments());

const edible = new Edible(coordinateX + 15, coordinateY, segmentWidth, segmentHeight);

const interval = setInterval(() => {
    // Detect collisions with other segments
    let willCollideWithItself = false;

    const allSnakeSegments = snake.getAllSegments();

    for (let i = 1; i < allSnakeSegments.length; i++) {
        const currentSegment = allSnakeSegments[i];
        if (snake.willCollideWith(currentSegment.coordinateX, currentSegment.coordinateY)) {
            willCollideWithItself = true;
            break;
        }
    }

    // Detect collisions with itself
    if (willCollideWithItself) {
        clearInterval(interval);
    }
    // Detect collisions with board boundaries
    else if (snake.willCollideWithX(boardWidth/segmentWidth)) {
        clearInterval(interval);
    } else if (snake.willCollideWithX(-1)) {
        clearInterval(interval);
    } else if(snake.willCollideWithY(boardHeight/segmentHeight)) {
        clearInterval(interval);
    } else if (snake.willCollideWithY(-1)) {
        clearInterval(interval);
    } else {
        snake.advance();
    }

    // Detect collisions with edible
    if (snake.isCollidingWith(edible.coordinateX, edible.coordinateY)) {
        console.log("mmm yummy yummy");

        // Make snake grow one segment
        console.log(snake.getTail());
        const tail = snake.getTail();
        let newSegment = new Segment(tail.coordinateX, tail.coordinateY, segmentWidth, segmentHeight, null, snake.getAllSegments().length);
        snake.addSegment(newSegment);

        // Change edible position
        const newCoordinateX = Math.floor(Math.random() * boardWidth/segmentWidth);
        const newCoordinateY = Math.floor(Math.random() * boardHeight/segmentHeight);

        edible.setCoordinateX(newCoordinateX);
        edible.setCoordinateY(newCoordinateY);
        edible.updateUI();
    }

}, 200);

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        snake.turnRight();
    } else if (event.code === "ArrowLeft") {
        snake.turnLeft();
    } else if (event.code === "ArrowUp") {
        snake.turnUp();
    } else if (event.code === "ArrowDown") {
        snake.turnDown();
    }    
});