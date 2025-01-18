const dropArea = document.getElementById("dropArea");
const latex_code = document.getElementById("latex-code");
const python_code = document.getElementById("python-code");
const startButton = document.getElementById("start-bttn");
const file_input = document.getElementById("file-input");
const upload_svg = document.getElementById("upload-svg");

const url_backend = "http://127.0.0.1:5000";

let fileInput = null;
let numSegments = 0;



function fileUpload(files) {
  try {
    assertFileTypes(files[0]);
  } catch (error) {
    alert(error.message);
    return;
  }

  changeUploadState(1);

  POSTfile(files[0]);
}

function assertFileTypes(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type");
  }
}

function POSTfile(file) {
  const data = new FormData();

  data.append("file", file);

  fetch(url_backend + "/upload", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      console.log("Success:", response.json());
      setTimeout(() => changeUploadState(2, file), 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
      changeUploadState(0);
      return;
    });

  fileInput = file;
}




import { codeToHtml } from "shiki";


async function getCodePrediction() {
  const processing_div = document.getElementsByClassName("processing")[0];
  const results_div = document.getElementsByClassName("results")[0];

  await fetch(url_backend + "/process", { method: "GET" }).then((response) => {
    response.json().then((data) => {
      numSegments = data["num_segments"];
      console.log(numSegments);
    });
  });

  await fetch(url_backend + "/download?image=processed", {
    method: "GET",
  }).then((response) => {
    response.blob().then((blob) => {
      document.getElementById("img-processed").src = URL.createObjectURL(blob);
    });
  });

  await fetch(url_backend + "/download?image=contours", {
    method: "GET",
  }).then((response) => {
    response.blob().then((blob) => {
      document.getElementById("img-contours").src = URL.createObjectURL(blob);
    });
  });

  

  const segmentsContainer = document.getElementById("segments-container");

  // Clear segments container
  segmentsContainer.innerHTML = "";

  for (let i = 0; i < numSegments; i++) {
    await fetch(url_backend + "/download?image=segmented&n=" + i, {
      method: "GET",
    }).then((response) => {
      response.blob().then((blob) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.style.width = "50px";
        segmentsContainer.appendChild(img);
      });
    });
  }

  processing_div.style.display = "flex";
  results_div.style.display = "flex";

  processing_div.scrollIntoView({ behavior: "smooth" });
  const data = new FormData();

  data.append("file", fileInput);

  await fetch(url_backend + "/predict", { method: "GET" }).then((response) => {
    response.json().then((data) => {
      console.log(data);

      codeToHtml(data["latex"], {
        lang: "latex",
        theme: "one-dark-pro",
        colorReplacements: {
          "#282c34": "#0b0b0b",
        },
      }).then((html) => {
        latex_code.innerHTML = html;
      });

      codeToHtml(data["python"], {
        lang: "python",
        theme: "one-dark-pro",
        colorReplacements: {
          "#282c34": "#0b0b0b",
        },
      }).then((html) => {
        python_code.innerHTML = html;
      });
    });
  });
}

startButton.addEventListener("click", getCodePrediction);






function dropAreaInit() {
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

    fileUpload(event.dataTransfer.files);
  });
}

file_input.addEventListener("change", (event) => {
  fileUpload(event.target.files);
});

function changeUploadState(state, file = null) {
  const uploadStateInitial = document.getElementById("upload-state-0");
  const uploadStateLoading = document.getElementById("upload-state-1");
  const uploadStateResult = document.getElementById("upload-state-2");

  const foregroundArea = document.getElementsByClassName("fg")[0];
  const uploadPreview = document.getElementById("upload-preview");

  if (state === 0) {
    uploadStateLoading.style.opacity = 0;
    // Wait 0.2s for the opacity transition to finish
    setTimeout(() => {
      uploadStateLoading.style.display = "none";
      uploadStateInitial.style.display = "block";

      foregroundArea.style.padding = "125px 0";

      setTimeout(() => {
        foregroundArea.style.setProperty(
          "--upload-area-hover",
          "var(--primary)"
        );
        upload_svg.style.display = "block";

        uploadStateInitial.style.opacity = 1;
      }, 100);
    }, 200);
  }

  if (state === 1) {
    uploadStateInitial.style.opacity = 0;
    foregroundArea.style.setProperty(
      "--upload-area-hover",
      "var(--background)"
    );
    upload_svg.style.display = "none";
    // Wait 0.2s for the opacity transition to finish
    setTimeout(() => {
      uploadStateInitial.style.display = "none";
      uploadStateLoading.style.display = "block";
      foregroundArea.parentElement.style.padding = "10px 10px";

      uploadStateResult.style.display = "none";
      uploadPreview.style.display = "none";
      foregroundArea.style.width = "100%";

      foregroundArea.style.padding = "25px 25px";

      setTimeout(() => {
        uploadStateLoading.style.opacity = 1;
        uploadStateResult.style.transform = "translateY(-50px)";
        uploadStateResult.style.opacity = 0;
        uploadPreview.style.opacity = 0;
      }, 100);
    }, 200);
  }

  if (state === 2) {
    uploadPreview.src = URL.createObjectURL(file);
    upload_svg.style.display = "none";
    uploadStateLoading.style.opacity = 0;
    // Wait 0.2s for the opacity transition to finish
    setTimeout(() => {
      uploadStateLoading.style.display = "none";
      uploadPreview.style.display = "block";
      uploadStateResult.style.display = "flex";
      foregroundArea.parentElement.style.padding = "80px 10px";
      foregroundArea.style.padding = "5px 5px";
      foregroundArea.style.width = "fit-content";

      setTimeout(() => {
        uploadStateResult.style.opacity = 1;
        uploadStateResult.style.transform = "translateY(0px)";
        foregroundArea.style.setProperty(
          "--upload-area-hover",
          "var(--primary)"
        );

        uploadPreview.style.opacity = 1;
      }, 100);
    }, 200);
  }
}

dropAreaInit();


dropArea.firstElementChild.addEventListener("click", () => {
  file_input.value = null;
  file_input.click();
});
