import { ImageAdjustment } from "./ImageAdjustment";
import { ImageTransform } from "./ImageTransform";
import { ImageFilter } from "./ImageFilter";
import { ResizeCrop } from "./ResizeCrop";
import { ImageCollage } from "./ImageCollage";
import { TextShape } from "./TextShape";
import { ImageShape } from "./ImageShape";
import { UndoTask } from "./UndoTask";
import { InsertText } from "./InsertText";

export class ImageEditing {
  constructor() {
    const imgSrc = document.querySelector(
      ".view-image img"
    ) as HTMLImageElement;
    const slider = document.querySelector(".slider input") as HTMLInputElement;
    const sliderName = document.querySelector(
      ".filter__info .name"
    ) as HTMLElement;
    const sliderValue = document.querySelector(
      ".filter__info .value"
    ) as HTMLElement;
    const imageAdjustment = new ImageAdjustment(
      imgSrc,
      slider,
      sliderName,
      sliderValue
    );
    const imageTransform = new ImageTransform(imgSrc);
    new ResizeCrop(imgSrc);
    const imageFilter = new ImageFilter(imgSrc);
    new ImageCollage();
    new ImageShape(imgSrc);
    new UndoTask(imageFilter, imageAdjustment, imageTransform);
    new TextShape(imgSrc);
    new InsertText(imgSrc);
  }
}
