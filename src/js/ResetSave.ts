import { ImageCollage } from "./ImageCollage";
export class ResetSave {
  private imgSrc: HTMLImageElement;
  private saveButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;

  private originalFilters: string;
  private originalTransform: string;
  private imageCollageInstance: ImageCollage;

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
    this.imageCollageInstance = new ImageCollage(imgSrc);

    this.addEventListeners();
  }

  private addEventListeners() {
    this.saveButton.addEventListener("click", this.saveImage.bind(this));
    this.resetButton.addEventListener("click", this.resetImage.bind(this));
  }

  private resetImage() {
    this.imgSrc.style.filter = this.originalFilters;
    this.imgSrc.style.transform = this.originalTransform;
    this.imgSrc.style.clipPath = "none";
  }

  private saveImage() {
    const link = document.createElement("a");
    link.download = "edited-image.png";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = this.imgSrc.naturalWidth;
    canvas.height = this.imgSrc.naturalHeight;

    ctx.filter = this.imgSrc.style.filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
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
    ctx.drawImage(
      this.imgSrc,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    link.href = canvas.toDataURL();
    link.click();
  }
}
