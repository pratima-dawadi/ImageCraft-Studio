export class ResizeCrop {
  private imgSrc: HTMLImageElement;
  private isDragging: Boolean;
  private startX: number;
  private startY: number;
  private cropX: number;
  private cropY: number;
  private cropWidth: number;
  private cropHeight: number;
  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.cropX = 0;
    this.cropY = 0;
    this.cropWidth = 0;
    this.cropHeight = 0;
    this.CropEventListeners();
    this.ResizeEventListeners();
  }

  private ResizeEventListeners() {
    const imageWidth = document.querySelector("#width") as HTMLInputElement;
    const imageHeight = document.querySelector("#height") as HTMLInputElement;
    imageWidth.value = this.imgSrc.width.toString();
    imageHeight.value = this.imgSrc.height.toString();

    if (imageWidth && imageHeight) {
      imageWidth.addEventListener("input", () => this.updateSize());
      imageHeight.addEventListener("input", () => this.updateSize());
    }
  }
  private updateSize() {
    const imageWidth = document.querySelector("#width") as HTMLInputElement;
    const imageHeight = document.querySelector("#height") as HTMLInputElement;

    if (imageWidth && imageHeight) {
      const newWidth = parseInt(imageWidth.value);
      const newHeight = parseInt(imageHeight.value);

      if (!isNaN(newWidth) && newWidth > 0) {
        this.imgSrc.width = newWidth;
      }

      if (!isNaN(newHeight) && newHeight > 0) {
        this.imgSrc.height = newHeight;
      }
    }
  }

  CropEventListeners() {
    const cropButton = document.querySelector("#crop") as HTMLButtonElement;
    cropButton.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      const cropWidth = 300;
      const cropHeight = 300;
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      ctx.drawImage(
        this.imgSrc,
        0,
        0,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      this.imgSrc.src = canvas.toDataURL("image/png");
    });
  }
}