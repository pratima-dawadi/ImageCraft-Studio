export default function editButtons() {
  const iconButtons = document.querySelectorAll(".icons button");
  const slider = document.querySelector(".slider input") as HTMLInputElement;
  const sliderName = document.querySelector(
    ".filter__info .name"
  ) as HTMLElement;
  const sliderValue = document.querySelector(
    ".filter__info .value"
  ) as HTMLElement;

  const imgSrc = document.querySelector(".view-image img") as HTMLImageElement;

  let BRIGHTNESS = "100";
  let CONTRAST = "100",
    saturation = "100",
    sepia = "0",
    hue = "0",
    blur = "0",
    opacity = "100",
    grayscale = "0",
    invert = "0";
  iconButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".active")?.classList.remove("active");
      button.classList.add("active");
      sliderName.innerHTML = button.id;

      if (button.id === "Brightness") {
        slider.max = "400";
        slider.value = BRIGHTNESS;
        sliderValue.innerText = `${BRIGHTNESS}`;
      } else if (button.id === "Contrast") {
        slider.max = "200";
        slider.value = CONTRAST;
        sliderValue.innerText = `${CONTRAST}`;
      } else if (button.id === "Saturation") {
        slider.max = "200";
        slider.value = saturation;
        sliderValue.innerText = `${saturation}`;
      } else if (button.id === "Sepia") {
        slider.max = "100";
        slider.value = sepia;
        sliderValue.innerText = `${sepia}`;
      } else if (button.id === "Hue") {
        slider.max = "360";
        slider.value = hue;
        sliderValue.innerText = `${hue}`;
      } else if (button.id === "Blur") {
        slider.max = "10";
        slider.value = blur;
        sliderValue.innerText = `${blur}`;
      } else if (button.id === "Opacity") {
        slider.max = "100";
        slider.value = opacity;
        sliderValue.innerText = `${opacity}`;
      } else if (button.id === "Grayscale") {
        slider.max = "100";
        slider.value = grayscale;
        sliderValue.innerText = `${grayscale}`;
      } else if (button.id === "Invert") {
        slider.max = "100";
        slider.value = invert;
        sliderValue.innerText = `${invert}`;
      }
    });
  });

  slider.addEventListener("input", () => {
    sliderValue.innerHTML = `${slider.value}%`;
    const sliderState = document.querySelector(".icons .active")!;
    console.log(sliderState);
    console.log(sliderState.id);
    if (sliderState.id === "Brightness") {
      BRIGHTNESS = slider.value;
    } else if (sliderState.id === "Contrast") {
      CONTRAST = slider.value;
    } else if (sliderState.id === "Saturation") {
      saturation = slider.value;
    } else if (sliderState.id === "Sepia") {
      sepia = slider.value;
    } else if (sliderState.id === "Hue") {
      hue = slider.value;
    } else if (sliderState.id === "Blur") {
      blur = slider.value;
    } else if (sliderState.id === "Opacity") {
      opacity = slider.value;
    }
    imgSrc.style.filter = `brightness(${BRIGHTNESS}%) contrast(${CONTRAST}%) saturate(${saturation}%) sepia(${sepia}%) hue-rotate(${hue}deg) blur(${blur}px) grayscale(${grayscale}%) invert(${invert}%) opacity(${opacity}%)`;
  });
}
