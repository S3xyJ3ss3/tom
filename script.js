/* global stuff
*/

"use strict";

// selectors shorthand
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// remove element
const rm = el => el.parentNode.removeChild(el);

// class for elements with attributes stored as strings w units
class ElemFace {
  constructor(element) {
    this.$ = element;
    this.memo = {};
    // define properties for which getters and setters are needed
    for (let [prop, 		mod ] of [
             ["left", 		"px"],
	     ["top", 		"px"],
	     ["width",		"px"],
	     ["height",		"px"],
	     ["backgroundSize", "%" ],
	     ["size"		    ]
    ]) {
      // if array of above has second item
      if (mod) Object.defineProperty(this, prop, {
	  get: () => {
	    // if not already memoised, do so, return memo as float
	    if (this.memo[prop] === undefined)
	      this.memo[prop] = parseFloat(
		this.$.style[prop] || getComputedStyle(this.$)[prop]
	      );
	    return this.memo[prop]
	  },
	  set: val => {
	    this.memo[prop] = val;
	    this.$.style[prop] = val + mod
	  }
	});
      // else deal with special cases
      switch(prop) {
	case "size":
	  Object.defineProperty(this, prop, {
	    get: () => this.width,
	    set: val => {
	      this.width = val;
	      this.height = val
	    }
	  })
      }
    }
  }

  get distFrom() {
    if (this.memo.distFrom) return this.memo.distFrom;
    const rect = this.$.getBoundingClientRect();
    return this.memo.distFrom = {
      top: rect.top - this.top,
      right: document.body.clientWidth - (rect.left + this.left + this.width),
      bottom: document.body.clientHeight - (rect.top + this.top + this.height),
      left: rect.left + this.left
    }
  }
  get speed() {return 6}

  check(attr, inConditions) {
    const clone = {
      $: this.$.cloneNode(true),
      styles: {
	...{
	  height: "0",
	  overflow: "hidden",
	},
	...inConditions
      }
    }
    for (let s in clone.styles) clone.$.style[s] = clone.styles[s];
    this.$.parentNode.appendChild(clone.$);
    const check = clone.$[attr];
    rm(clone.$);
    return check
  }

  clearCache() {
    this.memo = {}
  }
}



/* comedy.html
*/

