/**
 * @class SaveImage - Class for saving the edited image
 */
export class SaveImage {
  canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public saveImage() {
    const dataURL = this.canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "edited-image.png";
    a.click();
  }
}
