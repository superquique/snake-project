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
            currentSegment.direction = previousSegment.direction;
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

    isCollidingWithAnySegment (coordinateX, coordinateY) {
        for (const segment of this.segments) {
            if (segment.coordinateX === coordinateX && segment.coordinateY === coordinateY) {
                return true;
            }
        }

        return false;
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
        this.segments.forEach((segment, index, arr) => {
            if (segment.element === null) {
                segment.createDomElement();
            }

            if (index === 0) {
                segment.updateUI("head");
            } else if (index < arr.length - 1) {
                const prev = arr[index - 1];
                const next = arr[index + 1];

                // Calcualte signature
                const sigX = (prev.coordinateX - segment.coordinateX) + 
                    (next.coordinateX - segment.coordinateX);

                const sigY = (prev.coordinateY - segment.coordinateY) + 
                    (next.coordinateY - segment.coordinateY);

                const signature = `${sigX},${sigY}`;

                if (signature === "0,0") {
                    segment.updateUI("segment");
                } else {
                    segment.updateUI("corner", signature);
                }
            } else {
                segment.updateUI("tail");
            }
        });
    }
}

export class Segment {
    constructor (coordinateX, coordinateY, width, height, direction) {
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.width = width;
        this.height = height;
        this.direction = direction;
        this.element = null;
    }

    createDomElement () {
        const gameBoard = document.getElementById("game-board");
        this.element = document.createElement("div");
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        gameBoard.appendChild(this.element);
    }

    removeDomElement () {
        const gameBoard = document.getElementById("game-board");
        gameBoard.removeChild(this.element);
        this.element = null;
    }

    updateUI (role, signature = null) {
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";

        this.element.className = role;

        if (role === "corner") {
            const angles = { '1,1': 270, '-1,1': 180, '-1,-1': 90, '1,-1': 0 };
            this.element.style.transform = `rotate(${angles[signature]}deg)`;
        } else {
            const angles = { 'right': 0, 'down': 90, 'left': 180, 'up': 270 };
            this.element.style.transform = `rotate(${angles[this.direction]}deg)`;
        } 
    }
}