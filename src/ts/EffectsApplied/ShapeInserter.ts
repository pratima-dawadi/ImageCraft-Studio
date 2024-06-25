interface Shape {
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  points?: { x: number; y: number }[];
}
enum Mode {
  Draw,
  Move,
}

/**
 * @class ShapeInserter - Insert shapes on the canvas
 */
export class ShapeInserter {
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private isDragging: boolean = false;
  private selectedShape: Shape | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private originalCanvasState: ImageData | null = null;
  private currentShapeType: string | null = null;
  private currentShapeColor: string = "rgba(255, 0, 0)";
  private isDrawing: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private mode: Mode = Mode.Move;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.ctx.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.ctx.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.ctx.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  setShapeType(type: string) {
    this.currentShapeType = type;
    this.mode = Mode.Draw;
  }

  setShapeColor(color: string) {
    this.currentShapeColor = color;
  }

  private saveCanvasState() {
    this.originalCanvasState = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  private onMouseDown(event: MouseEvent) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.mode === Mode.Draw && this.currentShapeType) {
      this.isDrawing = true;
      this.startX = x;
      this.startY = y;
      this.saveCanvasState();
    } else if (this.mode === Mode.Move) {
      for (let i = this.shapes.length - 1; i >= 0; i--) {
        const shape = this.shapes[i];
        if (this.isPointInShape(x, y, shape)) {
          this.isDragging = true;
          this.selectedShape = shape;
          this.dragOffsetX = x - shape.x;
          this.dragOffsetY = y - shape.y;
          break;
        }
      }
    }
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (this.mode === Mode.Draw && this.isDrawing && this.currentShapeType) {
      this.drawCurrentShape(x, y);
    } else if (
      this.mode === Mode.Move &&
      this.isDragging &&
      this.selectedShape
    ) {
      const dx = x - this.dragOffsetX - this.selectedShape.x;
      const dy = y - this.dragOffsetY - this.selectedShape.y;

      this.selectedShape.x += dx;
      this.selectedShape.y += dy;

      if (this.selectedShape.type === "triangle" && this.selectedShape.points) {
        this.selectedShape.points.forEach((point) => {
          point.x += dx;
          point.y += dy;
        });
      }

      this.redrawCanvas();
    }
  }

  private onMouseUp(event: MouseEvent) {
    if (this.mode === Mode.Draw && this.isDrawing && this.currentShapeType) {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.finishDrawingShape(x, y);

      this.mode = Mode.Move;
      this.currentShapeType = null;
    }
    this.isDrawing = false;
    this.isDragging = false;
    this.selectedShape = null;
  }

  private finishDrawingShape(x: number, y: number) {
    let newShape: Shape;

    switch (this.currentShapeType) {
      case "rectangle":
        newShape = {
          type: "rectangle",
          x: Math.min(this.startX, x),
          y: Math.min(this.startY, y),
          width: Math.abs(x - this.startX),
          height: Math.abs(y - this.startY),
          color: this.currentShapeColor,
        };
        break;
      case "triangle":
        newShape = {
          type: "triangle",
          x: this.startX,
          y: this.startY,
          color: this.currentShapeColor,
          points: [
            { x: this.startX, y: this.startY },
            { x, y },
            { x: this.startX * 2 - x, y },
          ],
        };
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
        );
        newShape = {
          type: "circle",
          x: this.startX,
          y: this.startY,
          radius,
          color: this.currentShapeColor,
        };
        break;

      case "line":
        newShape = {
          type: "line",
          x: this.startX,
          y: this.startY,
          color: this.currentShapeColor,
          points: [
            { x: this.startX, y: this.startY },
            { x, y },
          ],
        };
        break;

      default:
        return;
    }

    this.shapes.push(newShape);
    this.redrawCanvas();
  }

  private drawCurrentShape(x: number, y: number) {
    if (this.originalCanvasState) {
      this.ctx.putImageData(this.originalCanvasState, 0, 0);
    }

    this.ctx.fillStyle = this.currentShapeColor;
    this.ctx.strokeStyle = this.currentShapeColor;

    switch (this.currentShapeType) {
      case "rectangle":
        const width = x - this.startX;
        const height = y - this.startY;
        this.ctx.fillRect(this.startX, this.startY, width, height);
        break;
      case "triangle":
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(this.startX * 2 - x, y);
        this.ctx.closePath();
        this.ctx.fill();
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
        );
        this.ctx.beginPath();
        this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        break;
    }
  }

  private redrawCanvas() {
    if (this.originalCanvasState) {
      this.ctx.putImageData(this.originalCanvasState, 0, 0);
    } else {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    this.shapes.forEach((shape) => {
      this.ctx.fillStyle = shape.color;
      switch (shape.type) {
        case "rectangle":
          if (shape.width && shape.height) {
            this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
          }
          break;
        case "triangle":
          if (shape.points && shape.points.length === 3) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            this.ctx.lineTo(shape.points[1].x, shape.points[1].y);
            this.ctx.lineTo(shape.points[2].x, shape.points[2].y);
            this.ctx.closePath();
            this.ctx.fill();
          }
          break;
        case "circle":
          if (shape.radius) {
            this.ctx.beginPath();
            this.ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            this.ctx.fill();
          }
          break;

        case "line":
          if (shape.points && shape.points.length === 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            this.ctx.lineTo(shape.points[1].x, shape.points[1].y);
            this.ctx.stroke();
          }
          break;
      }
    });
  }

  private isPointInShape(x: number, y: number, shape: Shape): boolean {
    switch (shape.type) {
      case "rectangle":
        return (
          x >= shape.x &&
          x <= shape.x + (shape.width || 0) &&
          y >= shape.y &&
          y <= shape.y + (shape.height || 0)
        );
      case "triangle":
        if (shape.points && shape.points.length === 3) {
          return this.isPointInTriangle(
            x,
            y,
            shape.points[0].x,
            shape.points[0].y,
            shape.points[1].x,
            shape.points[1].y,
            shape.points[2].x,
            shape.points[2].y
          );
        }
        return false;
      case "circle":
        return shape.radius
          ? this.isPointInCircle(x, y, shape.x, shape.y, shape.radius)
          : false;

      case "line":
        if (shape.points && shape.points.length === 2) {
          return this.isPointOnLine(
            x,
            y,
            shape.points[0].x,
            shape.points[0].y,
            shape.points[1].x,
            shape.points[1].y
          );
        }
        return false;

      default:
        return false;
    }
  }
  private isPointInTriangle(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): boolean {
    const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
    const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
    const c = 1 - a - b;

    return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
  }

  private isPointInCircle(
    x: number,
    y: number,
    cx: number,
    cy: number,
    radius: number
  ): boolean {
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
  }
  private isPointOnLine(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): boolean {
    const dxc = x - x1;
    const dyc = y - y1;
    const dxl = x2 - x1;
    const dyl = y2 - y1;
    const cross = dxc * dyl - dyc * dxl;
    if (cross !== 0) return false;

    if (Math.abs(dxl) >= Math.abs(dyl)) {
      return dxl > 0 ? x1 <= x && x <= x2 : x2 <= x && x <= x1;
    } else {
      return dyl > 0 ? y1 <= y && y <= y2 : y2 <= y && y <= y1;
    }
  }
}
