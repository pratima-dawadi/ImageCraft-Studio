import { ButtonStyle } from "./styling/ButtonStyle";

export class ButtonEditing {
  constructor() {
    const undoButtonElement = document.querySelector(
      ".undo"
    ) as HTMLButtonElement;
    const undoButton = new ButtonStyle(undoButtonElement);
    undoButton.setStyle("black", "#a8ea9a", "1rem");
    undoButton.setWidth("90%");

    const redoButtonElement = document.querySelector(
      ".redo"
    ) as HTMLButtonElement;
    const redoButton = new ButtonStyle(redoButtonElement);
    redoButton.setStyle("black", "#a8ea9a", "1rem");
    redoButton.setWidth("90%");

    const resetButtonElement = document.querySelector(
      ".reset"
    ) as HTMLButtonElement;
    const resetButton = new ButtonStyle(resetButtonElement);
    resetButton.setStyle("black", "#e8a3a3", "0.9rem");
    resetButton.setWidth("100%");

    const textButtonElement = document.querySelector(
      ".text__button"
    ) as HTMLButtonElement;
    const textButton = new ButtonStyle(textButtonElement);
    textButton.setStyle("black", "lightgrey", "1rem");
    textButton.setWidth("40%");
  }
}
