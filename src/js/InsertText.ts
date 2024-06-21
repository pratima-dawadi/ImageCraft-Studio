interface TextElement {
  text: string;
  x: number;
  y: number;
  fontSize: string;
  color: string;
}

export class InsertText {
  private imgSrc: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageContainer = document.querySelector(
    ".view-image"
  ) as HTMLDivElement;
  private textInput = document.querySelector(
    ".text__input"
  ) as HTMLInputElement;
  private textButton = document.querySelector(
    ".text__button"
  ) as HTMLButtonElement;
  private textColor = document.querySelector(
    ".text__color"
  ) as HTMLInputElement;
  private textFont = document.querySelector(".text__size") as HTMLInputElement;

  private textElements: TextElement[] = [];
  private selectedTextElement: TextElement | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.textFont.value = "20";
    this.TextButtonListeners();
    this.setupDragAndDrop();
  }

  private TextButtonListeners() {
    this.textButton.addEventListener("click", () => {
      this.setupCanvas();
      this.addText();
    });
  }

  private setupCanvas() {
    this.canvas.width = this.imageContainer.clientWidth;
    this.canvas.height = this.imageContainer.clientHeight;

    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";

    this.imgSrc.parentElement?.appendChild(this.canvas);
  }

  private addText() {
    const fontSize = this.textFont.value;
    const color = this.textColor.value;
    const text = this.textInput.value;

    if (text) {
      const textElement: TextElement = {
        text: text,
        x: 10,
        y: 50,
        fontSize: fontSize,
        color: color,
      };

      this.textElements.push(textElement);
      this.drawTextElements();
      this.textInput.value = "";
    }
  }

  private drawTextElements() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const element of this.textElements) {
      this.ctx.font = `${element.fontSize}px Arial`;
      this.ctx.fillStyle = element.color;
      this.ctx.fillText(element.text, element.x, element.y);
      this.ctx.strokeText(element.text, element.x, element.y);
    }
  }

  private setupDragAndDrop() {
    this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    this.canvas.addEventListener("mouseup", () => this.onMouseUp());
    this.canvas.addEventListener("mouseout", () => this.onMouseUp());
  }

  private onMouseDown(e: MouseEvent) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    for (const element of this.textElements) {
      const textWidth = this.ctx.measureText(element.text).width;
      const textHeight = parseInt(element.fontSize, 10);

      if (
        mouseX >= element.x &&
        mouseX <= element.x + textWidth &&
        mouseY <= element.y &&
        mouseY >= element.y - textHeight
      ) {
        this.selectedTextElement = element;
        this.offsetX = mouseX - element.x;
        this.offsetY = mouseY - element.y;
        return;
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.selectedTextElement) {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      this.selectedTextElement.x = mouseX - this.offsetX;
      this.selectedTextElement.y = mouseY - this.offsetY;

      this.drawTextElements();
    }
  }

  private onMouseUp() {
    this.selectedTextElement = null;
  }
}
