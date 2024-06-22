export class ImageAdjustment {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  private getImageData(): ImageData {
    return this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  private setImageData(imageData: ImageData): void {
    this.ctx.putImageData(imageData, 0, 0);
  }

  adjustBrightness(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const brightnessAdjustment = (value - 200) / 2;

    for (let i = 0; i < data.length; i += 4) {
      data[i] += brightnessAdjustment;
      data[i + 1] += brightnessAdjustment;
      data[i + 2] += brightnessAdjustment;
    }

    this.setImageData(imageData);
  }

  adjustContrast(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const contrast = (value - 100) / 100;
    const factor = (259 * (contrast + 1)) / (255 * (1 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }

    this.setImageData(imageData);
  }

  adjustSaturation(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const saturation = value / 100;

    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray + saturation * (data[i] - gray);
      data[i + 1] = gray + saturation * (data[i + 1] - gray);
      data[i + 2] = gray + saturation * (data[i + 2] - gray);
    }

    this.setImageData(imageData);
  }

  adjustHue(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const hueRotation = (value / 360) * 2 * Math.PI;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const result = this.hueRotate([r, g, b], hueRotation);

      data[i] = result[0] * 255;
      data[i + 1] = result[1] * 255;
      data[i + 2] = result[2] * 255;
    }

    this.setImageData(imageData);
  }

  private hueRotate(rgb: number[], angle: number): number[] {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const matrix = [
      cosA + (1.0 - cosA) / 3.0,
      (1.0 / 3.0) * (1.0 - cosA) - Math.sqrt(1.0 / 3.0) * sinA,
      (1.0 / 3.0) * (1.0 - cosA) + Math.sqrt(1.0 / 3.0) * sinA,
      (1.0 / 3.0) * (1.0 - cosA) + Math.sqrt(1.0 / 3.0) * sinA,
      cosA + (1.0 / 3.0) * (1.0 - cosA),
      (1.0 / 3.0) * (1.0 - cosA) - Math.sqrt(1.0 / 3.0) * sinA,
      (1.0 / 3.0) * (1.0 - cosA) - Math.sqrt(1.0 / 3.0) * sinA,
      (1.0 / 3.0) * (1.0 - cosA) + Math.sqrt(1.0 / 3.0) * sinA,
      cosA + (1.0 / 3.0) * (1.0 - cosA),
    ];

    const r = rgb[0] * matrix[0] + rgb[1] * matrix[1] + rgb[2] * matrix[2];
    const g = rgb[0] * matrix[3] + rgb[1] * matrix[4] + rgb[2] * matrix[5];
    const b = rgb[0] * matrix[6] + rgb[1] * matrix[7] + rgb[2] * matrix[8];

    return [r, g, b];
  }

  adjustBlur(value: number) {
    const imageData = this.getImageData();
    const blurredData = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < imageData.width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          count = 0;
        for (let dy = -value; dy <= value; dy++) {
          for (let dx = -value; dx <= value; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (
              nx >= 0 &&
              nx < imageData.width &&
              ny >= 0 &&
              ny < imageData.height
            ) {
              const i = (ny * imageData.width + nx) * 4;
              r += imageData.data[i];
              g += imageData.data[i + 1];
              b += imageData.data[i + 2];
              a += imageData.data[i + 3];
              count++;
            }
          }
        }
        const i = (y * imageData.width + x) * 4;
        blurredData.data[i] = r / count;
        blurredData.data[i + 1] = g / count;
        blurredData.data[i + 2] = b / count;
        blurredData.data[i + 3] = a / count;
      }
    }

    this.setImageData(blurredData);
  }

  adjustOpacity(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const opacity = value / 100;

    for (let i = 3; i < data.length; i += 4) {
      data[i] *= opacity;
    }

    this.setImageData(imageData);
  }

  adjustInvert(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const invert = value / 100;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = (255 - data[i]) * invert + data[i] * (1 - invert);
      data[i + 1] = (255 - data[i + 1]) * invert + data[i + 1] * (1 - invert);
      data[i + 2] = (255 - data[i + 2]) * invert + data[i + 2] * (1 - invert);
    }

    this.setImageData(imageData);
  }

  adjustGrayscale(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const grayscale = value / 100;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg * grayscale + data[i] * (1 - grayscale);
      data[i + 1] = avg * grayscale + data[i + 1] * (1 - grayscale);
      data[i + 2] = avg * grayscale + data[i + 2] * (1 - grayscale);
    }

    this.setImageData(imageData);
  }

  adjustSepia(value: number) {
    const imageData = this.getImageData();
    const data = imageData.data;
    const sepia = value / 100;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      data[i] = Math.min(
        255,
        r * (1 - 0.607 * sepia) + g * (0.769 * sepia) + b * (0.189 * sepia)
      );
      data[i + 1] = Math.min(
        255,
        r * (0.349 * sepia) + g * (1 - 0.314 * sepia) + b * (0.168 * sepia)
      );
      data[i + 2] = Math.min(
        255,
        r * (0.272 * sepia) + g * (0.534 * sepia) + b * (1 - 0.869 * sepia)
      );
    }

    this.setImageData(imageData);
  }
}
