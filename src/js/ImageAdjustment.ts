export class ImageAdjustment {
  private imgSrc: HTMLImageElement;
  private slider: HTMLInputElement;
  private sliderName: HTMLElement;
  private sliderValue: HTMLElement;
  private BRIGHTNESS = "100";
  private CONTRAST = "100";
  private SATURATION = "100";
  private SEPIA = "0";
  private HUE = "0";
  private BLUR = "0";
  private OPACITY = "100";
  private GRAYSCALE = "0";
  private INVERT = "0";
  constructor(
    imgSrc: HTMLImageElement,
    slider: HTMLInputElement,
    sliderName: HTMLElement,
    sliderValue: HTMLElement
  ) {
    this.imgSrc = imgSrc;
    this.slider = slider;
    this.sliderName = sliderName;
    this.sliderValue = sliderValue;
    this.addIconButtonsEventListeners();
    this.addSliderEventListener();
    this.activeButtons();
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
        this.slider.value = this.BRIGHTNESS;
        this.sliderValue.innerText = `${this.BRIGHTNESS}`;
        break;
      case "Contrast":
        this.slider.max = "200";
        this.slider.value = this.CONTRAST;
        this.sliderValue.innerText = `${this.CONTRAST}`;
        break;
      case "Saturation":
        this.slider.max = "200";
        this.slider.value = this.SATURATION;
        this.sliderValue.innerText = `${this.SATURATION}`;
        break;
      case "Sepia":
        this.slider.max = "100";
        this.slider.value = this.SEPIA;
        this.sliderValue.innerText = `${this.SEPIA}`;
        break;
      case "Hue":
        this.slider.max = "360";
        this.slider.value = this.HUE;
        this.sliderValue.innerText = `${this.HUE}`;
        break;
      case "Blur":
        this.slider.max = "10";
        this.slider.value = this.BLUR;
        this.sliderValue.innerText = `${this.BLUR}`;
        break;
      case "Opacity":
        this.slider.max = "100";
        this.slider.value = this.OPACITY;
        this.sliderValue.innerText = `${this.OPACITY}`;
        break;
      case "Grayscale":
        this.slider.max = "100";
        this.slider.value = this.GRAYSCALE;
        this.sliderValue.innerText = `${this.GRAYSCALE}`;
        break;
      case "Invert":
        this.slider.max = "100";
        this.slider.value = this.INVERT;
        this.sliderValue.innerText = `${this.INVERT}`;
        break;
    }
  }
  private addSliderEventListener() {
    this.slider.addEventListener("input", () => {
      this.sliderValue.innerHTML = `${this.slider.value}%`;
      const activeButton = document.querySelector(
        ".icons .active"
      ) as HTMLElement;
      this.updateFilterValues(activeButton.id, this.slider.value);
      this.applyFilters();
    });
  }
  private updateFilterValues(filterType: string, value: string) {
    switch (filterType) {
      case "Brightness":
        this.BRIGHTNESS = value;
        break;
      case "Contrast":
        this.CONTRAST = value;
        break;
      case "Saturation":
        this.SATURATION = value;
        break;
      case "Sepia":
        this.SEPIA = value;
        break;
      case "Hue":
        this.HUE = value;
        break;
      case "Blur":
        this.BLUR = value;
        break;
      case "Opacity":
        this.OPACITY = value;
        break;
      case "Grayscale":
        this.GRAYSCALE = value;
        break;
      case "Invert":
        this.INVERT = value;
        break;
    }
  }
  private applyFilters() {
    this.imgSrc.style.filter = `
      brightness(${this.BRIGHTNESS}%)
      contrast(${this.CONTRAST}%)
      saturate(${this.SATURATION}%)
      sepia(${this.SEPIA}%)
      hue-rotate(${this.HUE}deg)
      blur(${this.BLUR}px)
      grayscale(${this.GRAYSCALE}%)
      invert(${this.INVERT}%)
      opacity(${this.OPACITY}%)
    `;
  }
}
