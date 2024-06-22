import { RectangleCollage } from "../utils/RectangleCollage";
import { getRandomNumber } from "../utils/getRandomNumber";

/**
 * @class PhotoCollage- to create the photo collage
 */
export class PhotoCollage {
  private ctx: CanvasRenderingContext2D;

  private rectX: number = 0;
  private rectY: number = 0;
  private rectWidth: number = 0;
  private rectHeight: number = 0;

  private rectangles: RectangleCollage[] = [];

  private inputField = document.createElement("input");
  private button = document.createElement("button");

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * @public makeCollage- Function to create the canvas and draw the rectangles on it
   */
  public makeCollage() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.createInputField();
    this.createGenerateButton();

    this.button.addEventListener("click", () => {
      if (this.inputField.value === "") {
        return;
      }
      this.inputField.style.display = "none";
      this.button.style.display = "none";
      const numberOfRectangles = parseInt(this.inputField.value);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      this.rectangles = [];

      for (let i = 0; i < numberOfRectangles; i++) {
        let collision = true;
        while (collision) {
          this.rectX = getRandomNumber(0, this.ctx.canvas.width - 100);
          this.rectY = getRandomNumber(0, this.ctx.canvas.height - 200);
          this.rectWidth = getRandomNumber(
            100,
            this.ctx.canvas.width - this.rectX
          );
          this.rectHeight = getRandomNumber(
            200,
            this.ctx.canvas.height - this.rectY
          );
          const newRect = new RectangleCollage(
            this.rectX,
            this.rectY,
            this.rectWidth,
            this.rectHeight
          );
          collision = this.rectangles.some((rect) =>
            rect.collidesWith(newRect)
          );
        }
        const rectangle = new RectangleCollage(
          this.rectX,
          this.rectY,
          this.rectWidth,
          this.rectHeight
        );
        rectangle.draw(this.ctx);
        this.rectangles.push(rectangle);
      }
    });

    this.ctx.canvas.addEventListener("click", (event) => {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (const rectangle of this.rectangles) {
        if (rectangle.isClicked(x, y)) {
          this.chooseImage(rectangle);
          break;
        }
      }
    });
  }

  private createInputField() {
    this.inputField.type = "number";
    this.inputField.placeholder = "Number of rectangles";
    this.inputField.style.margin = "10px";
    this.inputField.style.position = "absolute";
    this.inputField.style.top = `300px`;
    this.inputField.style.left = `800px`;
    this.inputField.style.padding = "5px";
    document.body.appendChild(this.inputField);
  }

  private createGenerateButton() {
    this.button.textContent = "Generate";
    this.button.style.position = "absolute";
    this.button.style.padding = "5px";
    this.button.style.backgroundColor = "lightgreen";
    this.button.style.top = `350px`;
    this.button.style.left = `850px`;
    document.body.appendChild(this.button);
  }

  /**
   * @private chooseImage - Function to choose the images for the rectangles collage
   * @param rectangle - Rectangle object
   */
  private chooseImage(rectangle: RectangleCollage) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          rectangle.setImage(this.ctx, result);
        };
        reader.readAsDataURL(file);
      }
      document.body.removeChild(input);
    });

    input.click();
  }
}
