export class ImageCollage {
  private imgSrc: HTMLImageElement;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.photoShapesEventListeners();
  }
  public photoShapesEventListeners() {
    const photoShapes = document.querySelectorAll(".photo-shapes button");
    photoShapes.forEach((button) => {
      button.addEventListener("click", () => {
        this.updatePhotoShape(button.id);
      });
    });
  }

  public updatePhotoShape(shape: string) {
    switch (shape) {
      case "rectangle": {
        this.imgSrc.style.clipPath = "none";
        break;
      }
      case "circle": {
        this.imgSrc.style.clipPath = "circle(50% at center)";
        break;
      }
      case "heart": {
        this.imgSrc.style.clipPath =
          "polygon(50% 15%, 61% 5%, 72% 0%, 83% 5%, 94% 15%, 100% 26%, 100% 37%, 50% 100%, 0% 37%, 0% 26%, 6% 15%, 17% 5%, 28% 0%, 39% 5%, 50% 15%)";
        break;
      }
      case "triangle": {
        this.imgSrc.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
        break;
      }
      case "rhombus": {
        this.imgSrc.style.clipPath =
          "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
        break;
      }
      case "star": {
        this.imgSrc.style.clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        break;
      }
    }
  }
}
