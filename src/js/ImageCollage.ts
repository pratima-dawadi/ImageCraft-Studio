import { Rectangle } from "./Rectangle";
import { getRandomNumber } from "./utils";

/**
 * @class ImageCollage- to create the photo collage
 */
export class ImageCollage {
  private collageContainer = document.querySelector(
    ".image-container"
  ) as HTMLElement;

  private rectX: number = 0;
  private rectY: number = 0;
  private rectWidth: number = 0;
  private rectHeight: number = 0;

  private rectangles: Rectangle[] = [];
  private targetDiv = this.collageContainer as HTMLDivElement;
  private tempCanvas = document.createElement("canvas");
  private tempCtx = this.tempCanvas.getContext(
    "2d"
  ) as CanvasRenderingContext2D;

  private inputField = document.createElement("input");
  private button = document.createElement("button");

  constructor() {
    this.photoCollageEventListeners();
  }

  private photoCollageEventListeners() {
    const photoCollage = document.querySelector(".photoCollage");
    photoCollage?.addEventListener("click", () => {
      this.makeCollage();
    });
  }

  /**
   * @private makeCollage- Function to create the canvas and draw the rectangles on it
   */
  private makeCollage() {
    this.targetDiv.innerHTML = "";
    this.targetDiv.appendChild(this.tempCanvas);
    this.tempCanvas.width = this.targetDiv.clientWidth;
    this.tempCanvas.height = this.targetDiv.clientHeight;
    this.tempCtx.rect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    this.tempCtx.fillStyle = "lightgrey";
    this.tempCtx.fill();

    this.createInputField();
    this.createGenerateButton();

    this.button.addEventListener("click", () => {
      if (this.inputField.value === "") {
        return;
      }
      this.inputField.style.display = "none";
      this.button.style.display = "none";
      const numberOfRectangles = parseInt(this.inputField.value);
      this.tempCtx.clearRect(
        0,
        0,
        this.tempCanvas.width,
        this.tempCanvas.height
      );

      this.rectangles = [];

      for (let i = 0; i < numberOfRectangles; i++) {
        let collision = true;
        while (collision) {
          this.rectX = getRandomNumber(0, this.tempCanvas.width - 100);
          this.rectY = getRandomNumber(0, this.tempCanvas.height - 200);
          this.rectWidth = getRandomNumber(
            100,
            this.tempCanvas.width - this.rectX
          );
          this.rectHeight = getRandomNumber(
            200,
            this.tempCanvas.height - this.rectY
          );
          const newRect = new Rectangle(
            this.rectX,
            this.rectY,
            this.rectWidth,
            this.rectHeight
          );
          collision = this.rectangles.some((rect) =>
            rect.collidesWith(newRect)
          );
        }
        const rectangle = new Rectangle(
          this.rectX,
          this.rectY,
          this.rectWidth,
          this.rectHeight
        );
        rectangle.draw(this.tempCtx);
        this.rectangles.push(rectangle);
      }
    });

    this.tempCanvas.addEventListener("click", (event) => {
      const rect = this.tempCanvas.getBoundingClientRect();
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
    this.inputField.style.top = `${this.tempCanvas.height / 2 - 50}px`;
    this.inputField.style.left = `${this.tempCanvas.width / 2 - 100}px`;
    this.inputField.style.margin = "10px";
    this.inputField.style.padding = "5px";
    this.targetDiv.appendChild(this.inputField);
  }

  private createGenerateButton() {
    this.button.textContent = "Generate";
    this.button.style.position = "absolute";
    this.button.style.padding = "5px";
    this.button.style.backgroundColor = "lightgreen";
    this.button.style.top = `${this.tempCanvas.height / 2}px`;
    this.button.style.left = `${this.tempCanvas.width / 2 - 25}px`;
    this.targetDiv.appendChild(this.button);
  }

  /**
   * @private chooseImage - Function to choose the images for the rectangles collage
   * @param rectangle - Rectangle object
   */
  private chooseImage(rectangle: Rectangle) {
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
          rectangle.setImage(this.tempCtx, result);
        };
        reader.readAsDataURL(file);
      }
      document.body.removeChild(input);
    });

    input.click();
  }
}
