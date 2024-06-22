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
      this.ctx.drawImage(
        this.currentImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.historyManager.saveState();
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
        this.setSliderValues(button.id);
      });
    });
  }

  private setSliderValues(filterType: string) {
    switch (filterType) {
      case "Brightness":
        this.slider.max = "400";
        this.slider.value = this.constants.BRIGHTNESS;
        this.sliderValue.innerText = `${this.constants.BRIGHTNESS}`;
        break;
      case "Contrast":
        this.slider.max = "200";
        this.slider.value = this.constants.CONTRAST;
        this.sliderValue.innerText = `${this.constants.CONTRAST}`;
        break;
      case "Saturation":
        this.slider.max = "200";
        this.slider.value = this.constants.SATURATION;
        this.sliderValue.innerText = `${this.constants.SATURATION}`;
        break;
      case "Sepia":
        this.slider.max = "100";
        this.slider.value = this.constants.SEPIA;
        this.sliderValue.innerText = `${this.constants.SEPIA}`;
        break;
      case "Hue":
        this.slider.max = "360";
        this.slider.value = this.constants.HUE;
        this.sliderValue.innerText = `${this.constants.HUE}`;
        break;
      case "Blur":
        this.slider.max = "10";
        this.slider.value = this.constants.BLUR;
        this.sliderValue.innerText = `${this.constants.BLUR}`;
        break;
      case "Opacity":
        this.slider.max = "100";
        this.slider.value = this.constants.OPACITY;
        this.sliderValue.innerText = `${this.constants.OPACITY}`;
        break;
      case "Grayscale":
        this.slider.max = "100";
        this.slider.value = this.constants.GRAYSCALE;
        this.sliderValue.innerText = `${this.constants.GRAYSCALE}`;
        break;
      case "Invert":
        this.slider.max = "100";
        this.slider.value = this.constants.INVERT;
        this.sliderValue.innerText = `${this.constants.INVERT}`;
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
    // this.drawImageOnCanvas();
    adjustmentFunction();
    this.historyManager.saveState();
    this.updateHistoryList();
  }

  public filterEventListeners() {
    const moonfilterButton = document.querySelector(
      "#moon"
    ) as HTMLButtonElement;
    moonfilterButton.addEventListener("click", () => {
      this.imageFilter.moonFilter();
      this.historyManager.saveState();
    });

    const hudsonfilterButton = document.querySelector(
      "#hudson"
    ) as HTMLButtonElement;
    hudsonfilterButton.addEventListener("click", () => {
      this.imageFilter.hudsonFilter();
      this.historyManager.saveState();
    });

    const retrofilterButton = document.querySelector(
      "#retro"
    ) as HTMLButtonElement;
    retrofilterButton.addEventListener("click", () => {
      this.imageFilter.retroFilter();
      this.historyManager.saveState();
    });

    const blackAndWhiteFilterButton = document.querySelector(
      "#blackwhite"
    ) as HTMLButtonElement;
    blackAndWhiteFilterButton.addEventListener("click", () => {
      this.imageFilter.blackAndWhiteFilter();
      this.historyManager.saveState();
    });
  }

  public transformEventListeners() {
    const rotateLeftButton = document.querySelector(
      "#rotateLeft"
    ) as HTMLButtonElement;
    rotateLeftButton.addEventListener("click", () => {
      this.imageTransform.rotateLeft();
      this.historyManager.saveState();
    });

    const rotateRightButton = document.querySelector(
      "#rotateRight"
    ) as HTMLButtonElement;
    rotateRightButton.addEventListener("click", () => {
      this.imageTransform.rotateRight();
      this.historyManager.saveState();
    });

    const flipHorizontalButton = document.querySelector(
      "#flipX"
    ) as HTMLButtonElement;
    flipHorizontalButton.addEventListener("click", () => {
      this.imageTransform.flipX();
      this.historyManager.saveState();
    });

    const flipVerticalButton = document.querySelector(
      "#flipY"
    ) as HTMLButtonElement;
    flipVerticalButton.addEventListener("click", () => {
      this.imageTransform.flipY();
      this.historyManager.saveState();
    });
  }

  public resetSaveEventListeners() {
    const resetButton = document.querySelector(".reset") as HTMLButtonElement;
    resetButton.addEventListener("click", () => {
      this.drawImageOnCanvas();
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

      console.log(width, height);
      if (width > 0 && height > 0) {
        this.imageResize.resize(width, height);
        this.historyManager.saveState();
      }
    });

    this.cropButton.addEventListener("click", () => {
      this.cropImage.checkActive();
      // this.historyManager.saveState();
    });
  }

  imageShapeEventListeners() {
    const shapeButtons = document.querySelectorAll(".photo-shapes button");
    shapeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.imageShape.fitImageInShape(
          button.id as "heart" | "circle" | "triangle" | "rhombus" | "star"
        );
        this.historyManager.saveState();
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
      const x = this.canvas.width / 4;
      const y = this.canvas.height / 4;
      const width = this.canvas.width / 2;
      const height = this.canvas.height / 2;
      this.shapeInserter.insertRectangle(
        x,
        y,
        width,
        height,
        "rgba(255, 0, 0, 0.5)"
      );
      this.historyManager.saveState();
    });

    triangleBtn.addEventListener("click", () => {
      const x1 = this.canvas.width / 2;
      const y1 = this.canvas.height / 4;
      const x2 = this.canvas.width / 4;
      const y2 = (this.canvas.height * 3) / 4;
      const x3 = (this.canvas.width * 3) / 4;
      const y3 = (this.canvas.height * 3) / 4;
      this.shapeInserter.insertTriangle(
        x1,
        y1,
        x2,
        y2,
        x3,
        y3,
        "rgba(0, 255, 0, 0.5)"
      );
      this.historyManager.saveState();
    });

    circleBtn.addEventListener("click", () => {
      const x = this.canvas.width / 2;
      const y = this.canvas.height / 2;
      const radius = Math.min(this.canvas.width, this.canvas.height) / 4;
      this.shapeInserter.insertCircle(x, y, radius, "rgba(0, 0, 255, 0.5)");
      this.historyManager.saveState();
    });

    textBtn.addEventListener("click", () => {
      this.textInserter.insertText(
        textInput.value,
        this.canvas.width / 2,
        this.canvas.height / 2,
        textFont.value,
        textColor.value
      );
      this.historyManager.saveState();
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
    const layerSelect = document.getElementById(
      "layerSelect"
    ) as HTMLSelectElement;

    addLayerBtn.addEventListener("click", () => {
      console.log("add layer button clicked");
      this.layerManager.addLayer();
      this.updateLayerSelect();
    });

    removeLayerBtn.addEventListener("click", () => {
      console.log("remove layer button clicked");
      this.layerManager.removeLayer();
      this.updateLayerSelect();
    });

    layerSelect.addEventListener("change", () => {
      console.log("layer select changed");
      this.layerManager.setCurrentLayer(parseInt(layerSelect.value));
    });
  }

  updateLayerSelect() {}

  updateHistoryList() {
    // const historyElement = document.querySelector(".history-list");
    // if (historyElement) {
    //   historyElement.innerHTML += `<li>${this.historyManager.undoStack}</li>`;
    // }
  }

  photoCollageEventListeners() {
    this.photoCollageButton?.addEventListener("click", () => {
      this.photoCollage.makeCollage();
      this.historyManager.saveState();
    });
  }
}
