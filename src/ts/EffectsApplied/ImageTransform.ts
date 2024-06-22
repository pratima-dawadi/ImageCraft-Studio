export class ImageTransform {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  public rotateLeft() {
    const { width, height } = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const rotatedData = new ImageData(height, width);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = ((width - x - 1) * height + y) * 4;
        for (let i = 0; i < 4; i++) {
          rotatedData.data[targetIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }

    this.canvas.width = height;
    this.canvas.height = width;
    this.ctx.putImageData(rotatedData, 0, 0);
  }

  public rotateRight() {
    const { width, height } = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const rotatedData = new ImageData(height, width);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = (x * height + (height - y - 1)) * 4;
        for (let i = 0; i < 4; i++) {
          rotatedData.data[targetIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }

    this.canvas.width = height;
    this.canvas.height = width;
    this.ctx.putImageData(rotatedData, 0, 0);
  }

  public flipX() {
    const { width, height } = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const flippedData = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = (y * width + (width - x - 1)) * 4;
        for (let i = 0; i < 4; i++) {
          flippedData.data[targetIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }

    this.ctx.putImageData(flippedData, 0, 0);
  }

  public flipY() {
    const { width, height } = this.ctx.canvas;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const flippedData = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sourceIndex = (y * width + x) * 4;
        const targetIndex = ((height - y - 1) * width + x) * 4;
        for (let i = 0; i < 4; i++) {
          flippedData.data[targetIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }

    this.ctx.putImageData(flippedData, 0, 0);
  }
}
