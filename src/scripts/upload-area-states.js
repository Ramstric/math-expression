export { setUploadAreaState };

const uploadStateInitial = document.getElementById("upload-state-0");
const uploadStateLoading = document.getElementById("upload-state-1");
const uploadStateResult = document.getElementById("upload-state-2");
const foregroundArea = document.getElementsByClassName("fg")[0];
const uploadPreview = document.getElementById("upload-preview");
const upload_svg = document.getElementById("upload-svg");

async function setUploadAreaState(state, file = null) {
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

  else if (state === 1) {
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

  else if (state === 2) {
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

  else {
    throw new Error("Invalid state");
  }

}
