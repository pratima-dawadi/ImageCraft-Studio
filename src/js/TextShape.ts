export class TextShape {
  private imgSrc: HTMLImageElement;
  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.filterButtonsEventListeners();
  }
  private filterButtonsEventListeners() {
    const filterButtons = document.querySelectorAll(
      ".icons__collection6 button"
    );
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.makeShape(button.id);
      });
    });
  }

  private makeShape(shape: string) {
    switch (shape) {
      case "rectangle": {
    
        break;
      }
    }
  }
}
