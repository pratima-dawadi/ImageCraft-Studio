import { Circle, Rectangle, Shape, Star, Triangle } from "./Shapes";

/**
 * @class TextShape - Class to handle the text shapes
 */
export class TextShape {
  private imgSrc: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDrawing: boolean;
  private isMoving: boolean;
  private startX: number;
  private startY: number;
  private shapes: Shape[];
  private selectedShapeIndex: number | null;
  private currentShapeType: string | null;
  private imageContainer = document.querySelector(
    ".view-image"
  ) as HTMLDivElement;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.shapes = [];
    this.selectedShapeIndex = null;
    this.isDrawing = false;
    this.isMoving = false;
    this.startX = 0;
    this.startY = 0;
    this.currentShapeType = null;

    // this.setupCanvas();
    this.setupEventListeners();
    this.updateLayerList();
  }

  private setupCanvas() {
    this.canvas.width = this.imageContainer.clientWidth;
    this.canvas.height = this.imageContainer.clientHeight;

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";

    this.imgSrc.parentElement?.appendChild(this.canvas);
  }

  private setupEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.setupFilterButtons();
  }

  private setupFilterButtons() {
    const filterButtons = document.querySelectorAll(
      ".icons__collection6 button"
    );
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setupCanvas();
        this.currentShapeType = button.id;
      });
    });
  }

  private handleMouseDown(event: MouseEvent) {
    if (!this.currentShapeType) return;

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    this.selectedShapeIndex = this.shapes.findIndex((shape) =>
      shape.containsPoint(mouseX, mouseY)
    );

    if (this.selectedShapeIndex !== -1) {
      this.isMoving = true;
      this.startX = mouseX;
      this.startY = mouseY;
      return;
    }

    this.isDrawing = true;
    this.startX = mouseX;
    this.startY = mouseY;
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.offsetX;
      const currentY = event.offsetY;

      this.clearCanvas();
      this.drawAllShapes();

      switch (this.currentShapeType) {
        case "circle":
          const radius = Math.sqrt(
            (currentX - this.startX) ** 2 + (currentY - this.startY) ** 2
          );
          this.drawShape(new Circle(this.startX, this.startY, radius));
          break;
        case "rectangle":
          const width = currentX - this.startX;
          const height = currentY - this.startY;
          this.drawShape(
            new Rectangle(this.startX, this.startY, width, height)
          );
          break;
        case "triangle":
          this.drawShape(
            new Triangle(
              this.startX,
              this.startY,
              currentX,
              currentY,
              this.startX - (currentX - this.startX),
              currentY
            )
          );
          break;
        case "star":
          const starRadius = Math.sqrt(
            (currentX - this.startX) ** 2 + (currentY - this.startY) ** 2
          );
          this.drawShape(new Star(this.startX, this.startY, starRadius));
          break;
      }
    } else if (this.isMoving && this.selectedShapeIndex !== null) {
      const dx = event.offsetX - this.startX;
      const dy = event.offsetY - this.startY;
      this.startX = event.offsetX;
      this.startY = event.offsetY;

      this.shapes[this.selectedShapeIndex].move(dx, dy);
      this.clearCanvas();
      this.drawAllShapes();
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.offsetX;
      const currentY = event.offsetY;

      switch (this.currentShapeType) {
        case "circle":
          const radius = Math.sqrt(
            (currentX - this.startX) ** 2 + (currentY - this.startY) ** 2
          );
          this.shapes.push(new Circle(this.startX, this.startY, radius));
          break;
        case "rectangle":
          const width = currentX - this.startX;
          const height = currentY - this.startY;
          this.shapes.push(
            new Rectangle(this.startX, this.startY, width, height)
          );
          break;
        case "triangle":
          this.shapes.push(
            new Triangle(
              this.startX,
              this.startY,
              currentX,
              currentY,
              this.startX - (currentX - this.startX),
              currentY
            )
          );
          break;
        case "star":
          const starRadius = Math.sqrt(
            (currentX - this.startX) ** 2 + (currentY - this.startY) ** 2
          );
          this.shapes.push(new Star(this.startX, this.startY, starRadius));
          break;
      }
      this.isDrawing = false;
      this.updateLayerList();
    } else if (this.isMoving) {
      this.isMoving = false;
      this.selectedShapeIndex = null;
    }
  }

  private drawShape(shape: Shape) {
    shape.draw(this.ctx);
  }

  private drawAllShapes() {
    this.shapes.forEach((shape) => shape.draw(this.ctx));
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Updates the layer list displayed in the UI.
   * @private
   */
  private updateLayerList() {
    const layerListElement = document.querySelector(".layer-list");
    if (!layerListElement) return;

    layerListElement.innerHTML = "";
    this.shapes.forEach((shape, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${shape.constructor.name} (${index})`;
      listItem.addEventListener("click", () => {
        this.selectShape(index);
      });
      layerListElement.appendChild(listItem);
    });
  }

  /**
   * Selects a shape from the layer list and highlights it.
   * @param {number} index - The index of the shape to select.
   * @private
   */
  private selectShape(index: number) {
    this.selectedShapeIndex = index;
    this.clearCanvas();
    this.drawAllShapes();
    this.highlightSelectedShape();
  }

  /**
   * Highlights the currently selected shape by drawing an outline around it.
   * @private
   */
  private highlightSelectedShape() {
    if (this.selectedShapeIndex !== null) {
      const selectedShape = this.shapes[this.selectedShapeIndex];
      this.ctx.save();
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      selectedShape.draw(this.ctx);
      this.ctx.restore();
    }
  }
}
