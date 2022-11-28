importScripts('./jsQR.js');

addEventListener('message', event => {
  /** @type {ImageData} */
  let imageData = event.data;
  let code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  postMessage(code);

  code = null;
  imageData = null;
})