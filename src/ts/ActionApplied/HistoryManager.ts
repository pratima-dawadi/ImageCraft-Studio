/**
 * @class HistoryManager- to manage the history of the canvas and also handle the undo and redo functionality
 */
export class HistoryManager {
  public undoStack: ImageData[] = [];
  private redoStack: ImageData[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * @method saveState - Method to save the current state of the canvas
   */
  saveState() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
    this.undoStack.push(imageData);
    this.redoStack = [];
  }

  /**
   * @method undo - Method to undo the last action performed on the canvas
   */
  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(previousState, 0, 0);
    }
  }

  /**
   * @method redo - Method to redo the last action performed on the canvas
   */
  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.putImageData(nextState, 0, 0);
    }
  }
}
