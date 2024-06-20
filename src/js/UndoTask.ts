import { ImageAdjustment } from "./ImageAdjustment";
import { ImageFilter } from "./ImageFilter";
import { ImageTransform } from "./ImageTransform";

/**
 * @class UndoTask - For undoing and redoing the changes
 */
export class UndoTask {
  private imageFilter: ImageFilter;
  private imageAdjustment: ImageAdjustment;
  private imageTransform: ImageTransform;
  public undoList: string[] = [];
  public redoList: string[] = [];

  constructor(
    imageFilter: ImageFilter,
    imageAdjustment: ImageAdjustment,
    imageTransform: ImageTransform
  ) {
    this.imageFilter = imageFilter;
    this.imageAdjustment = imageAdjustment;
    this.imageTransform = imageTransform;
    this.imageFilter.setUndoTask(this);
    this.imageAdjustment.setUndoTask(this);
    this.imageTransform.setUndoTask(this);

    this.undoButtonEventListener();
    this.redoButtonEventListener();
    this.historyPanel();
  }

  private undoButtonEventListener() {
    const undoButton = document.querySelector(".undo");
    if (undoButton) {
      undoButton.addEventListener("click", () => {
        this.undo();
      });
    }
  }

  private redoButtonEventListener() {
    const redoButton = document.querySelector(".redo");
    if (redoButton) {
      redoButton.addEventListener("click", () => {
        this.redo();
      });
    }
  }

  private undo() {
    console.log(`undoList: ${this.undoList}`);
    console.log(`will call undo on ${this.undoList[this.undoList.length - 1]}`);
    switch (this.undoList[this.undoList.length - 1]) {
      case "filter":
        this.imageFilter.undo();
        break;
      case "transform":
        this.imageTransform.undo();
        break;
      case "adjustment":
        this.imageAdjustment.undo();
        break;
    }
    if (this.undoList.length > 0) {
      // this.redoList.push(this.undoList[this.undoList.length - 1] || "");
      this.undoList.pop();
      this.historyPanel();
    }
  }

  private redo() {
    if (this.redoList.length > 0) {
      console.log(`redoList: ${this.redoList}`);
      console.log(
        `will call redo on ${this.redoList[this.redoList.length - 1]}`
      );

      switch (this.redoList[this.redoList.length - 1]) {
        case "filter":
          this.imageFilter.redo();
          break;
        case "transform":
          this.imageTransform.redo();
          break;
        case "adjustment":
          this.imageAdjustment.redo();
          break;
      }
      // this.undoList.push(this.redoList[this.redoList.length - 1] || "");
      this.redoList.pop();
      this.historyPanel();
    }
  }
  historyPanel() {
    const historyElement = document.querySelector(".history-list");
    if (historyElement) {
      historyElement.innerHTML = `
        <div>Undo List: ${this.undoList.join(", ")}</div>
        <div>Redo List: ${this.redoList.join(", ")}</div>
      `;
    }
  }
}
