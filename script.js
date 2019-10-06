/* global stuff
 */

// selectors shorthand
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// remove element
const rm = el => el.parentNode.removeChild(el);


/* overall init
 */
function index() {
}

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

function comedy() {

  // attach .js class to main to trigger css animations
  $("main").classList.add("js");

  // remove notes into an array
  const notes = rm($("#notes")).children;

  // replace each link to note with <details> block
  $$("a[id^=r]").forEach((a, i) => a.outerHTML = `
    <details class="note">
      <summary class="face"></summary>${
        notes[i].outerHTML
          .replace(/ <a(.*)<\/a>/,"")
          .replace(/\[([0-9]|10)] /,"")
      }</details>
  `);

}







/* index.html
 */

/*
// cache of blobs 
const blobs = {};

// called when dom content loaded
function init() {

  // create box for floating images/text to appear in
    const box = document.createElement("aside");
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
  
const also = "O Captain! My Captain! A grainy photo of the author, peeking out sheepishly from behind a red curtain. He appears to be wearing a school blazer."

*/

