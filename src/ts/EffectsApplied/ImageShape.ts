/**
 * @class ImageShape - Mask the image with a shape
 */
export class ImageShape {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  fitImageInShape(shape: "heart" | "circle" | "triangle" | "rhombus" | "star") {
    const { width, height } = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const shapeMask = this.createShapeMask(shape, width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        if (!shapeMask[y * width + x]) {
          imageData.data[index + 3] = 0;
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private createShapeMask(
    shape: "heart" | "circle" | "triangle" | "rhombus" | "star",
    width: number,
    height: number
  ): boolean[] {
    const mask = new Array(width * height).fill(false);
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        switch (shape) {
          case "heart":
            mask[index] = this.isInsideHeart(x, y, centerX, centerY, size);
            break;
          case "circle":
            mask[index] = this.isInsideCircle(x, y, centerX, centerY, size);
            break;
          case "triangle":
            mask[index] = this.isInsideTriangle(x, y, centerX, centerY, size);
            break;
          case "rhombus":
            mask[index] = this.isInsideRhombus(x, y, centerX, centerY, size);
            break;
          case "star":
            mask[index] = this.isInsideStar(x, y, centerX, centerY, size);
            break;
        }
      }
    }
    return mask;
  }

  private isInsideHeart(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: number
  ): boolean {
    const relX = (x - cx) / size;
    const relY = (y - cy) / size;
    const equation =
      Math.pow(relX * relX + relY * relY - 1, 3) -
      relX * relX * relY * relY * relY;
    return equation <= 0;
  }

  private isInsideCircle(
    x: number,
    y: number,
    cx: number,
    cy: number,
    radius: number
  ): boolean {
    return Math.pow(x - cx, 2) + Math.pow(y - cy, 2) <= Math.pow(radius, 2);
  }

  private isInsideTriangle(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: number
  ): boolean {
    const x1 = cx,
      y1 = cy - size;
    const x2 = cx - (size * Math.sqrt(3)) / 2,
      y2 = cy + size / 2;
    const x3 = cx + (size * Math.sqrt(3)) / 2,
      y3 = cy + size / 2;

    const d1 = (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2);
    const d2 = (x - x3) * (y2 - y3) - (x2 - x3) * (y - y3);
    const d3 = (x - x1) * (y3 - y1) - (x3 - x1) * (y - y1);

    return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0);
  }

  private isInsideRhombus(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: number
  ): boolean {
    const relX = Math.abs(x - cx) / size;
    const relY = Math.abs(y - cy) / size;
    return relX + relY <= 1;
  }
  private isInsideStar(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: number
  ): boolean {
    const relX = x - cx;
    const relY = y - cy;
    const angle = (Math.atan2(relY, relX) * 180) / Math.PI + 180;
    const dist = Math.sqrt(relX * relX + relY * relY);
    const r1 = size;
    const r2 = size / 2;
    const p = angle % 72;
    const r = p < 36 ? r1 : r2;
    return dist <= r * Math.cos(((p % 36) * Math.PI) / 180);
  }
}