function comedy() {

  // attach .js class to main to trigger some css
  $("main").classList.add("js");

  // remove notes into an array
  const notes = rm($("aside")).children;
  
  // replace footnote links with in-text <aside>
  $$("article a").forEach((a, i) => a.outerHTML = `
    <aside>
      <p>${
	notes[i].innerText.substring(4, notes[i].innerText.length - 7)
      }</p>
      <figure></figure>
    </aside>
  `);
  
  // add events depending on whether using touchscreen/mouse
  function initListen(event) {
    if (initListen.isAdded) return;
    initListen.isAdded = true;
    if (event.type === "mouseover") {
      $$("aside").forEach(aside => {
	aside.addEventListener("mouseover", popup.open);
	aside.addEventListener("mouseout", popup.close)
      })
    }
    else if (event.type === "click") {
      $$("aside").forEach(aside => {
	aside.addEventListener("click", popup.open)
      });
      // if touch outside popup, close
      document.addEventListener("click", touch => {
	if (popup.aside.contains(touch.target)) return;
	touch.preventDefault();
	popup.close(touch)
      })
    }
    // handle the initial event
    popup.open(event)  
  }
  $$("aside").forEach(aside => {
    aside.addEventListener("mouseover", initListen, {once: true});
    aside.addEventListener("click", initListen, {once: true})
  });

  // reference to current note popup
  const popup = {
    aside: {$: null}, // <aside> element
    status: "closed", // | "opening%" | "opened%" | "closing%"
    		      // % = stage of animation or stage when it stopped
		      //   = ("Horizontal"|"Vertical"|"Full")
  
    // open() and close() event handlers both call change()
    open: event => popup.change("open", event),
    close: event => popup.change("close", event),

    // @changeTo: String "open" or "close"
    // @event: MouseEvent passed from event handler
    change: (changeTo, event) => {
      // confirm <aside> ref
      let aside = event.target;
      while (aside.nodeName !== "ASIDE")
	aside = aside.parentNode;
      const ct = changeTo.substring(0, 4); // i use vim btw
      if ( // if popup is already doing what you want to do, or
	popup.status.includes(ct) ||
        // a different popup is open
        popup.status !== "closed" && popup.aside.$ !== aside
      )	return; // ignore
      // otherwise set new targets if different
      if (popup.aside.$ !== aside) {
	popup.aside.$ = aside;
	popup.p = new ElemFace(aside.children[0]);
	popup.fig = new ElemFace(aside.children[1])
      }

      // the only events remaining call for a status change;
      // set new status depending on current status
      if (popup.status.match(/ing/)) {
	popup.status = ct + popup.status.substring(4)
      }       // else if the status doesn't have "ing" in it: leaving 
      else {  // ("closed"|"openedFull"|"openedVertical"|"openedHorizontal")
	switch (popup.status) {
	  // opening from closed (init)
	  case "closed":
	    // get scrollWidth if text was one line
	    popup.p.oneLineWidth = popup.p.check(
	      "scrollWidth", {whiteSpace: "nowrap"}
	    );
	    popup.status = "openingHorizontal";
	    break;
	  // closing from "openedVertical" or "openedHorizontal"
	  default: 
	    popup.status = "closing" + popup.status.substring(6);
	    break;
	  // closing from fullscreen
	  case "openedFull":
	    // reverse other Full changes like background dim, scroll override
	    popup.status = "closingVertical";
	}
	// kick off animation since is newly opening or closing
	popup.frame()
      }
    },

    frame: () => {
      // update according to popup status
      switch(popup.status) {
	case "openingHorizontal":
	  // if full text displaying, change status and finish animation
	  if (popup.p.oneLineWidth < popup.p.width)
	    return popup.status = "openedHorizontal";
	  // otherwise grow out left and right
	  const growLeft = popup.p.distFrom.left > 5;
	  const growRight = popup.p.distFrom.right > 5;
	  if (growLeft || growRight) {
	    if (growLeft) {
	      popup.p.left -= popup.p.speed;
	      popup.p.width += popup.p.speed
	    }
	    if (growRight)
	      popup.p.width += popup.p.speed
	  } else {
	    popup.p.scrollHeight = popup.p.$.scrollHeight;
	    popup.status = "openingVertical"
	  }
	  break;
	case "openingVertical":
	  if (popup.p.scrollHeight < popup.p.height)
	    return popup.status = "openedVertical";
	  const growUp = popup.p.distFrom.top > 5;
	  const growDown = popup.p.distFrom.bottom > 5;
	  if (growUp || growDown) {
	    if (growUp) {
	      popup.p.top -= popup.p.speed;
	      popup.p.height += popup.p.speed;
	    }
	    if (growDown)
	      popup.p.height += popup.p.speed;
	  } else {
	    // do fullscreen stuff
	    popup.status = "openedFull"
	  }
	  break;
	case "closingVertical":
	  const shrinkUp = popup.p.top < -12.8;
	  const shrinkDown = popup.p.height > 24;
	  if (shrinkUp || shrinkDown) {
	    if (shrinkUp) {
	      popup.p.top += popup.p.speed;
	      popup.p.height -= popup.p.speed;
	    }
	    if (shrinkDown)
	      popup.p.height -= popup.p.speed;
	  } else {
	    // do fullscreen stuff
	    popup.status = "closingHorizontal"
	  }
	  break;
	case "closingHorizontal":
	  const shrinkLeft = popup.p.left < -3.2;
	  const shrinkRight = popup.p.width > 24;
	  if (shrinkLeft || shrinkRight) {
	    if (shrinkLeft) {
	      popup.p.left += popup.p.speed;
	      popup.p.width -= popup.p.speed
	    }
	    if (shrinkRight)
	      popup.p.width -= popup.p.speed
	  } else {
	    return popup.status = "closed"
	  }
      }
      for (let e of [popup.p, popup.fig]) e.clearCache();
      window.requestAnimationFrame(popup.frame)
    }
  }
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
  }but we could also get snacks/supper from the 
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

