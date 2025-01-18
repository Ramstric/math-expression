import { setUploadAreaState } from "./upload-area-states.js";
import { backendURL } from "./config.js";

export { uploadFile, uploadedImage };

let uploadedImage = null;

async function uploadFile(file) {
  // First, check if the file type is valid (.jpg, .jpeg, .png)
  try {
    await assertFileTypes(file);
  } catch (error) {
    alert(error.message);
    return;
  }

  // Set the uploadArea state to 1 (loading)
  await setUploadAreaState(1);

  // POST Request to the backend
  try {
    await sendFile(file);
  } catch (error) {
    console.error("Error:", error);
    setUploadAreaState(0);
    return;
  }

  // Prepare uploadedImage for further processing
  uploadedImage = file;

  return;
}

async function assertFileTypes(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type");
  }
}

async function sendFile(file) {
  const data = new FormData();

  data.append("file", file);

  fetch(backendURL + "/upload", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      setTimeout(() => setUploadAreaState(2, file), 1000); // <-- Proceed to state 2 (Pending processing of the uploaded image)
      return response.json();
    })
    .catch((error) => {
      setUploadAreaState(0);
      return error;
    });
}
