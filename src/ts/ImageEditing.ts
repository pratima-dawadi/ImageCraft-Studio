import image from "./Image";
import { ImageFilter } from "./EffectsApplied/ImageFilter";
import { ImageTransform } from "./EffectsApplied/ImageTransform";
import { SaveImage } from "./ActionApplied/SaveImage";
import { Constants } from "./utils/constants";
import { ImageAdjustment } from "./EffectsApplied/ImageAdjustment";
import { ImageResize } from "./EffectsApplied/ImageResize";
import { ImageShape } from "./EffectsApplied/ImageShape";
import { ShapeInserter } from "./EffectsApplied/ShapeInserter";
import { TextInserter } from "./EffectsApplied/TextInserter";
import { HistoryManager } from "./ActionApplied/HistoryManager";
import { LayerManager } from "./ActionApplied/LayerManager";
import { PhotoCollage } from "./ActionApplied/PhotoCollage";
import { CropImage } from "./ActionApplied/CropImage";
import { ResetFunction } from "./ActionApplied/ResetFunction";

export class ImageEditing {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentImage: HTMLImageElement | null = null;
  private imageContainer: HTMLDivElement;
  private imageFilter: ImageFilter;
  private imageTransform: ImageTransform;
  private saveImage: SaveImage;
  private constants: Constants;
  private imageAdjustment: ImageAdjustment;
  private imageResize: ImageResize;
  private imageShape: ImageShape;
  private shapeInserter: ShapeInserter;
  private textInserter: TextInserter;
  private historyManager: HistoryManager;
  private layerManager: LayerManager;
  private photoCollage: PhotoCollage;
  private cropImage: CropImage;
  private resetFunction: ResetFunction;

  private CANVAS_WIDTH: number;
  private CANVAS_HEIGHT: number;

  imageSize = document.querySelector(".image-container") as HTMLDivElement;

  private sliderName = document.querySelector(
    ".filter__info .name"
  ) as HTMLElement;
  private sliderValue = document.querySelector(
    ".filter__info .value"
  ) as HTMLElement;
  private slider = document.querySelector(".slider input") as HTMLInputElement;

  private photoCollageButton = document.querySelector(
    ".photoCollage"
  ) as HTMLDivElement;

  private cropButton = document.querySelector("#crop") as HTMLButtonElement;

  private adjustmentName: string = "";

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;

    this.imageFilter = new ImageFilter(this.ctx);
    this.imageTransform = new ImageTransform(this.canvas, this.ctx);
    this.saveImage = new SaveImage(this.canvas);
    this.constants = new Constants();
    this.imageAdjustment = new ImageAdjustment(this.ctx);
    this.imageResize = new ImageResize(this.ctx);
    this.imageShape = new ImageShape(this.ctx);
    this.shapeInserter = new ShapeInserter(this.ctx);
    this.textInserter = new TextInserter(this.ctx);
    this.historyManager = new HistoryManager(this.ctx);
    this.layerManager = new LayerManager(this.canvas);
    this.photoCollage = new PhotoCollage(this.ctx);
    this.cropImage = new CropImage(this.ctx, this.cropButton);
    this.resetFunction = new ResetFunction();

    this.imageContainer = document.querySelector(
      ".view-image"
    ) as HTMLDivElement;

    this.CANVAS_WIDTH = this.imageSize.clientWidth;
    this.CANVAS_HEIGHT = this.imageSize.clientHeight - 100;

