/* comedy.html
 */

// javascript
//   replace links with pictures of tom's face inside larger div 
//   add event listeners to wider divs
//   event listeners:
//     mouseover: div expands, first to the left and then down, bringing the image
//       of tom's face with it
//     after expansion then words fade in
//     tom's face should poke out on the left
// css
//   divs are size of their contents until they take up almost full page 












/* index.html
 */

// cache of blobs 
const blobs = {};

// called when dom content loaded
function init() {

  // create box for floating images/text to appear in
  const box = document.createElement("div");
  box.id = "fbox";
  document.body.appendChild(box);

  // find floater links and add listeners to them
  const flinks = document.querySelectorAll("a.floater");
  for (let i = 0; i < flinks.length; i++) {
    flisten(flinks[i], box);
  }
}

// add event listeners to all the floater links
function flisten(link, box) {
   
  link.addEventListener("mousemove", event => {

    box.style.display = "block";
    box.style.left = event.clientX + "px";
    box.style.top = event.clientY + "px";

    console.log(event);
  });

  link.addEventListener("mouseout", event => {

    box.style.display = "none";
  });
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
