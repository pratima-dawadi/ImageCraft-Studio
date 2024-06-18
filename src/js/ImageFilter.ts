export class ImageFilter {
  private imgSrc: HTMLImageElement;
  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.filterButtonsEventListeners();
  }
  private filterButtonsEventListeners() {
    const filterButtons = document.querySelectorAll(
      ".icons__collection4 button"
    );
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.updateFilter(button.id);
      });
    });
  }

  updateFilter(filter: string) {
    switch (filter) {
      case "moon": {
        this.imgSrc.style.filter =
          "grayscale(100%) contrast(100%) brightness(110%) sepia(100%)";
        break;
      }
      case "hudson": {
        this.imgSrc.style.filter = "hue-rotate(45deg) contrast(150%)";
        break;
      }
      case "gingham": {
        this.imgSrc.style.filter = "blur(1px) contrast(90%)";
        break;
      }
      case "retro": {
        this.imgSrc.style.filter = "hue-rotate(90deg) grayscale(50%)";
        break;
      }
      case "blackwhite": {
        this.imgSrc.style.filter = "grayscale(100%)";
        break;
      }
    }
  }
}
