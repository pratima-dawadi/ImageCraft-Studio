export default function image() {
  const imageUploadButton = document.querySelector(
    ".choose__img button"
  ) as HTMLButtonElement;
  const imageUploadInput = document.querySelector(
    ".choose__img input"
  ) as HTMLInputElement;
  const imagePreview = document.querySelector(
    ".view-image img"
  ) as HTMLImageElement;
  const takeImageButton = document.querySelector(
    ".take__image"
  ) as HTMLButtonElement;
  const captureImageButton = document.querySelector(
    ".capture__image"
  ) as HTMLButtonElement;
  const videoElement = document.querySelector("#video") as HTMLVideoElement;

  const editPanel = document.querySelector(".edit-panel") as HTMLElement;
  imageUploadButton.addEventListener("click", () => imageUploadInput.click());
  imageUploadInput.addEventListener("change", () => {
    let image_arrays = imageUploadInput.files;
    if (image_arrays) {
      let image = image_arrays[0];
      imagePreview.src = URL.createObjectURL(image);
      imagePreview.addEventListener("load", () => {
        editPanel.classList.remove("disabled");
      });
    }
  });

  takeImageButton.addEventListener("click", () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        videoElement.style.display = "block";
        imagePreview.style.display = "none";
        captureImageButton.style.display = "block";
        videoElement.play();
      })
      .catch((error) => {
        console.error(error);
      });
  });

  captureImageButton.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      imagePreview.src = canvas.toDataURL("image/png");
      imagePreview.style.display = "block";
      videoElement.style.display = "none";
      captureImageButton.style.display = "none";
      editPanel.classList.remove("disabled");
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  });
}
