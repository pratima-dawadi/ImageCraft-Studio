export class Rectangle {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private imageSrc: string;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.imageSrc = "";
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "blurywood";
    ctx.fill();
    ctx.stroke();

    if (this.imageSrc) {
      const img = new Image();
      img.src = this.imageSrc;
      img.onload = () => {
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
      };
    }
  }
  public isClicked(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  public setImage(ctx: CanvasRenderingContext2D, imageSrc: string) {
    this.imageSrc = imageSrc;
    if (ctx) {
      this.draw(ctx);
    }
  }
  public collidesWith(rect: Rectangle): boolean {
    return !(
      this.x + this.width < rect.x ||
      this.x > rect.x + rect.width ||
      this.y + this.height < rect.y ||
      this.y > rect.y + rect.height
    );
  }
}
