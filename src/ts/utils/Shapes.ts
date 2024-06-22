export interface Shape {
  type: string;
  x: number;
  y: number;
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint(x: number, y: number): boolean;
  move(dx: number, dy: number): void;
}

export class Rectangle implements Shape {
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.type = "rectangle";
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h
    );
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
