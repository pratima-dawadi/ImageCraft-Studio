/**
 * @class ImageResize - Resize the image to the specified width and height
 */
export class ImageResize {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public resize(width: number, height: number) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempCtx.drawImage(this.ctx.canvas, 0, 0, width, height);
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  /**
   * @public crop - Crop the image to the specified rectangle
   * @param x - x-coordinate of the top-left corner of the rectangle
   * @param y - y-coordinate of the top-left corner of the rectangle
   * @param width - width of the rectangle
   * @param height - height of the rectangle
   */
  public crop(x: number, y: number, width: number, height: number) {
    const imageData = this.ctx.getImageData(x, y, width, height);
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.putImageData(imageData, 0, 0);
  }
}
