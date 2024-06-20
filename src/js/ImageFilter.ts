import { UndoTask } from "./UndoTask";

/**
 * @class ImageFilter- For applying different filters to the image
 */
export class ImageFilter {
  private imgSrc: HTMLImageElement;
  private filterHistory: string[] = [];
  private redoHistory: string[] = [];
  private undoTask: UndoTask | null = null;

  constructor(imgSrc: HTMLImageElement) {
    this.imgSrc = imgSrc;

    this.filterButtonsEventListeners();
  }

  public setUndoTask(undoTask: UndoTask) {
    this.undoTask = undoTask;
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

  /**
   * @public updateFilter - For applying different filters to the image
   * @param filter - filter type to be applied
   */

  updateFilter(filter: string) {
    this.filterHistory.push(this.imgSrc.style.filter);

    const historyElement = document.querySelector(".history-list");
    if (historyElement) {
      historyElement.innerHTML += `<li>Filter: ${filter}</li>`;
    }

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
    this.redoHistory = [];
    if (this.undoTask) {
      this.undoTask.undoList.push("filter");
    }
  }

  /**
   * @public undo - Function to undo the last filter applied
   */

  undo() {
    if (this.filterHistory.length > 0) {
      // this.imgSrc.style.filter = this.filterHistory.pop() || "";
      // this.redoHistory.push(this.imgSrc.style.filter);
      // if (this.undoTask) {
      //   this.undoTask.redoList.push("filter");
      // }

      const lastFilter = this.filterHistory.pop() || "";
      this.redoHistory.push(this.imgSrc.style.filter);
      this.imgSrc.style.filter = lastFilter;
      if (this.undoTask) {
        this.undoTask.redoList.push("filter");
      }
    }
  }

  /**
   * @public redo - Function to redo the last filter applied
   */

  redo() {
    if (this.redoHistory.length > 0) {
      const lastRedo = this.redoHistory.pop() || "";
      this.filterHistory.push(this.imgSrc.style.filter);
      this.imgSrc.style.filter = lastRedo;
      if (this.undoTask) {
        this.undoTask.undoList.push("filter");
      }
    }
  }
}
