import { ImageHandler } from "./ts/Image";
import { ImageAdjustment } from "./ts/ImageAdjustment";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const middlePanel = document.querySelector(".image__space") as HTMLDivElement;
canvas.width = middlePanel.clientWidth;
canvas.height = middlePanel.clientHeight;

const imageHandler = new ImageHandler(canvas, ctx);
imageHandler.drawImage();

const originalImage = new Image();
originalImage.onload = () => {
  ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
  new ImageAdjustment(ctx, originalImage);
};
originalImage.src = "./src/images/thumbnail.png";
new ImageAdjustment(ctx, originalImage);
