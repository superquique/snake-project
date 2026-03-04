export class Edible {
    constructor (coordinateX, coordinateY, width, height) {
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.width = width;
        this.height = height;
        this.element = null;

        this.createDomElement();
    }

    createDomElement () {
        const gameBoard = document.getElementById("game-board");
        this.element = document.createElement("div");
        this.element.classList.add("edible");
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
        gameBoard.appendChild(this.element);

    }

    updateUI () {
        this.element.style.left = this.coordinateX * this.width + "px";
        this.element.style.bottom = this.coordinateY * this.height + "px";
    }
}