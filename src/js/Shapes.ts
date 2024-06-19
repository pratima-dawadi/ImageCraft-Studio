export interface Shape {
  type: string;
  x: number;
  y: number;
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint(x: number, y: number): boolean;
  move(dx: number, dy: number): void;
}
export class Circle implements Shape {
  type: string;
  x: number;
  y: number;
  radius: number;

  constructor(x: number, y: number, radius: number) {
    this.type = "circle";
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
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

export class Triangle implements Shape {
  type: string;
  x: number;
  y: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;

  constructor(
    x: number,
    y: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    this.type = "triangle";
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x2, this.y2);
    ctx.lineTo(this.x3, this.y3);
    ctx.closePath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  containsPoint(px: number, py: number): boolean {
    const d1 = this.sign(px, py, this.x, this.y, this.x2, this.y2);
    const d2 = this.sign(px, py, this.x2, this.y2, this.x3, this.y3);
    const d3 = this.sign(px, py, this.x3, this.y3, this.x, this.y);

    const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
    const has_pos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(has_neg && has_pos);
  }

  private sign(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): number {
    return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.x2 += dx;
    this.y2 += dy;
    this.x3 += dx;
    this.y3 += dy;
  }
}
export class Star implements Shape {
  type: string;
  x: number;
  y: number;
  radius: number;

  constructor(x: number, y: number, radius: number) {
    this.type = "star";
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const spikes = 5;
    const outerRadius = this.radius;
    const innerRadius = this.radius / 2;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y + outerRadius);

    for (let i = 0; i < spikes; i++) {
      const x = this.x + Math.cos(i * step * 2) * outerRadius;
      const y = this.y + Math.sin(i * step * 2) * outerRadius;
      ctx.lineTo(x, y);
      const innerX = this.x + Math.cos(i * step * 2 + step) * innerRadius;
      const innerY = this.y + Math.sin(i * step * 2 + step) * innerRadius;
      ctx.lineTo(innerX, innerY);
    }

    ctx.closePath();
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  containsPoint(x: number, y: number): boolean {
    const dx = Math.abs(x - this.x);
    const dy = Math.abs(y - this.y);
    return dx <= this.radius && dy <= this.radius;
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
}
