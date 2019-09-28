/*
  yeah i went into this without thinking at all
  how are we structuring this

should we add all the links first?
that way we can first build the logic that actually deals with the kind of link they are
if they're an image it's pretty clear what to do
if they're another html page they'll need to be parsed by the xmlhttprequest and i'm not quite sure how to do that yet
or the html page can probable even be read as text and then searched with regex and read as a document fragment's innerhtml or sth

okay you're going to need

init
- add event listeners
  - deal with images and text as much together as you can

global blobs

function for loading images

function for loading text

function for loading in general

 */


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

