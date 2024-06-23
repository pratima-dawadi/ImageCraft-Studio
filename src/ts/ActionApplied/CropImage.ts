import { Rectangle } from "../utils/Shapes";

/**
 * @class CropImage - Class to handle the resize and crop functionality within an existing canvas
 */
export class CropImage {
  private ctx: CanvasRenderingContext2D;
  private originalImageData: ImageData | null;
  private cropButton: HTMLButtonElement;
  private isDrawing: boolean;
  private startX: number;
  private startY: number;
  private currentWidth: number;
  private currentHeight: number;

  constructor(ctx: CanvasRenderingContext2D, cropButton: HTMLButtonElement) {
    this.ctx = ctx;
    this.originalImageData = null;
    this.cropButton = cropButton;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.currentWidth = 0;
    this.currentHeight = 0;

    this.setupEventListeners();
  }

  public setupEventListeners() {
    this.ctx.canvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.ctx.canvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    this.ctx.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  /**
   * @method checkActive - Method to check if the crop button is active or not and setup event listeners accordingly
   */
  public checkActive() {
    const isActive = this.cropButton.classList.contains("active");
    if (isActive && !this.isDrawing) {
      this.setupEventListeners();
    } else {
      this.ctx.canvas.removeEventListener(
        "mousedown",
        this.handleMouseDown.bind(this)
      );
      this.ctx.canvas.removeEventListener(
        "mousemove",
        this.handleMouseMove.bind(this)
      );
      this.ctx.canvas.removeEventListener(
        "mouseup",
        this.handleMouseUp.bind(this)
      );
    }
  }

  private drawImage() {
    if (this.originalImageData) {
      this.clearCanvas();
      this.ctx.putImageData(this.originalImageData, 0, 0);
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const isActive = this.cropButton.classList.contains("active");

    if (isActive) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      this.startX = mouseX;
      this.startY = mouseY;
      this.isDrawing = true;
      this.originalImageData = this.ctx.getImageData(
        0,
        0,
        this.ctx.canvas.width,
        this.ctx.canvas.height
      );
    }
  }

  private handleMouseMove(event: MouseEvent) {
    if (this.isDrawing) {
      const currentX = event.offsetX;
      const currentY = event.offsetY;

      this.currentWidth = currentX - this.startX;
      this.currentHeight = currentY - this.startY;

      this.clearCanvas();
      this.drawImage();

      this.drawShape(
        new Rectangle(
          this.startX,
          this.startY,
          this.currentWidth,
          this.currentHeight
        )
      );
    }
  }

  private handleMouseUp() {
    if (this.isDrawing) {
      this.isDrawing = false;

      const croppedImage = this.ctx.getImageData(
        this.startX,
        this.startY,
        this.currentWidth,
        this.currentHeight
      );
      this.clearCanvas();
      this.ctx.canvas.width = this.currentWidth;
      this.ctx.canvas.height = this.currentHeight;
      this.ctx.putImageData(croppedImage, 0, 0);

      this.originalImageData = null;
    }
  }

  private drawShape(shape: Rectangle) {
    shape.draw(this.ctx);
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
