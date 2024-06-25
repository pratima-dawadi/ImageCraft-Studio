/**
 * @class HistoryManager- to manage the history of the canvas and also handle the undo and redo functionality
 */
export class HistoryManager {
  public undoStack: {
    imageData: ImageData;
    width: number;
    height: number;
    apply: string;
  }[] = [];
  public redoStack: {
    imageData: ImageData;
    width: number;
    height: number;
    apply: string;
  }[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * @method saveState - Method to save the current state of the canvas
   */
  saveState(apply: string) {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    this.undoStack.push({
      imageData,
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
      apply: apply,
    });
    this.redoStack = [];
    this.updateHistoryPanel();
  }

  /**
   * @method undo - Method to undo the last action performed on the canvas
   */
  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.ctx.canvas.width = previousState.width;
      this.ctx.canvas.height = previousState.height;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(previousState.imageData, 0, 0);
      this.updateHistoryPanel();
    }
  }

  /**
   * @method redo - Method to redo the last action performed on the canvas
   */
  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.ctx.canvas.width = nextState.width;
      this.ctx.canvas.height = nextState.height;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(nextState.imageData, 0, 0);
      this.updateHistoryPanel();
    }
  }
  updateHistoryPanel() {
    const historyPanel = document.querySelector(".history-list");
    if (historyPanel) {
      historyPanel.innerHTML = "";
      this.undoStack.forEach((state, index) => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.innerHTML = `${index + 1} - ${state.apply}`;
        historyPanel.appendChild(historyItem);
      });
    }
  }
}
