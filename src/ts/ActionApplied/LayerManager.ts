export class LayerManager {
  private layers: HTMLCanvasElement[] = [];
  private currentLayerIndex = 0;

  constructor(private baseCanvas: HTMLCanvasElement) {
    this.addLayer();
  }

  addLayer() {
    const newLayer = document.createElement("canvas");
    newLayer.width = this.baseCanvas.width;
    newLayer.height = this.baseCanvas.height;
    this.layers.push(newLayer);
    this.currentLayerIndex = this.layers.length - 1;
  }

  removeLayer() {
    if (this.layers.length > 1) {
      this.layers.splice(this.currentLayerIndex, 1);
      this.currentLayerIndex = Math.max(0, this.currentLayerIndex - 1);
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
}
