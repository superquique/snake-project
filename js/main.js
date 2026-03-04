import { Snake, Segment } from "./snake.js";
import { Edible } from "./edible.js";


class Game {

    constructor (boardWidth, boardHeight, segmentWidth, segmentHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.segmentWidth = segmentWidth;
        this.segmentHeight = segmentHeight;
        this.score = 0;
        this.snake = null;
        this.edible = null;
        this.scoreDisplay = null;
        this.interval = null;

        this.initializeGame();
    }

    initializeGame () {
        const gameBoard = document.getElementById("game-board");
        gameBoard.style.width = this.boardWidth + "px";
        gameBoard.style.height = this.boardHeight + "px";
        
        const boardHeader = document.getElementById("board-header");
        boardHeader.style.width = this.boardWidth + "px";

        this.score = 0;
        
        this.scoreDisplay = document.getElementById("score-display");

        this.scoreDisplay.innerText = `${this.score}`;

        let coordinateX = 5;
        const coordinateY = Math.floor(this.boardHeight / 25 / 2);
        
        const head = new Segment(coordinateX, coordinateY, this.segmentWidth, this.segmentHeight, "right", 0);
        
        this.snake = new Snake(head);
        this.edible = new Edible(coordinateX + 15, coordinateY, this.segmentWidth, this.segmentHeight);

        for (let i = 0; i<2; i++) {
            coordinateX--;

            let newSegment = new Segment(coordinateX, coordinateY, this.segmentWidth, this.segmentHeight, null, i+1);
            this.snake.addSegment(newSegment);
        }
    }

    start () {
        this.interval = setInterval(() => {
            // Detect collisions with other segments
            let willCollideWithItself = false;

            const allSnakeSegments = this.snake.segments;

            for (let i = 1; i < allSnakeSegments.length; i++) {
                const currentSegment = allSnakeSegments[i];
                if (this.snake.willCollideWith(currentSegment.coordinateX, currentSegment.coordinateY)) {
                    willCollideWithItself = true;
                    break;
                }
            }

            // Detect collisions with itself
            if (willCollideWithItself) {
                clearInterval(this.interval);
            }
            // Detect collisions with board boundaries
            else if (this.snake.willCollideWithX(this.boardWidth/this.segmentWidth)) {
                clearInterval(this.interval);
            } else if (this.snake.willCollideWithX(-1)) {
                clearInterval(this.interval);
            } else if(this.snake.willCollideWithY(this.boardHeight/this.segmentHeight)) {
                clearInterval(this.interval);
            } else if (this.snake.willCollideWithY(-1)) {
                clearInterval(this.interval);
            } else {
                this.snake.advance();
            }

            // Detect collisions with edible
            if (this.snake.isCollidingWith(this.edible.coordinateX, this.edible.coordinateY)) {
                
                // Make snake grow one segment
                this.growSnake();

                // Update score
                this.augmentScore();

                // Change edible position
                const newCoordinateX = Math.floor(Math.random() * this.boardWidth/this.segmentWidth);
                const newCoordinateY = Math.floor(Math.random() * this.boardHeight/this.segmentHeight);

                this.edible.coordinateX = newCoordinateX;
                this.edible.coordinateY = newCoordinateY;

                // Update game UI state
                this.updateUI();
            }

        }, 200);
    }

    augmentScore (points = 1) {
        this.score++;
    }

    growSnake () {
        const tail = this.snake.getTail();
        let newSegment = new Segment(tail.coordinateX, tail.coordinateY, this.segmentWidth, this.segmentHeight, null, this.snake.segments.length);
        this.snake.addSegment(newSegment);
    }

    updateUI () {
        this.scoreDisplay.innerText = `${this.score}`;
        this.edible.updateUI();
    }
}

const game = new Game(600, 600, 25, 25);

document.addEventListener("keydown", (event) => {
    if (
        (event.code === "ArrowUp" ||
        event.code === "ArrowRight" || 
        event.code === "ArrowDown") && !game.interval) {
        game.start();
    }

    if (event.code === "ArrowRight") {
        game.snake.turnRight();
    } else if (event.code === "ArrowLeft") {
        game.snake.turnLeft();
    } else if (event.code === "ArrowUp") {
        game.snake.turnUp();
    } else if (event.code === "ArrowDown") {
        game.snake.turnDown();
    }    
});