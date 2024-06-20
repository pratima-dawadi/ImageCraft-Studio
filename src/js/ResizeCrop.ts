import { Rectangle } from "./Shapes";
import { ResetSave } from "./ResetSave";

export class ResizeCrop {
  private imgSrc: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isButtonClicked: boolean;
  private isDrawing: boolean;
  private isMoving: boolean;
  private startX: number;
  private startY: number;
  private currentWidth: number;
  private currentHeight: number;
  private shapes: Rectangle[] = [];
  private selectedShapeIndex: number | null;
  private imageContainer = document.querySelector(
    ".view-image"
  ) as HTMLDivElement;

  saveButton = document.querySelector(".save") as HTMLButtonElement;
  resetButton = document.querySelector(".reset") as HTMLButtonElement;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.selectedShapeIndex = null;
    this.isButtonClicked = false;
    this.isDrawing = false;
    this.isMoving = false;
    this.startX = 0;
    this.startY = 0;
    this.currentWidth = 0;
    this.currentHeight = 0;

    this.cropEventListener();
    this.setupResizeEventListeners();
  }

  private setupCanvas() {
    this.canvas.width = this.imageContainer.clientWidth;
    this.canvas.height = this.imageContainer.clientHeight;

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.imageContainer.appendChild(this.canvas);
  }

  private setupEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private cropEventListener() {
    const cropButton = document.querySelector("#crop") as HTMLButtonElement;
    cropButton.addEventListener("click", () => {
      this.isButtonClicked = true;
      this.setupCanvas();
      this.setupEventListeners();
      this.drawImage();
    });
  }

  private setupResizeEventListeners() {
    const imageWidth = document.querySelector("#width") as HTMLInputElement;
    const imageHeight = document.querySelector("#height") as HTMLInputElement;
    imageWidth.value = this.imgSrc.width.toString();
    imageHeight.value = this.imgSrc.height.toString();

    if (imageWidth && imageHeight) {
      imageWidth.addEventListener("input", () => this.updateSize());
      imageHeight.addEventListener("input", () => this.updateSize());
    }
  }

  private updateSize() {
    const imageWidth = document.querySelector("#width") as HTMLInputElement;
    const imageHeight = document.querySelector("#height") as HTMLInputElement;

    if (imageWidth && imageHeight) {
      const newWidth = parseInt(imageWidth.value);
      const newHeight = parseInt(imageHeight.value);

      if (!isNaN(newWidth) && newWidth > 0) {
        this.imgSrc.width = newWidth;
      }

      if (!isNaN(newHeight) && newHeight > 0) {
        this.imgSrc.height = newHeight;
      }
      this.setupCanvas();
      this.drawImage();
    }
  }

  private drawImage() {
    this.clearCanvas();
    this.ctx.drawImage(
      this.imgSrc,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  private handleMouseDown(event: MouseEvent) {
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

    if (this.isButtonClicked) {
      this.isDrawing = true;
      this.startX = mouseX;
      this.startY = mouseY;
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.offsetX;
      const currentY = event.offsetY;
      this.clearCanvas();
      this.drawImage();

      if (this.isButtonClicked) {
        const width = currentX - this.startX;
        const height = currentY - this.startY;
        this.drawShape(new Rectangle(this.startX, this.startY, width, height));
        this.currentHeight = height;
        this.currentWidth = width;
        console.log(
          `Mouse move Rectangle - StartX: ${this.startX}, StartY: ${this.startY}, Width: ${width}, Height: ${height}`
        );
      }
    } else if (this.isMoving && this.selectedShapeIndex !== null) {
      const dx = event.offsetX - this.startX;
      const dy = event.offsetY - this.startY;
      this.startX = event.offsetX;
      this.startY = event.offsetY;

      this.shapes[this.selectedShapeIndex].move(dx, dy);
      this.clearCanvas();
      this.drawImage();
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.offsetX;
      const currentY = event.offsetY;

      if (this.isButtonClicked) {
        this.currentWidth = currentX - this.startX;
        this.currentHeight = currentY - this.startY;
        this.shapes.push(
          new Rectangle(
            this.startX,
            this.startY,
            this.currentWidth,
            this.currentHeight
          )
        );
        console.log(
          `Rectangle - StartX: ${this.startX}, StartY: ${this.startY}, Width: ${this.currentWidth}, Height: ${this.currentHeight}`
        );

        const resetSaveInstance = new ResetSave(
          this.imgSrc,
          this.saveButton,
          this.resetButton
        );
        resetSaveInstance.setCropRect(
          this.startX,
          this.startY,
          this.currentWidth,
          this.currentHeight
        );

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
        tempCanvas.width = this.currentWidth;
        tempCanvas.height = this.currentHeight;
        tempCtx.drawImage(
          this.imgSrc,
          this.startX,
          this.startY,
          this.currentWidth,
          this.currentHeight,
          0,
          0,
          this.currentWidth,
          this.currentHeight
        );
        this.imgSrc.src = tempCanvas.toDataURL("image/png");
      }
      this.isDrawing = false;
      this.isButtonClicked = false;
    } else if (this.isMoving) {
      this.isMoving = false;
      this.selectedShapeIndex = null;
    }
    this.clearCanvas();
    this.drawImage();
  }

  private drawShape(shape: Rectangle) {
    shape.draw(this.ctx);
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
