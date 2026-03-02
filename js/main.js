import { Snake, Segment } from "./snake.js";

let coordinateX = 5;
let coordinateY = 5;
const segmentWidth = 25;
const segmentHeight = 25;

const head = new Segment(coordinateX, coordinateY, segmentWidth, segmentHeight, "right", 0);
const snake = new Snake(head);

for (let i = 0; i<3; i++) {
    coordinateX--;

    let newSegment = new Segment(coordinateX, coordinateY, segmentWidth, segmentHeight, "right", i+1);
    snake.addSegment(newSegment);
}

console.log(snake.getAllSegments());

let counter = 0;

// const interval = setInterval(() => {
//     counter++;
//     if (counter % 2 === 0) {
//         snake.turnRight();
//     } else {
//         snake.turnLeft();
//     }

//     snake.advance();
// }, 1000)

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        if (snake.getHead().direction === "up") {
            snake.turnRight();
            
        } else if (snake.getHead().direction === "down") {
            snake.turnLeft();
            
        }
    } else if (event.code === "ArrowLeft") {
        if (snake.getHead().direction === "up") {
            snake.turnLeft();
            
        } else if (snake.getHead().direction === "down") {
            snake.turnRight();
           
        }
    } else if (event.code === "ArrowUp") {
        if (snake.getHead().direction === "left") {
            snake.turnRight();
            
        } else if (snake.getHead().direction === "right") {
            snake.turnLeft();
            
        }
    } else if (event.code === "ArrowDown") {
        if (snake.getHead().direction === "left") {
            snake.turnLeft();
           
        } else if (snake.getHead().direction === "right") {
            snake.turnRight();
            
        }
    }

    snake.advance();
    console.log(snake.getAllSegments());
})

console.log("Hello world!");

