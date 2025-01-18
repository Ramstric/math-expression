import { backendURL } from "./config.js";
import { getCodePrediction } from "./api-prediction.js";

const startButton = document.getElementById("start-bttn");

const divDigitalProcessing = document.getElementsByClassName("processing")[0];
const divSegments = document.getElementById("segments-container");
const divResults = document.getElementsByClassName("results")[0];

let numSegments = 0;

async function startImageProcessing() {
  // Start the image processing and get the number of resulting segments
  await fetch(backendURL + "/process", { method: "GET" }).then((response) => {
    response.json().then((data) => {
      numSegments = data["num_segments"];
    });
  });

  // Download the processed image
  await fetch(backendURL + "/download?image=processed", {
    method: "GET",
  }).then((response) => {
    response.blob().then((blob) => {
      document.getElementById("img-processed").src = URL.createObjectURL(blob);
    });
  });

  // Download the image with detected contours
  await fetch(backendURL + "/download?image=contours", {
    method: "GET",
  }).then((response) => {
    response.blob().then((blob) => {
      document.getElementById("img-contours").src = URL.createObjectURL(blob);
    });
  });

  // Clear segments container
  divSegments.innerHTML = "";

  // Download and display each segment
  for (let i = 0; i < numSegments; i++) {
    await fetch(backendURL + "/download?image=segmented&n=" + i, {
      method: "GET",
    }).then((response) => {
      response.blob().then((blob) => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.style.width = "50px";

        divSegments.appendChild(img);

        // Hover effect over each segment
        addEventListener("mouseover", () => {
          img.style.cursor = "pointer";
        });

        addEventListener("mouseout", () => {
          img.style.cursor = "default";
        });

      });
    });
  }

  // Display the digital processing and results sections
  divDigitalProcessing.style.display = "flex";
  divResults.style.display = "flex";

  divDigitalProcessing.scrollIntoView({ behavior: "smooth" });

  // Start the prediction of the model
  try {
    await getCodePrediction();
  } catch (error) {
    console.error("Error:", error);
  }

  return;
}

startButton.addEventListener("click", startImageProcessing);