    this.initializeImage();
    this.activeButtons();
    this.addIconButtonsEventListeners();
    this.adjustmentEventListeners();
    this.filterEventListeners();
    this.transformEventListeners();
    this.resetSaveEventListeners();
    this.resizeCropEventListeners();
    this.imageShapeEventListeners();
    this.shapeTextInserterEventListeners();
    this.undoRedoEventListeners();
    this.layerEventListeners();
    this.photoCollageEventListeners();
    this.checksliderStack();
  }

  private initializeImage() {
    this.currentImage = image();
    this.currentImage.addEventListener("load", () => {
      this.imageContainer.innerHTML = "";
      this.drawImageOnCanvas();
      this.imageContainer.appendChild(this.canvas);
    });
  }

  private drawImageOnCanvas() {
    if (this.currentImage) {
      this.canvas.width = this.CANVAS_WIDTH;
      this.canvas.height = this.CANVAS_HEIGHT;

      const imageAspectRatio =
        this.currentImage.width / this.currentImage.height;
      const canvasAspectRatio = this.canvas.width / this.canvas.height;

      let drawWidth, drawHeight;

      if (imageAspectRatio > canvasAspectRatio) {
        drawWidth = this.canvas.width;
        drawHeight = this.canvas.width / imageAspectRatio;
      } else {
        drawHeight = this.canvas.height;
        drawWidth = this.canvas.height * imageAspectRatio;
      }

      const offsetX = (this.canvas.width - drawWidth) / 2;
      const offsetY = (this.canvas.height - drawHeight) / 2;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.currentImage,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );

      this.historyManager.saveState("Image loaded");
    }
  }

  private activeButtons() {
    const iconButtons = document.querySelectorAll(".icons button");
    iconButtons.forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(".active")?.classList.remove("active");
        button.classList.add("active");
      });
    });
  }

  private addIconButtonsEventListeners() {
    const iconButtons = document.querySelectorAll(".icons__collection1 button");
    iconButtons.forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(".active")?.classList.remove("active");
        button.classList.add("active");
        this.sliderName.innerHTML = button.id;
        this.adjustmentName = button.id;
        this.setSliderValues(button.id);
      });
    });
  }

  private setSliderValues(filterType: string) {
    switch (filterType) {
      case "Brightness":
        this.slider.max = "200";
        this.slider.value =
          this.imageAdjustment.properties.BRIGHTNESS.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.BRIGHTNESS}`;
        break;
      case "Contrast":
        this.slider.max = "200";
        this.slider.value = this.imageAdjustment.properties.CONTRAST.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.CONTRAST}`;
        break;
      case "Saturation":
        this.slider.max = "200";
        this.slider.value =
          this.imageAdjustment.properties.SATURATION.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.SATURATION}`;
        break;
      case "Sepia":
        this.slider.max = "100";
        this.slider.value = this.imageAdjustment.properties.SEPIA.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.SEPIA}`;
        break;
      case "Hue":
        this.slider.max = "360";
        this.slider.value = this.imageAdjustment.properties.HUE.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.HUE}`;
        break;
      case "Blur":
        this.slider.max = "10";
        this.slider.value = this.imageAdjustment.properties.BLUR.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.BLUR}`;
        break;
      case "Opacity":
        this.slider.max = "100";
        this.slider.value = this.imageAdjustment.properties.OPACITY.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.OPACITY}`;
        break;
      case "Grayscale":
        this.slider.max = "100";
        this.slider.value =
          this.imageAdjustment.properties.GRAYSCALE.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.GRAYSCALE}`;
        break;
      case "Invert":
        this.slider.max = "100";
        this.slider.value = this.imageAdjustment.properties.INVERT.toString();
        this.sliderValue.innerText = `${this.imageAdjustment.properties.INVERT}`;
        break;
    }
  }

  public adjustmentEventListeners() {
    this.slider.addEventListener("input", () => {
      const value = parseInt(this.slider.value);
      this.sliderValue.textContent = value.toString();

      switch (this.sliderName.textContent) {
        case "Brightness":
          this.applyAdjustment(() =>
            this.imageAdjustment.adjustBrightness(value)
          );
          break;
        case "Contrast":
          this.applyAdjustment(() =>
            this.imageAdjustment.adjustContrast(value)
          );
          break;
        case "Saturation":
          this.applyAdjustment(() =>
            this.imageAdjustment.adjustSaturation(value)
          );
          break;
        case "Sepia":
          this.applyAdjustment(() => this.imageAdjustment.adjustSepia(value));
          break;
        case "Hue":
          this.applyAdjustment(() => this.imageAdjustment.adjustHue(value));
          break;
        case "Blur":
          this.applyAdjustment(() => this.imageAdjustment.adjustBlur(value));
          break;
        case "Opacity":
          this.applyAdjustment(() => this.imageAdjustment.adjustOpacity(value));
          break;
        case "Grayscale":
          this.applyAdjustment(() =>
            this.imageAdjustment.adjustGrayscale(value)
          );
          break;
        case "Invert":
          this.applyAdjustment(() => this.imageAdjustment.adjustInvert(value));
          break;
      }
    });
  }

  private applyAdjustment(adjustmentFunction: () => void) {
    adjustmentFunction();
  }

  checksliderStack() {
    this.slider.addEventListener("click", () => {
      this.historyManager.saveState(`Applied ${this.adjustmentName}`);
    });
  }

  public filterEventListeners() {
    const moonfilterButton = document.querySelector(
      "#moon"
    ) as HTMLButtonElement;
    moonfilterButton.addEventListener("click", () => {
      this.imageFilter.moonFilter();
      this.historyManager.saveState("Applied moon filter");
    });

    const hudsonfilterButton = document.querySelector(
      "#hudson"
    ) as HTMLButtonElement;
    hudsonfilterButton.addEventListener("click", () => {
      this.imageFilter.hudsonFilter();
      this.historyManager.saveState("Applied hudson filter");
    });

    const retrofilterButton = document.querySelector(
      "#retro"
    ) as HTMLButtonElement;
    retrofilterButton.addEventListener("click", () => {
      this.imageFilter.retroFilter();
      this.historyManager.saveState("Applied retro filter");
    });

    const blackAndWhiteFilterButton = document.querySelector(
      "#blackwhite"
    ) as HTMLButtonElement;
    blackAndWhiteFilterButton.addEventListener("click", () => {
      this.imageFilter.blackAndWhiteFilter();
      this.historyManager.saveState("Applied black and white filter");
    });
  }

  public transformEventListeners() {
    const rotateLeftButton = document.querySelector(
      "#rotateLeft"
    ) as HTMLButtonElement;
    rotateLeftButton.addEventListener("click", () => {
      this.imageTransform.rotateLeft();
      this.historyManager.saveState("Rotated left");
    });

    const rotateRightButton = document.querySelector(
      "#rotateRight"
    ) as HTMLButtonElement;
    rotateRightButton.addEventListener("click", () => {
      this.imageTransform.rotateRight();
      this.historyManager.saveState("Rotated right");
    });

    const flipHorizontalButton = document.querySelector(
      "#flipX"
    ) as HTMLButtonElement;
    flipHorizontalButton.addEventListener("click", () => {
      this.imageTransform.flipX();
      this.historyManager.saveState("Flipped horizontally");
    });

    const flipVerticalButton = document.querySelector(
      "#flipY"
    ) as HTMLButtonElement;
    flipVerticalButton.addEventListener("click", () => {
      this.imageTransform.flipY();
      this.historyManager.saveState("Flipped vertically");
    });
  }

  public resetSaveEventListeners() {
    const resetButton = document.querySelector(".reset") as HTMLButtonElement;
    resetButton.addEventListener("click", () => {
      this.drawImageOnCanvas();
      this.historyManager.undoStack = [];
      this.historyManager.redoStack = [];
      this.historyManager.updateHistoryPanel();
      this.resetFunction.updateSliderOnReset(
        this.imageAdjustment,
        this.constants
      );
      this.sliderName.innerHTML = "Brightness";
      this.sliderValue.textContent = "100";
      this.slider.value = "50";
      this.layerManager.resetLayer();
    });

    const saveButton = document.querySelector(".save") as HTMLButtonElement;
    saveButton.addEventListener("click", () => {
      this.saveImage.saveImage();
    });
  }

  resizeCropEventListeners() {
    const resizeButton = document.querySelector("#resize") as HTMLButtonElement;
    const resizeWidthInput = document.getElementById(
      "width"
    ) as HTMLInputElement;
    const resizeHeightInput = document.getElementById(
      "height"
    ) as HTMLInputElement;

    resizeButton.addEventListener("click", () => {
      const width = parseInt(resizeWidthInput.value);
      const height = parseInt(resizeHeightInput.value);

      if (width > 0 && height > 0) {
        this.imageResize.resize(width, height);
        this.historyManager.saveState(`Resized to ${width}x${height}`);
      }
    });

    this.cropButton.addEventListener("click", () => {
      this.cropImage.checkActive();
      this.historyManager.saveState("Cropped image");
    });
  }

  imageShapeEventListeners() {
    const shapeButtons = document.querySelectorAll(".photo-shapes button");
    shapeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.imageShape.fitImageInShape(
          button.id as "heart" | "circle" | "triangle" | "rhombus" | "star"
        );
        this.historyManager.saveState("Fitted image in shape");
      });
    });
  }

  shapeTextInserterEventListeners() {
    const rectangleBtn = document.querySelector(
      "#shape__rectangle"
    ) as HTMLButtonElement;
    const triangleBtn = document.querySelector(
      "#shape__triangle"
    ) as HTMLButtonElement;
    const circleBtn = document.querySelector(
      "#shape__circle"
    ) as HTMLButtonElement;
    const lineBtn = document.querySelector("#shape__line") as HTMLButtonElement;
    const textBtn = document.querySelector(
      ".text__button"
    ) as HTMLButtonElement;
    const textInput = document.querySelector(
      ".text__input"
    ) as HTMLInputElement;
    const textFont = document.querySelector(".text__size") as HTMLInputElement;
    const textColor = document.querySelector(
      ".text__color"
    ) as HTMLInputElement;

    rectangleBtn.addEventListener("click", () => {
      this.shapeInserter.setShapeType("rectangle");
      this.shapeInserter.setShapeColor("rgba(255, 0, 0)");
      this.historyManager.saveState("Inserted rectangle shape");
    });

    triangleBtn.addEventListener("click", () => {
      this.shapeInserter.setShapeType("triangle");
      this.shapeInserter.setShapeColor("rgba(0, 255, 0)");
      this.historyManager.saveState("Inserted triangle shape");
    });

    circleBtn.addEventListener("click", () => {
      this.shapeInserter.setShapeType("circle");
      this.shapeInserter.setShapeColor("rgba(0, 0, 255)");
      this.historyManager.saveState("Inserted circle shape");
    });

    lineBtn.addEventListener("click", () => {
      this.shapeInserter.setShapeType("line");
      this.shapeInserter.setShapeColor("rgba(0, 0, 0)");
      this.historyManager.saveState("Inserted line");
    });

    textBtn.addEventListener("click", () => {
      this.textInserter.insertText(
        textInput.value,
        this.canvas.width / 2,
        this.canvas.height / 2,
        textFont.value,
        textColor.value
      );
      this.historyManager.saveState("Inserted text");
    });
  }

  undoRedoEventListeners() {
    const undoBtn = document.querySelector(".undo") as HTMLButtonElement;
    const redoBtn = document.querySelector(".redo") as HTMLButtonElement;

    undoBtn.addEventListener("click", () => {
      this.historyManager.undo();
    });

    redoBtn.addEventListener("click", () => {
      this.historyManager.redo();
    });
  }

  layerEventListeners() {
    const addLayerBtn = document.getElementById(
      "addLayerBtn"
    ) as HTMLButtonElement;
    const removeLayerBtn = document.getElementById(
      "removeLayerBtn"
    ) as HTMLButtonElement;

    addLayerBtn.addEventListener("click", () => {
      this.layerManager.addLayer();
    });

    removeLayerBtn.addEventListener("click", () => {
      this.layerManager.removeLayer();
    });
  }

  photoCollageEventListeners() {
    this.photoCollageButton?.addEventListener("click", () => {
      this.photoCollage.makeCollage();
      this.historyManager.saveState("Made photo collage");
    });
  }
}
