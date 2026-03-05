import { Snake, Segment } from "./snake.js";
import { Edible } from "./edible.js";


class Game {

    constructor (boardWidth, boardHeight, segmentWidth, segmentHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.segmentWidth = segmentWidth;
        this.segmentHeight = segmentHeight;
        this.score = 0;
        this.personalBest = 0;
        this.snake = null;
        this.edible = null;
        this.scoreDisplay = null;
        this.pbDisplay = null;
        this.interval = null;
        this.ready = false;

        this.initializeGame();
    }

    initializeGame () {
        if (this.snake) {
            this.snake.clearAllSegments();
        }

        if (this.edible) {
            this.edible.removeDomElement();
        }

        const gameBoard = document.getElementById("game-board");
        gameBoard.style.width = this.boardWidth + "px";
        gameBoard.style.height = this.boardHeight + "px";
        
        const boardHeader = document.getElementById("board-header");
        boardHeader.style.width = this.boardWidth + "px";
    
        const gameoverOverlay = document.getElementById("gameover-overlay");
        gameoverOverlay.classList.add("hidden");

        this.score = 0;
        
        this.scoreDisplay = document.getElementById("score-display");
        this.pbDisplay = document.getElementById("pb-display");

        this.scoreDisplay.innerText = `${this.score}`;
        this.pbDisplay.innerText = `${this.personalBest}`;

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

        this.ready = true;
    }

    start () {
        this.interval = setInterval(() => {
            // Detect collisions with other segments
            let collisionDetected = false;

            const allSnakeSegments = this.snake.segments;

            // Detect collisions with itself
            for (let i = 1; i < allSnakeSegments.length; i++) {
                const currentSegment = allSnakeSegments[i];
                if (this.snake.willCollideWith(currentSegment.coordinateX, currentSegment.coordinateY)) {
                    collisionDetected = true;
                    break;
                }
            }

            // Detect collisions with board boundaries
            if (this.snake.willCollideWithX(this.boardWidth/this.segmentWidth)) {
                collisionDetected = true;
            } else if (this.snake.willCollideWithX(-1)) {
                collisionDetected = true;
            } else if(this.snake.willCollideWithY(this.boardHeight/this.segmentHeight)) {
                collisionDetected = true;
            } else if (this.snake.willCollideWithY(-1)) {
                collisionDetected = true;
            } else {
                this.snake.advance();
            }

            // Gameover on collision detection
            if (collisionDetected) {
                clearInterval(this.interval);
                this.interval = null;
                this.ready = false;
                
                const scoreDisplayGameover = document.getElementById("score-display-gameover");
                scoreDisplayGameover.innerText = this.score;

                const pbDisplayGameover = document.getElementById("pb-display-gameover");
                pbDisplayGameover.innerText = this.personalBest;

                const gameoverOverlay = document.getElementById("gameover-overlay");
                gameoverOverlay.classList.remove("hidden");
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

        }, 120);
    }

    augmentScore (points = 1) {
        this.score++;

        if (this.score > this.personalBest) {
            this.personalBest = this.score;
        }
    }

    growSnake () {
        const tail = this.snake.getTail();
        let newSegment = new Segment(tail.coordinateX, tail.coordinateY, this.segmentWidth, this.segmentHeight, null, this.snake.segments.length);
        this.snake.addSegment(newSegment);
    }

    updateUI () {
        this.scoreDisplay.innerText = `${this.score}`;
        this.pbDisplay.innerText = `${this.personalBest}`;
        this.edible.updateUI();
    }
}

const game = new Game(600, 600, 25, 25);

const replayButton = document.getElementById("replay-button");

replayButton.addEventListener("click", (event) => {
    game.initializeGame();
})

document.addEventListener("keydown", (event) => {
    console.log("still listening");
    console.log("game interval", game.interval);
    
    if (
        (event.code === "ArrowUp" ||
        event.code === "ArrowRight" || 
        event.code === "ArrowDown") && game.interval === null && game.ready) {
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