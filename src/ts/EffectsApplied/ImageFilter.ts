/**
 * @class ImageFilter - Apply filter to the images
 */
export class ImageFilter {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public moonFilter() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      const avg = (red + green + blue) / 3;
      data[i] = avg > 128 ? red + 10 : red - 10;
      data[i + 1] = avg > 128 ? green + 10 : green - 10;
      data[i + 2] = avg > 128 ? blue + 20 : blue - 20;

      data[i] = Math.min(255, Math.max(0, data[i]));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
    }
    this.ctx.putImageData(imageData, 0, 0);
  }

  public hudsonFilter() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] += 20;
      data[i + 1] += 20;
      data[i + 2] -= 20;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
  public retroFilter() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const tr = 0.393 * data[i] + 0.769 * data[i + 1] + 0.189 * data[i + 2];
      const tg = 0.349 * data[i] + 0.686 * data[i + 1] + 0.168 * data[i + 2];
      const tb = 0.272 * data[i] + 0.534 * data[i + 1] + 0.131 * data[i + 2];

      data[i] = Math.min(255, tr);
      data[i + 1] = Math.min(255, tg);
      data[i + 2] = Math.min(255, tb);
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
  public blackAndWhiteFilter() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
}
