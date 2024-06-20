import image from "./js/image";
import { ImageAdjustment } from "./js/ImageAdjustment";
import { ImageTransform } from "./js/ImageTransform";
import { ResetSave } from "./js/ResetSave";
import { ImageFilter } from "./js/ImageFilter";
import { ResizeCrop } from "./js/ResizeCrop";
import { ImageCollage } from "./js/ImageCollage";
import { TextShape } from "./js/TextShape";
import { ImageShape } from "./js/ImageShape";
import { UndoTask } from "./js/UndoTask";

image();

const imgSrc = document.querySelector(".view-image img") as HTMLImageElement;
const slider = document.querySelector(".slider input") as HTMLInputElement;
const sliderName = document.querySelector(".filter__info .name") as HTMLElement;
const sliderValue = document.querySelector(
  ".filter__info .value"
) as HTMLElement;
const resetButton = document.querySelector(".reset") as HTMLButtonElement;
const saveButton = document.querySelector(".save") as HTMLButtonElement;
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
new ResetSave(imgSrc, saveButton, resetButton);
new TextShape(imgSrc);
new UndoTask(imageFilter, imageAdjustment, imageTransform);
