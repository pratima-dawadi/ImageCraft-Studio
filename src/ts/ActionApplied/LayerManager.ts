// export class LayerManager {
//   private layers: HTMLCanvasElement[] = [];
//   private currentLayerIndex = 0;

//   constructor(private baseCanvas: HTMLCanvasElement) {
//     this.addLayer();
//   }

//   addLayer() {
//     const newLayer = document.createElement("canvas");
//     newLayer.width = this.baseCanvas.width;
//     newLayer.height = this.baseCanvas.height;
//     this.layers.push(newLayer);
//     this.currentLayerIndex = this.layers.length - 1;
//   }

//   removeLayer() {
//     if (this.layers.length > 1) {
//       this.layers.splice(this.currentLayerIndex, 1);
//       this.currentLayerIndex = Math.max(0, this.currentLayerIndex - 1);
//     }
//   }

//   setCurrentLayer(index: number) {
//     if (index >= 0 && index < this.layers.length) {
//       this.currentLayerIndex = index;
//     }
//   }

//   getCurrentLayer(): CanvasRenderingContext2D {
//     return this.layers[this.currentLayerIndex].getContext("2d")!;
//   }

//   composeLayers() {
//     const ctx = this.baseCanvas.getContext("2d")!;
//     ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
//     this.layers.forEach((layer) => {
//       ctx.drawImage(layer, 0, 0);
//     });
//   }

//   getLayers() {
//     return this.layers;
//   }
// }
export class LayerManager {
  private layers: HTMLCanvasElement[] = [];
  private currentLayerIndex = 0;
  private baseCanvas: HTMLCanvasElement;

  constructor(baseCanvas: HTMLCanvasElement) {
    this.baseCanvas = baseCanvas;
    this.addLayer(); // Initialize with one layer
  }

  addLayer() {
    const newLayer = document.createElement("canvas");
    newLayer.width = this.baseCanvas.width;
    newLayer.height = this.baseCanvas.height;
    this.layers.push(newLayer);
    this.currentLayerIndex = this.layers.length - 1;
    this.updateLayerSelect();
  }

  removeLayer() {
    if (this.layers.length > 1) {
      this.layers.splice(this.currentLayerIndex, 1);
      this.currentLayerIndex = Math.max(0, this.currentLayerIndex - 1);
      this.updateLayerSelect();
    }
  }

  setCurrentLayer(index: number) {
    if (index >= 0 && index < this.layers.length) {
      this.currentLayerIndex = index;
    }
  }

  getCurrentLayer(): CanvasRenderingContext2D {
    return this.layers[this.currentLayerIndex].getContext("2d")!;
  }

  composeLayers() {
    const ctx = this.baseCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
    this.layers.forEach((layer) => {
      ctx.drawImage(layer, 0, 0);
    });
  }

  getLayers() {
    return this.layers;
  }

  private updateLayerSelect() {
    const layerSelect = document.getElementById(
      "layerSelect"
    ) as HTMLSelectElement;
    if (layerSelect) {
      layerSelect.innerHTML = "";
      this.layers.forEach((_, index) => {
        const option = document.createElement("option");
        option.value = index.toString();
        option.textContent = `Layer ${index + 1}`;
        layerSelect.appendChild(option);
      });
      layerSelect.value = this.currentLayerIndex.toString();
    }
  }

  // New method to update the base canvas with the current layer
  updateBaseCanvas() {
    const ctx = this.baseCanvas.getContext("2d")!;
    ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
    ctx.drawImage(this.layers[this.currentLayerIndex], 0, 0);
  }

  // New method to draw on the current layer
  drawOnCurrentLayer(drawFunction: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = this.getCurrentLayer();
    drawFunction(ctx);
    this.updateBaseCanvas();
  }

  // New method to clear the current layer
  clearCurrentLayer() {
    const ctx = this.getCurrentLayer();
    ctx.clearRect(0, 0, this.baseCanvas.width, this.baseCanvas.height);
    this.updateBaseCanvas();
  }

  // New method to initialize the first layer with an image
  initializeWithImage(image: HTMLImageElement) {
    const ctx = this.getCurrentLayer();
    ctx.drawImage(image, 0, 0, this.baseCanvas.width, this.baseCanvas.height);
    this.updateBaseCanvas();
  }
}
