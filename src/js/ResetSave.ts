export class ResetSave {
  private imgSrc: HTMLImageElement;
  private saveButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;
  private cropRect: {
    startX: number;
    startY: number;
    width: number;
    height: number;
  } | null;

  private originalSrc: string;
  private originalFilters: string;
  private originalTransform: string;

  constructor(
    imgSrc: HTMLImageElement,
    saveButton: HTMLButtonElement,
    resetButton: HTMLButtonElement
  ) {
    this.imgSrc = imgSrc;
    this.saveButton = saveButton;
    this.resetButton = resetButton;
    this.originalFilters = imgSrc.style.filter;
    this.originalTransform = imgSrc.style.transform;
    this.originalSrc = imgSrc.src;
    this.cropRect = null;

    this.addEventListeners();
  }

  private addEventListeners() {
    this.saveButton.addEventListener("click", this.saveImage.bind(this));
    this.resetButton.addEventListener("click", this.resetImage.bind(this));
  }

  public setCropRect(
    startX: number,
    startY: number,
    width: number,
    height: number
  ) {
    this.cropRect = { startX, startY, width, height };
  }

  private resetImage() {
    this.imgSrc.style.filter = this.originalFilters;
    this.imgSrc.style.transform = this.originalTransform;
    this.imgSrc.style.clipPath = "none";
    this.imgSrc.src = this.originalSrc;
    this.cropRect = null;
  }

  private saveImage() {
    const link = document.createElement("a");
    link.download = "edited-image.png";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    const cropRect = this.cropRect;
    if (cropRect) {
      canvas.width = cropRect.width;
      canvas.height = cropRect.height;
    } else {
      canvas.width = this.imgSrc.naturalWidth;
      canvas.height = this.imgSrc.naturalHeight;
    }

    ctx.filter = this.imgSrc.style.filter;

    if (cropRect) {
      ctx.translate(cropRect.width / 2, cropRect.height / 2);
    } else {
      ctx.translate(canvas.width / 2, canvas.height / 2);
    }

    ctx.rotate(
      (parseFloat(
        this.imgSrc.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || "0"
      ) *
        Math.PI) /
        180
    );
    ctx.scale(
      parseFloat(
        this.imgSrc.style.transform.match(/scaleX\(([^)]+)\)/)?.[1] || "1"
      ),
      parseFloat(
        this.imgSrc.style.transform.match(/scaleY\(([^)]+)\)/)?.[1] || "1"
      )
    );

    if (cropRect) {
      ctx.drawImage(
        this.imgSrc,
        cropRect.startX,
        cropRect.startY,
        cropRect.width,
        cropRect.height,
        -cropRect.width / 2,
        -cropRect.height / 2,
        cropRect.width,
        cropRect.height
      );
    } else {
      ctx.drawImage(
        this.imgSrc,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );
    }

    link.href = canvas.toDataURL();
    link.click();
  }
}
