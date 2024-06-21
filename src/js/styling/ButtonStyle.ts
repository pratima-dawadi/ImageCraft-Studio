export class ButtonStyle {
  private button: HTMLButtonElement;

  constructor(button: HTMLButtonElement) {
    this.button = button;
    this.setStyle("white", "blue", "1rem");
    this.setWidth("50%");
  }

  public setStyle(color: string, backgroundColor: string, fontSize: string) {
    this.button.style.backgroundColor = backgroundColor;
    this.button.style.color = color;
    this.button.style.padding = "10px 20px";
    this.button.style.fontSize = fontSize;
    this.button.style.cursor = "pointer";
    this.button.style.border = "none";
    this.button.style.textAlign = "center";
  }

  public setWidth(buttonWidth: string) {
    this.button.style.width = buttonWidth;
  }
}
