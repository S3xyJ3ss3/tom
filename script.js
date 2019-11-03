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
    for (let [prop,         mod ] of [
         ["top",            "px"],
         ["right",          "px"], // these two (right and bottom)
         ["bottom",         "px"], // are only used as getters
         ["left",           "px"],
         ["width",          "px"],
         ["height",         "px"],
         ["borderWidth",    "px"],
         ["backgroundSize", "%" ],
         ["size"                ]
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

  get rect() {
    if (this.memo.rect) return this.memo.rect;
    return this.memo.rect = this.$.getBoundingClientRect()
  }
  get distFrom() {
    if (this.memo.distFrom) return this.memo.distFrom;
    return this.memo.distFrom = {
      top: this.rect.top,
      right: document.body.clientWidth - this.rect.left - this.rect.width,
      bottom: document.body.clientHeight - this.rect.top - this.rect.height,
      left: this.rect.left
    }
  }

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

  // eof ElemFace class
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
        aside.addEventListener("mouseleave", popup.close)
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
    // config
    cfg: {
      speed: { // animation speed
        horz:    5,
        vert:    2
      },
      marg: { // margins for <p> from screen edge when opening
        top:     5,
        right:   5,
        bottom:  5,
        left:   30
      }
    },

    // open() and close() event handlers both call change()
    open: event => popup.change("open", event),
    close: event => popup.change("close", event),
    
    // @changeTo: String "open" or "close"
    // @event: MouseEvent passed from event handler
    change: (changeTo, event) => {
      // confirm <aside> ref
      let aside = event.target;
      while (aside.nodeName !== "ASIDE") {
        aside = aside.parentNode
      }
      const ct = changeTo.substring(0, 4); // i use vim btw
      if ( // if popup is already doing what you want to do, or
        popup.status.includes(ct) ||
        // a different popup is open
        popup.status !== "closed" && popup.aside.$ !== aside
      ) { // ignore event
        return
      }
      // otherwise set new targets if different
      if (popup.aside.$ !== aside) {
        popup.aside.$ = aside;
        popup.p = new ElemFace(aside.children[0]);
        popup.fig = new ElemFace(aside.children[1])
      }

      // the only events remaining call for a status change
      // set new status depending on current status
      switch(popup.status) {
        // if opening from closed (i.e. init popup)
        case "closed":
          // add some styles
          popup.aside.$.classList.add("open");
          // save initial location
          popup.initialStyles = {}
          for (const prop of [
            "size",
            "left", "right",
            "top", "bottom"
          ]) {
            popup.initialStyles[prop] = popup.p[prop]
          }
          // get scrollWidth if text was one line
          popup.p.oneLineWidth = popup.p.check(
            "scrollWidth", {whiteSpace: "nowrap"}
          );
          popup.status = "openingHorizontal";
          // kickoff animation
          popup.frame();
          break;

        // if opening/closing animation interrupted, reverse
        case "openingHorizontal":
        case "openingVertical":
        case "closingVertical":
        case "closingHorizontal":
          popup.status = ct + popup.status.substring(4);
          break;

        // if closing from fullscreen
        case "openedFull":
          // reverse Full changes like background dim, scroll override
          popup.aside.$.style.overflow = "hidden";
          popup.status = "openedVertical";
          // do not break so next case block executes
        // if closing from "openedVertical" or "openedHorizontal"
        case "openedHorizontal":
        case "openedVertical": 
          popup.status = "closing" + popup.status.substring(6);
          // kickoff animation
          popup.frame()
       }
    }, 

    frame: () => {
      // update according to popup status
      switch(popup.status) {
        case "openingHorizontal":
          // callback = executes once when transition to openingVertical
          const callback = () => {
            popup.p.scrollHeight = popup.p.$.scrollHeight;
            popup.status = "openingVertical"
          };
          // check each frame if whole message showing
          if (popup.p.oneLineWidth < popup.p.width) {
            callback();
            break
          }
          popup.move([
            { // move left wall left
              what: popup.p,
              how: {
                left: -popup.cfg.speed.horz,
                width: popup.cfg.speed.horz
              },
              until: popup.p.distFrom.left - popup.cfg.marg.left
            }, { // move right wall right
              what: popup.p,
              how: {
                width: popup.cfg.speed.horz
              },
              until: popup.p.distFrom.right - popup.cfg.marg.right
            }, { // grow face
              what: popup.fig,
              how: {
                size: 1,
                borderWidth: 0.1
              },
              until: 44 - popup.fig.size
            }, { // move face left
              what: popup.fig,
              how: {
                left: -popup.cfg.speed.horz
              },
              until: popup.fig.distFrom.left - 10
            }
          ], callback);
          break;

        case "openingVertical":
          if (popup.p.scrollHeight < popup.p.height) // (1)
            return popup.status = "openedVertical";
          popup.move([ // (2)
            { // move <p> top wall up
              what: popup.p,
              how: {
                top: -popup.cfg.speed.vert,
                height: popup.cfg.speed.vert
              },
              until: popup.p.distFrom.top - popup.cfg.marg.top
            }, { // move bottom wall down
              what: popup.p,
              how: {
                height: popup.cfg.speed.vert
              },
              until: popup.p.distFrom.bottom - popup.cfg.marg.bottom
            }
          ], () => { // (3) callback
            popup.aside.$.style.overflow = "scroll";
            return popup.status = "openedFull"
          });
          break;

        case "closingVertical": 
          popup.move([ // (2)
            { // move top wall down
              what: popup.p,
              how: {
                top: popup.cfg.speed.vert,
                height: -popup.cfg.speed.vert
              },
              until: popup.initialStyles.top - popup.p.top
            }, { // move bottom wall down
              what: popup.p,
              how: {
                height: -popup.cfg.speed.vert
              },
              until: popup.initialStyles.bottom - popup.p.bottom
            }
          ], () => { // (3) callback
            popup.status = "closingHorizontal";
          });
          break;

        case "closingHorizontal":
          const dist = {
            left: popup.initialStyles.left - popup.p.left,
            right: popup.initialStyles.right - popup.p.right 
          }
          if (dist.left === 0 && dist.right === 0) {
            // remove styles
            popup.aside.$.classList.remove("open");
            return popup.status = "closed";
          }
          popup.move([ // (2)
            { // move left wall right
              what: popup.p,
              how: {
                left: popup.cfg.speed.horz,
                width: -popup.cfg.speed.horz
              },
              until: dist.left
            }, { // move right wall left
              what: popup.p,
              how: {
                width: -popup.cfg.speed.horz
              },
              until: dist.right
            }, { // grow face
              what: popup.fig,
              how: {
                size: -1,
                borderWidth: -0.1
              },
              until: popup.fig.size - popup.initialStyles.size
            }, { // move face left
              what: popup.fig,
              how: {
                left: popup.cfg.speed.horz
              },
              until: popup.initialStyles.left - popup.fig.left
            }
          ]) // no callback since handled
      }

      // clear memoised values
      for (let e of [popup.p, popup.fig]) e.memo = {};

      window.requestAnimationFrame(popup.frame)

      // eof frame function
    },

    // popup.move() is called once per frame when status is opening/closing
    move: (movements, callback) => {
      // if status is different, clear cache
      if (!popup.cache || popup.status !== popup.cache.status) {
        popup.cache = {status: popup.status}
      }
      movements.forEach((movement, i) => {
        // movement: object with keys below
        //   what: object of ElemFace class (popup.p or popup.fig)
        //   how: object whose keys are the properties of the elemFace
        //     to shift and the values are the amounts to shift these by
        //   until: a subtraction equation we aim to decrease to zero by these shifts
        const {what, how, until} = movement;
        if (until !== 0) {
          for (let style in how) {
            const shift = how[style];
            const {untilPrev} = popup.cache;
            // if going in wrong direction, correct
            if (untilPrev && until > untilPrev[i]) {
              what[style] -= until * Math.sign(shift)
            } // if going full speed would overshoot target, just shift to target
            else if (untilPrev && Math.abs(shift) > until) {
              what[style] += until * Math.sign(shift)
            } // otherwise just move towards target by speed
            else {
              what[style] += shift;
              popup.cache.untilPrev = movements.map(m => m.until)
            }
          }
        }
      });
      if (movements.every(movement => movement.until === 0)) {
        if (callback) callback()
      }
    }

    // eof popup object
  }

  // eof comedy function
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

  link.addEventListener("mouseleave", event => {

    box.style.display = "none";
  });
}
  
const also = "O Captain! My Captain! A grainy photo of the author, peeking out sheepishly from behind a red curtain. He appears to be wearing a school blazer."

*/

