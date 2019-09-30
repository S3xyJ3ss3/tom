/*

init
- add event listeners
  - deal with images and text as much together as you can

global blobs

function for loading images
function for loading text
function for loading in general

*/
 
function init() {
  console.log("test!");
}

window.addEventListener("DOMContentLoaded", init);













/*


function init() {
  addFloaters();
}

const blobs = {};



function addFloaters() {
  const imageLinks = document.querySelectorAll("a.image");
  for (let i = 0; i < imageLinks.length; i++) {
    const a = imageLinks[i];
    a.addEventListener("mouseover", () => {
      const href = a.getAttribute("href"); 

      if (href in blobs) {

      // add image whene it loads
      const image = new Image();
      imgLoad(href)
        .then(response => {
	  const imageURL = window.URL.createObjectURL(response);
	  image.src = imageURL;
	  a.appendChild(image);
	}, error => {
	  console.log(error);
	})
    });
  }
}

function imgLoad(url) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "blob";
    request.onload = () => {
      if (request.status === 200) {
	resolve(request.response);
      } else {
	reject(Error("Image didn't load successfully; error code:" + request.statusText));
      }
    };
    request.onerror = () => {
      reject(Error("Network error."));
    };
    request.send();
  });
}

window.addEventListener("DOMContentLoaded", init);

*/
