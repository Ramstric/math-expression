import { uploadFile } from "./api-upload.js";

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("file-input");

// Drag and drop an image
function initDropAreaEvents() {
  dropArea.addEventListener("dragenter", (event) => {
    event.preventDefault();
    dropArea.classList.add("drag-hover");
  });

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("drag-hover");
  });

  dropArea.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dropArea.classList.remove("drag-hover");
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("drag-hover");

    uploadFile(event.dataTransfer.files[0]); // <-- Upload the dropped file
  });
}

initDropAreaEvents();

// Manually sumbit an image
dropArea.firstElementChild.addEventListener("click", () => {
  fileInput.value = null;
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  uploadFile(event.target.files[0]); // <-- Upload the selected file
});
