export class Snake {
    constructor (head) {
        this.segments = [head];
    }

    getAllSegments () {
        return this.segments;
    }

    getSegmentAt (index) {
        return this.segments[index];
    }

    getHead () {
        return this.segments[0];
    }

    addSegment (segment) {
        this.segments.push(segment);
        segment.updateUI();
    }

    turnRight () {
        const head = this.getHead();

        if (head.direction === "up") {
            head.direction = "right";
        } else if (head.direction === "down") {
            head.direction = "left";
        } else if (head.direction === "left") {
            head.direction = "up";
        } else if (head.direction === "right") {
            head.direction = "down";
        }
    }

    turnLeft () {
        const head = this.getHead();

        if (head.direction === "up") {
            head.direction = "left";
        } else if (head.direction === "down") {
            head.direction = "right";
        } else if (head.direction === "left") {
            head.direction = "down";
        } else if (head.direction === "right") {
            head.direction = "up";
        }
    }

    advance () {
        this.segments.forEach((segment, index, arr) => {

            // Advance segment by 1 unit
            if (segment.direction === "right") {
                segment.coordinateX++;
            } else if (segment.direction === "left") {
                segment.coordinateX--;
            } else if(segment.direction === "up") {
                segment.coordinateY++;
            } else if (segment.direction === "down") {
                segment.coordinateY--;
            }

            
            // Pass the direction from previous segment
            if (index > 0) {
                if (segment.direction === "right" || segment.direction === "left") {
                    if ( segment.coordinateX === arr[index - 1].coordinateX
                        && segment.direction !== arr[index - 1].direction
                    ) {
                        segment.direction = arr[index - 1].direction;
                    }
                } else 
                if (segment.direction === "down" || segment.direction === "up") {
                    if ( segment.coordinateY === arr[index - 1].coordinateY
                        && segment.direction !== arr[index - 1].direction
                    ) {
                        segment.direction = arr[index - 1].direction;
                    }
                }
            }
            
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

    getCoordinateX () {
        return this.coordinateX;
    }

    getCoordinateY () {
        return this.coordinateY;
    }

    getDirection () {
        return this.direction;
    }

    setCoordinateX (coordinate) {
        this.coordinateX = position;
    }

    setCoordinateY (coordinate) {
        this.coordinateY = position;
    } 

    setDirection (direction) {
        this.direction = direction;
    }

    createDomElement () {
        const gameBoard = document.getElementById("game-board");
        this.element = document.createElement("div");
        this.element.classList.add("segment");
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
        this.element.innerText = this.index;
        gameBoard.appendChild(this.element);

    }

    updateUI () {
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
    }
}