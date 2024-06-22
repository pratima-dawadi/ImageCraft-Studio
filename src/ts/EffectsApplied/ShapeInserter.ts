// export class ShapeInserter {
//   private ctx: CanvasRenderingContext2D;

//   constructor(ctx: CanvasRenderingContext2D) {
//     this.ctx = ctx;
//   }

//   insertRectangle(
//     x: number,
//     y: number,
//     width: number,
//     height: number,
//     color: string
//   ) {
//     this.ctx.fillStyle = color;
//     this.ctx.fillRect(x, y, width, height);
//   }

//   insertTriangle(
//     x1: number,
//     y1: number,
//     x2: number,
//     y2: number,
//     x3: number,
//     y3: number,
//     color: string
//   ) {
//     this.ctx.fillStyle = color;
//     this.ctx.beginPath();
//     this.ctx.moveTo(x1, y1);
//     this.ctx.lineTo(x2, y2);
//     this.ctx.lineTo(x3, y3);
//     this.ctx.closePath();
//     this.ctx.fill();
//   }

//   insertCircle(x: number, y: number, radius: number, color: string) {
//     this.ctx.fillStyle = color;
//     this.ctx.beginPath();
//     this.ctx.arc(x, y, radius, 0, Math.PI * 2);
//     this.ctx.fill();
//   }
// }

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

export class ShapeInserter {
  private ctx: CanvasRenderingContext2D;
  private shapes: Shape[] = [];
  private isDragging: boolean = false;
  private selectedShape: Shape | null = null;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;
  private originalCanvasState: ImageData | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.moveEventListener();
  }

  insertRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.saveCanvasState();
    const newRectangle: Shape = {
      type: "rectangle",
      x,
      y,
      width,
      height,
      color,
    };
    this.shapes.push(newRectangle);
    this.redrawCanvas();
  }

  insertTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    color: string
  ) {
    this.saveCanvasState();
    const newTriangle: Shape = {
      type: "triangle",
      x: x1,
      y: y1,
      color,
      points: [
        { x: x2, y: y2 },
        { x: x3, y: y3 },
      ],
    };
    this.shapes.push(newTriangle);
    this.redrawCanvas();
  }

  insertCircle(x: number, y: number, radius: number, color: string) {
    this.saveCanvasState();
    const newCircle: Shape = { type: "circle", x, y, radius, color };
    this.shapes.push(newCircle);
    this.redrawCanvas();
  }

  private moveEventListener() {
    this.ctx.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.ctx.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.ctx.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
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

  private onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedShape) {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.selectedShape.x = x - this.dragOffsetX;
      this.selectedShape.y = y - this.dragOffsetY;

      this.redrawCanvas();
    }
  }

  private onMouseUp() {
    this.isDragging = false;
    this.selectedShape = null;
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
        if (shape.points && shape.points.length === 2) {
          return this.isPointInTriangle(
            x,
            y,
            shape.points[0].x,
            shape.points[0].y,
            shape.points[1].x,
            shape.points[1].y,
            shape.x,
            shape.y
          );
        }
        return false;
      case "circle":
        return shape.radius
          ? this.isPointInCircle(x, y, shape.x, shape.y, shape.radius)
          : false;
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

  private redrawCanvas() {
    if (this.originalCanvasState) {
      this.ctx.putImageData(this.originalCanvasState, 0, 0);
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
          if (shape.points && shape.points.length === 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.x, shape.y);
            this.ctx.lineTo(shape.points[0].x, shape.points[0].y);
            this.ctx.lineTo(shape.points[1].x, shape.points[1].y);
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
        default:
          break;
      }
    });
  }
}
