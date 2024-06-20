import { UndoTask } from "./UndoTask";

export class ImageTransform {
  private imgSrc: HTMLImageElement;
  private ROTATE = 0;
  private FLIPX = 1;
  private FLIPY = 1;
  private transformHistory: string[] = [];
  private undoTask: UndoTask | null = null;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;
    this.transformButtonsEventListeners();
  }

  public setUndoTask(undoTask: UndoTask) {
    this.undoTask = undoTask;
  }

  private transformButtonsEventListeners() {
    const transformButtons = document.querySelectorAll(
      ".icons__collection2 button"
    );
    transformButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.updateTransform(button.id);
      });
    });
  }

  private updateTransform(transformType: string) {
    this.transformHistory.push(this.imgSrc.style.transform);

    if (this.undoTask) {
      this.undoTask.undoList.push("transform");
    }

    switch (transformType) {
      case "rotateLeft":
        this.ROTATE -= 90;
        break;
      case "rotateRight":
        this.ROTATE += 90;
        break;
      case "flipX":
        this.FLIPX = this.FLIPX === 1 ? -1 : 1;
        break;
      case "flipY":
        this.FLIPY = this.FLIPY === 1 ? -1 : 1;
        break;
    }
    this.imgSrc.style.transform = `rotate(${this.ROTATE}deg) scaleX(${this.FLIPX}) scaleY(${this.FLIPY})`;
  }

  undo() {
    if (this.transformHistory.length > 0) {
      this.imgSrc.style.transform = this.transformHistory.pop() || "";
    }
  }
}
