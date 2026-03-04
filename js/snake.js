export class Snake {
    constructor (head) {
        this.segments = [head];
    }

    getHead () {
        return this.segments[0];
    }

    getTail () {
        return this.segments.slice(-1)[0];
    }

    addSegment (segment) {
        this.segments.push(segment);
        segment.updateUI();
    }

    clearAllSegments () {
        this.segments.forEach((segment) => {
            segment.removeDomElement();
        })
        this.segments = null;
    }

    turnRight () {
        const head = this.getHead();
        
        if (head.direction !== "left") {
            head.direction = "right";
        }
    }

    turnLeft () {
        const head = this.getHead();

        if (head.direction !== "right") {
            head.direction = "left";
        }
    }

    turnUp () {
        const head = this.getHead();

        if (head.direction !== "down") {
            head.direction = "up";
        }
    }

    turnDown () {
        const head = this.getHead();

        if (head.direction !== "up") {
            head.direction = "down";
        }
    }

    advance () {
        // Pass the coords from previous segment
        for (let i=this.segments.length - 1; i > 0; i--) {
            const currentSegment = this.segments[i];
            const previousSegment = this.segments[i-1]
            currentSegment.coordinateX = previousSegment.coordinateX;
            currentSegment.coordinateY = previousSegment.coordinateY;
        }

        // Advance head by 1 unit
        const head = this.getHead();

        if (head.direction === "right") {
            head.coordinateX++;
        } else if (head.direction === "left") {
            head.coordinateX--;
        } else if(head.direction === "up") {
            head.coordinateY++;
        } else if (head.direction === "down") {
            head.coordinateY--;
        }

        this.draw();
           
    }

    isCollidingWith (coordinateX, coordinateY) {
        return this.isCollidingWithX(coordinateX) && this.isCollidingWithY(coordinateY); 
    }

    isCollidingWithX (coordinateX) {
        const head = this.getHead();

        if(head.coordinateX === coordinateX) {
            return true;
        }

        return false;
    }

    isCollidingWithY (coordinateY) {
        const head = this.getHead();

        if(head.coordinateY === coordinateY) {
            return true;
        }

        return false;
    }

    willCollideWith (coordinateX, coordinateY) {
        const head = this.getHead();

        if (head.direction === "right"){
            return head.coordinateX + 1 === coordinateX && head.coordinateY === coordinateY;
        } else if (head.direction === "left") {
            return head.coordinateX - 1 === coordinateX && head.coordinateY === coordinateY;
        } else if (head.direction === "up") {
            return head.coordinateY + 1 === coordinateY && head.coordinateX === coordinateX;
        } else if (head.direction === "down") {
            return head.coordinateY - 1 === coordinateY && head.coordinateX === coordinateX;
        }

        return false;
    }
    
    willCollideWithX(coordinateX) {
        const head = this.getHead();

        if(head.direction === "right" && head.coordinateX + 1 === coordinateX) {
            return true;
        } else if (head.direction === "left" && head.coordinateX - 1 === coordinateX){
            return true;
        }

        return false;
    }

    willCollideWithY(coordinateY) {
        const head = this.getHead();

        if(head.direction === "up" && head.coordinateY + 1 === coordinateY) {
            return true;
        } else if (head.direction === "down" && head.coordinateY - 1 === coordinateY){
            return true;
        }

        return false;
    }

    draw () {
        this.segments.forEach((segment) => {
            segment.updateUI();
        });
    }
}

export class Segment {
    constructor (coordinateX, coordinateY, width, height, direction, index) {
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.index = index;
        this.element = null;

        this.createDomElement();
    }

    createDomElement () {
        const gameBoard = document.getElementById("game-board");
        this.element = document.createElement("div");
        this.element.classList.add("segment");
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
        this.element.innerText = this.index;
        gameBoard.appendChild(this.element);
    }

    removeDomElement () {
        const gameBoard = document.getElementById("game-board");
        gameBoard.removeChild(this.element);
        this.element = null;
    }

    updateUI () {
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
    }
}