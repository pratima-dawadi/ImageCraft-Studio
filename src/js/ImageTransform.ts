import { UndoTask } from "./UndoTask";

/**
 * @class ImageTransform - For rotating and flipping the image
 */
export class ImageTransform {
  private imgSrc: HTMLImageElement;
  private ROTATE = 0;
  private FLIPX = 1;
  private FLIPY = 1;
  private transformHistory: string[] = [];
  private redoHistory: string[] = [];
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

  /**
   * @public updateTransform - For rotating and flipping the image
   * @param transformType - transform type to be applied
   */

  private updateTransform(transformType: string) {
    this.transformHistory.push(this.imgSrc.style.transform);

    const historyElement = document.querySelector(".history-list");
    if (historyElement) {
      historyElement.innerHTML += `<li>Transform: ${transformType}</li>`;
    }

    this.redoHistory = [];

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

  /**
   * @public undo - For undoing the last transformation
   */

  undo() {
    // if (this.transformHistory.length > 0) {
    //   this.imgSrc.style.transform = this.transformHistory.pop() || "";
    // }
    if (this.transformHistory.length > 0) {
      const lastTransform = this.transformHistory.pop() || "";
      this.redoHistory.push(this.imgSrc.style.transform);
      this.imgSrc.style.transform = lastTransform;
      if (this.undoTask) {
        this.undoTask.redoList.push("transform");
      }
    }
  }

  /**
   * @public redo - For redoing the last transformation
   */
  redo() {
    if (this.redoHistory.length > 0) {
      const lastRedo = this.redoHistory.pop() || "";
      this.transformHistory.push(this.imgSrc.style.transform);
      this.imgSrc.style.transform = lastRedo;
      if (this.undoTask) {
        this.undoTask.undoList.push("transform");
      }
    }
  }
}
