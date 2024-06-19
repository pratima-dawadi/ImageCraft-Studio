export class ImageHandler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageUploadButton: HTMLButtonElement;
  private imageUploadInput: HTMLInputElement;
  private imagePreview: HTMLImageElement;
  private takeImageButton: HTMLButtonElement;
  private captureImageButton: HTMLButtonElement;
  private videoElement: HTMLVideoElement;
  private editPanel: HTMLElement;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.imageUploadButton = document.querySelector(
      ".choose__img button.upload"
    ) as HTMLButtonElement;
    this.imageUploadInput = document.querySelector(
      ".choose__img input"
    ) as HTMLInputElement;
    this.imagePreview = document.querySelector(
      ".view-image img"
    ) as HTMLImageElement;
    this.takeImageButton = document.querySelector(
      ".take__image"
    ) as HTMLButtonElement;
    this.captureImageButton = document.querySelector(
      ".capture__image"
    ) as HTMLButtonElement;
    this.videoElement = document.querySelector("#video") as HTMLVideoElement;
    this.editPanel = document.querySelector(".edit-panel") as HTMLElement;

    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    this.imageUploadButton.addEventListener("click", () =>
      this.imageUploadInput.click()
    );
    this.imageUploadInput.addEventListener("change", () =>
      this.handleImageUpload()
    );
    this.takeImageButton.addEventListener("click", () =>
      this.handleTakeImage()
    );
    this.captureImageButton.addEventListener("click", () =>
      this.handleCaptureImage()
    );
  }

  private handleImageUpload() {
    const imageArrays = this.imageUploadInput.files;
    if (imageArrays) {
      const image = imageArrays[0];
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.editPanel.classList.remove("disabled");
      };
    }
  }

  private handleTakeImage() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement.srcObject = stream;
        this.videoElement.style.display = "block";
        this.imagePreview.style.display = "none";
        this.captureImageButton.style.display = "block";
        this.videoElement.play();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private handleCaptureImage() {
    const canvas = document.createElement("canvas");
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      this.imagePreview.src = dataUrl;
      this.imagePreview.style.display = "block";
      this.videoElement.style.display = "none";
      this.captureImageButton.style.display = "none";
      this.editPanel.classList.remove("disabled");

      // Draw the captured image on the main canvas
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };

      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  public drawImage() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
