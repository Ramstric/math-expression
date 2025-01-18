import { codeToHtml } from "shiki";
import { backendURL } from "./config.js";
import { uploadedImage } from "./api-upload.js";

export { getCodePrediction };

const codeAreaLatex = document.getElementById("latex-code");
const codeAreaPython = document.getElementById("python-code");

async function getCodePrediction() {
  const data = new FormData();

  data.append("file", uploadedImage);

  await fetch(backendURL + "/predict", { method: "GET" }).then((response) => {
    response.json().then((data) => {
      codeToHtml(data["latex"], {
        lang: "latex",
        theme: "one-dark-pro",
        colorReplacements: {
          "#282c34": "#0b0b0b",
        },
      }).then((html) => {
        codeAreaLatex.innerHTML = html;
      });

      codeToHtml(data["python"], {
        lang: "python",
        theme: "one-dark-pro",
        colorReplacements: {
          "#282c34": "#0b0b0b",
        },
      }).then((html) => {
        codeAreaPython.innerHTML = html;
      });
    });
  });

  return;
}
