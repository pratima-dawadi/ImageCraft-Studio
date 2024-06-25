/**
 * @class LayerManager - For managing layers
 */
export class LayerManager {
  private layers: HTMLCanvasElement[] = [];
  private currentLayerIndex = 0;
  private baseCanvas: HTMLCanvasElement;
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  constructor(baseCanvas: HTMLCanvasElement) {
    this.baseCanvas = baseCanvas;
    this.addLayer();
    this.addEventListeners();
  }

  /**
   * @private addEventListeners - Function to listen the selected layer change event
   */
  private addEventListeners() {
    const layerSelect = document.getElementById(
      "layerSelect"
    ) as HTMLSelectElement;
    if (layerSelect) {
      layerSelect.addEventListener("change", () => {
        this.setCurrentLayer(parseInt(layerSelect.value, 10));
      });
    }
  }

  addLayer() {
    if (!this.baseCanvas.parentElement) return;
    const newLayer = document.createElement("canvas");
    const newctx: CanvasRenderingContext2D = newLayer.getContext("2d")!;
    newLayer.width = this.baseCanvas.width / 3;
    newLayer.height = this.baseCanvas.height / 2;
    newLayer.style.position = "absolute";
    newLayer.style.top = `${this.baseCanvas.height / 4}px`;
    newLayer.style.left = `${this.baseCanvas.width / 4}px`;
    newLayer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    newctx.fillStyle = "white";
    newctx.font = "30px Arial";
    newctx.fillText(`Layer ${this.layers.length + 1}`, 10, 50);
    this.baseCanvas.style.zIndex = "1";
    this.layers.push(newLayer);
    this.currentLayerIndex = this.layers.length - 1;
    this.baseCanvas.parentElement!.appendChild(newLayer);
    this.updateLayerSelect();
    this.updateLayerZIndex();
    this.LayerEventListener(newLayer);
  }

  removeLayer() {
    if (this.layers.length && this.baseCanvas.parentElement) {
      const removedLayer = this.layers.pop();
      this.baseCanvas.parentElement.removeChild(removedLayer!);
      this.currentLayerIndex = this.layers.length - 1;
      this.updateLayerSelect();
      this.updateLayerZIndex();
    }
  }

  setCurrentLayer(index: number) {
    if (index >= 0 && index < this.layers.length) {
      this.currentLayerIndex = index;
      this.updateLayerZIndex();
    }
  }

  getCurrentCanvas(): HTMLCanvasElement {
    return this.layers[this.currentLayerIndex];
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

  private updateLayerZIndex() {
    this.layers.forEach((layer, index) => {
      layer.style.zIndex = (index + 2).toString();
    });
    this.layers[this.currentLayerIndex].style.zIndex = (
      this.layers.length + 2
    ).toString();
  }

  private LayerEventListener(layer: HTMLCanvasElement) {
    layer.addEventListener("mousedown", (e) => this.onMouseDown(e));
    layer.addEventListener("mousemove", (e) => this.onMouseMove(e));
    layer.addEventListener("mouseup", () => this.onMouseUp());
    layer.addEventListener("mouseleave", () => this.onMouseUp());
  }

  private onMouseDown(event: MouseEvent) {
    const targetLayer = this.layers[this.currentLayerIndex];
    const rect = targetLayer.getBoundingClientRect();
    if (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    ) {
      this.isDragging = true;
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const targetLayer = this.layers[this.currentLayerIndex];
      const parentRect = this.baseCanvas.parentElement!.getBoundingClientRect();
      let newLeft = event.clientX - parentRect.left - this.dragOffsetX;
      let newTop = event.clientY - parentRect.top - this.dragOffsetY;

      //To make layer only draggable within the parent element
      newLeft = Math.max(
        0,
        Math.min(newLeft, parentRect.width - targetLayer.width)
      );
      newTop = Math.max(
        0,
        Math.min(newTop, parentRect.height - targetLayer.height)
      );

      targetLayer.style.left = `${newLeft}px`;
      targetLayer.style.top = `${newTop}px`;
    }
  }

  private onMouseUp() {
    this.isDragging = false;
  }
}
