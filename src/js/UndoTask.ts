import { ImageAdjustment } from "./ImageAdjustment";
import { ImageFilter } from "./ImageFilter";
import { ImageTransform } from "./ImageTransform";

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
      this.redoList.push(this.undoList[this.undoList.length - 1] || "");
      this.undoList.pop();
    }
  }

  private redo() {
    if (this.redoList.length > 0) {
      switch (this.redoList[this.redoList.length - 1]) {
        case "filter":
          this.imageFilter.redo();

          break;
      }
      this.undoList.push(this.redoList.pop() || "");
    }
  }
}
