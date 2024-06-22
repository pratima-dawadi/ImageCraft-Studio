interface TextElement {
  text: string;
  x: number;
  y: number;
  font: string;
  color: string;
}

export class TextInserter {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private texts: TextElement[] = [];
  private isDragging: boolean = false;
  private selectedText: TextElement | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private originalCanvasState: ImageData | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.moveEventListener();
  }

  insertText(text: string, x: number, y: number, font: string, color: string) {
    this.saveCanvasState();
    const newText: TextElement = { text, x, y, font, color };
    this.texts.push(newText);
    this.redrawCanvas();
  }

  private moveEventListener() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private saveCanvasState() {
    this.originalCanvasState = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  private onMouseDown(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = this.texts.length - 1; i >= 0; i--) {
      const text = this.texts[i];
      if (this.isPointInText(x, y, text)) {
        this.isDragging = true;
        this.selectedText = text;
        this.dragOffsetX = x - text.x;
        this.dragOffsetY = y - text.y;
        break;
      }
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedText) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.selectedText.x = x - this.dragOffsetX;
      this.selectedText.y = y - this.dragOffsetY;

      this.redrawCanvas();
    }
  }

  private onMouseUp() {
    this.isDragging = false;
    this.selectedText = null;
  }

  private isPointInText(x: number, y: number, text: TextElement): boolean {
    this.ctx.font = `${text.font}px sans-serif`;
    const metrics = this.ctx.measureText(text.text);
    const textWidth = metrics.width;
    const textHeight = parseInt(text.font);

    return (
      x >= text.x &&
      x <= text.x + textWidth &&
      y >= text.y - textHeight &&
      y <= text.y
    );
  }

  private redrawCanvas() {
    if (this.originalCanvasState) {
      this.ctx.putImageData(this.originalCanvasState, 0, 0);
    }

    //Drawing all the text Elements on the canvas
    this.texts.forEach((text) => {
      this.ctx.font = `${text.font}px sans-serif`;
      this.ctx.fillStyle = text.color;
      this.ctx.fillText(text.text, text.x, text.y);
    });
  }
}
